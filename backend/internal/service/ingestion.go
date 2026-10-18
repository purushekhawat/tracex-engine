package service

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/sih26182/tracex-backend/internal/connector"
	"github.com/sih26182/tracex-backend/internal/model"
	"github.com/sih26182/tracex-backend/internal/repository"
)

type InvestigationProgress struct {
	InvestigationID string    `json:"investigation_id"`
	Status          string    `json:"status"` // queued, running, completed, failed
	CurrentHop      int       `json:"current_hop"`
	MaxHops         int       `json:"max_hops"`
	NodesProcessed  int       `json:"nodes_processed"`
	EdgesProcessed  int       `json:"edges_processed"`
	ProgressPercent float64   `json:"progress_percent"`
	Message         string    `json:"message"`
	LastUpdated     time.Time `json:"last_updated"`
}

type IngestionService struct {
	factory  *connector.ProviderFactory
	pgRepo   repository.PostgresRepository
	neoRepo  repository.Neo4jRepository
	progress map[string]*InvestigationProgress
	mu       sync.RWMutex
}

func NewIngestionService(factory *connector.ProviderFactory, pgRepo repository.PostgresRepository, neoRepo repository.Neo4jRepository) *IngestionService {
	return &IngestionService{
		factory:  factory,
		pgRepo:   pgRepo,
		neoRepo:  neoRepo,
		progress: make(map[string]*InvestigationProgress),
	}
}

func (s *IngestionService) StartInvestigation(ctx context.Context, caseID, suspectAddress, chainCode string, maxHops int) (*model.Investigation, error) {
	if maxHops <= 0 {
		maxHops = 3
	}

	provider, err := s.factory.GetProvider(chainCode)
	if err != nil {
		return nil, fmt.Errorf("invalid blockchain network: %w", err)
	}

	if !provider.ValidateAddress(suspectAddress) {
		return nil, connector.ErrInvalidAddress
	}

	invID := uuid.New().String()
	now := time.Now().UTC()

	inv := &model.Investigation{
		ID:             invID,
		CaseID:         caseID,
		SuspectAddress: suspectAddress,
		BlockchainID:   chainCode,
		DepthHops:      maxHops,
		Status:         "QUEUED",
		RiskScore:      0.0,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	if err := s.pgRepo.CreateInvestigation(ctx, inv); err != nil {
		return nil, fmt.Errorf("failed to persist investigation: %w", err)
	}

	// Create Audit Trail Record
	audit := &model.AuditLog{
		ID:           uuid.New().String(),
		Action:       "INVESTIGATION_SUBMITTED",
		ResourceType: "investigation",
		ResourceID:   invID,
		IPAddress:    "127.0.0.1",
		UserAgent:    "TRACE-X Core Engine",
		Timestamp:    now,
	}
	_ = s.pgRepo.CreateAuditLog(ctx, audit)

	// Initialize Progress Track
	s.mu.Lock()
	s.progress[invID] = &InvestigationProgress{
		InvestigationID: invID,
		Status:          "QUEUED",
		CurrentHop:      0,
		MaxHops:         maxHops,
		NodesProcessed:  1,
		EdgesProcessed:  0,
		ProgressPercent: 0.0,
		Message:         "Investigation queued for multi-hop graph ingestion",
		LastUpdated:     now,
	}
	s.mu.Unlock()

	// Launch Async Pipeline Goroutine
	go s.processPipelineBackground(invID, suspectAddress, chainCode, maxHops)

	return inv, nil
}

func (s *IngestionService) GetProgress(invID string) (*InvestigationProgress, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	prog, exists := s.progress[invID]
	if !exists {
		return nil, fmt.Errorf("investigation progress not found for id: %s", invID)
	}
	return prog, nil
}

func (s *IngestionService) processPipelineBackground(invID, suspectAddress, chainCode string, maxHops int) {
	bgCtx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
	defer cancel()

	s.updateProgress(invID, "RUNNING", 1, maxHops, 1, 0, 10.0, "Selecting blockchain provider and starting hop traversal")
	_ = s.pgRepo.UpdateInvestigationStatus(bgCtx, invID, "RUNNING", 0.0)

	provider, err := s.factory.GetProvider(chainCode)
	if err != nil {
		s.updateProgress(invID, "FAILED", 0, maxHops, 0, 0, 0.0, fmt.Sprintf("Provider lookup failed: %v", err))
		_ = s.pgRepo.UpdateInvestigationStatus(bgCtx, invID, "FAILED", 0.0)
		return
	}

	visited := make(map[string]bool)
	queue := []string{suspectAddress}
	visited[suspectAddress] = true

	nodesProcessed := 0
	edgesProcessed := 0

	for hop := 1; hop <= maxHops && len(queue) > 0; hop++ {
		nextQueue := make([]string, 0)
		s.updateProgress(invID, "RUNNING", hop, maxHops, nodesProcessed, edgesProcessed, float64(hop)/float64(maxHops)*85.0, fmt.Sprintf("Processing hop %d of %d", hop, maxHops))

		for _, currentAddress := range queue {
			// Persist Wallet Node in Postgres & Neo4j
			wallet := &model.Wallet{
				ID:           uuid.New().String(),
				BlockchainID: chainCode,
				Address:      currentAddress,
				WalletType:   "EO_WALLET",
				CreatedAt:    time.Now().UTC(),
				UpdatedAt:    time.Now().UTC(),
			}
			_ = s.pgRepo.SaveWallet(bgCtx, wallet)
			_ = s.neoRepo.MergeWalletNode(bgCtx, currentAddress, chainCode, wallet.WalletType)
			nodesProcessed++

			// Fetch Transactions with Retry and Rate-Limit Handling
			txs, fetchErr := s.fetchTransactionsWithRetry(bgCtx, provider, currentAddress, 1, 20)
			if fetchErr != nil {
				log.Printf("[IngestionPipeline] [WARN] [inv_id: %s] [addr: %s] Transaction fetch failed: %v", invID, currentAddress, fetchErr)
				continue
			}

			for _, tx := range txs {
				_ = s.pgRepo.SaveTransaction(bgCtx, &tx)
				_ = s.neoRepo.MergeTransactionNode(bgCtx, &tx)
				_ = s.neoRepo.CreateTransactionEdges(bgCtx, &tx)
				edgesProcessed += 2

				// Add counterpart address to next hop queue if unvisited
				targetAddr := tx.ToAddress
				if targetAddr == currentAddress {
					targetAddr = tx.FromAddress
				}
				if targetAddr != "" && !visited[targetAddr] {
					visited[targetAddr] = true
					nextQueue = append(nextQueue, targetAddr)
				}
			}
		}

		queue = nextQueue
	}

	// Complete Pipeline Execution
	s.updateProgress(invID, "COMPLETED", maxHops, maxHops, nodesProcessed, edgesProcessed, 100.0, "Multi-hop graph ingestion completed successfully")
	_ = s.pgRepo.UpdateInvestigationStatus(bgCtx, invID, "COMPLETED", 75.0)

	log.Printf("[IngestionPipeline] [INFO] [inv_id: %s] Pipeline finished. Total Nodes: %d, Edges: %d", invID, nodesProcessed, edgesProcessed)
}

func (s *IngestionService) fetchTransactionsWithRetry(ctx context.Context, provider connector.BlockchainProvider, address string, page, limit int) ([]connector.NormalizedTransaction, error) {
	maxRetries := 3
	backoff := 200 * time.Millisecond

	for attempt := 1; attempt <= maxRetries; attempt++ {
		txs, err := provider.GetTransactions(ctx, address, page, limit)
		if err == nil {
			return txs, nil
		}

		if err == connector.ErrRateLimited {
			log.Printf("[IngestionPipeline] Rate limited on attempt %d. Waiting %v before retry...", attempt, backoff)
			time.Sleep(backoff)
			backoff *= 2
			continue
		}

		if err == connector.ErrTimeout {
			log.Printf("[IngestionPipeline] Request timeout on attempt %d. Retrying...", attempt)
			time.Sleep(backoff)
			continue
		}

		return nil, err
	}

	return nil, fmt.Errorf("exceeded max retries for address: %s", address)
}

func (s *IngestionService) updateProgress(invID, status string, currentHop, maxHops, nodes, edges int, percent float64, message string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.progress[invID] = &InvestigationProgress{
		InvestigationID: invID,
		Status:          status,
		CurrentHop:      currentHop,
		MaxHops:         maxHops,
		NodesProcessed:  nodes,
		EdgesProcessed:  edges,
		ProgressPercent: percent,
		Message:         message,
		LastUpdated:     time.Now().UTC(),
	}
}

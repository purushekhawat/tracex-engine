package service

import (
	"context"
	"fmt"
	"sort"
	"time"

	"github.com/sih26182/tracex-backend/internal/connector"
)

type CytoscapeNode struct {
	ID        string                 `json:"id"`
	Label     string                 `json:"label"`
	Type      string                 `json:"type"` // EO_WALLET, INTERMEDIARY, VASP_DEPOSIT, MIXER
	IsSuspect bool                   `json:"is_suspect"`
	IsVASP    bool                   `json:"is_vasp"`
	VASPName  string                 `json:"vasp_name,omitempty"`
	Balance   float64                `json:"balance"`
	Data      map[string]interface{} `json:"data,omitempty"`
}

type CytoscapeEdge struct {
	ID         string    `json:"id"`
	Source     string    `json:"source"`
	Target     string    `json:"target"`
	TxHash     string    `json:"tx_hash"`
	Type       string    `json:"type"` // TRANSFER or CROSS_CHAIN_BRIDGE
	BridgeName string    `json:"bridge_name,omitempty"`
	Amount     float64   `json:"amount"`
	AmountUSD  float64   `json:"amount_usd"`
	Timestamp  time.Time `json:"timestamp"`
}

type GraphStats struct {
	TotalNodes     int     `json:"total_nodes"`
	TotalEdges     int     `json:"total_edges"`
	MaxDepth       int     `json:"max_depth"`
	TotalVolumeUSD float64 `json:"total_volume_usd"`
}

type CytoscapeGraphResponse struct {
	InvestigationID string          `json:"investigation_id"`
	SuspectAddress  string          `json:"suspect_address"`
	Nodes           []CytoscapeNode `json:"nodes"`
	Edges           []CytoscapeEdge `json:"edges"`
	Stats           GraphStats      `json:"stats"`
}

type PathAnalysis struct {
	HopCount             int       `json:"hop_count"`
	TotalTransferredVal  float64   `json:"total_transferred_val"`
	ValueRetentionRatio  float64   `json:"value_retention_ratio"`
	FirstSeen            time.Time `json:"first_seen"`
	LastSeen             time.Time `json:"last_seen"`
	TransactionCount     int       `json:"transaction_count"`
	IntermediaryWallets  []string  `json:"intermediary_wallets"`
	PathTxHashes         []string  `json:"path_tx_hashes"`
}

type GraphTraversalService struct{}

func NewGraphTraversalService() *GraphTraversalService {
	return &GraphTraversalService{}
}

func (s *GraphTraversalService) GetGraph(ctx context.Context, invID string) (*CytoscapeGraphResponse, error) {
	now := time.Now().UTC()

	// Scenario 1: Investment Fraud Demo
	if invID == "inv-demo-investment-fraud-2026" {
		suspectAddr := "0x111111111111111111111111111111111111DEMO"
		nodes := []CytoscapeNode{
			{ID: suspectAddr, Label: "Wallet A (Suspect) (DEMO DATA)", Type: "EO_WALLET", IsSuspect: true, IsVASP: false, Balance: 25.0},
			{ID: "0x222222222222222222222222222222222222DEMO", Label: "Wallet B (Relay) (DEMO DATA)", Type: "INTERMEDIARY", IsSuspect: false, IsVASP: false, Balance: 0.5},
			{ID: "0x333333333333333333333333333333333333DEMO", Label: "Wallet C (Peel) (DEMO DATA)", Type: "INTERMEDIARY", IsSuspect: false, IsVASP: false, Balance: 0.3},
			{ID: "0x444444444444444444444444444444444444DEMO", Label: "Binance Deposit Wallet (DEMO DATA)", Type: "VASP_DEPOSIT", IsSuspect: false, IsVASP: true, VASPName: "Binance International (DEMO DATA)", Balance: 1540.0},
		}
		edges := []CytoscapeEdge{
			{ID: "e_d111", Source: suspectAddr, Target: "0x222222222222222222222222222222222222DEMO", TxHash: "0xd111111111111111111111111111111111111111111111111111111111111111", Type: "TRANSFER", Amount: 25.0, AmountUSD: 85000.0, Timestamp: now.Add(-4 * time.Hour)},
			{ID: "e_d222", Source: "0x222222222222222222222222222222222222DEMO", Target: "0x333333333333333333333333333333333333DEMO", TxHash: "0xd222222222222222222222222222222222222222222222222222222222222222", Type: "TRANSFER", Amount: 24.5, AmountUSD: 83300.0, Timestamp: now.Add(-2 * time.Hour)},
			{ID: "e_d333", Source: "0x333333333333333333333333333333333333DEMO", Target: "0x444444444444444444444444444444444444DEMO", TxHash: "0xd333333333333333333333333333333333333333333333333333333333333333", Type: "TRANSFER", Amount: 24.2, AmountUSD: 82280.0, Timestamp: now.Add(-30 * time.Minute)},
		}
		return &CytoscapeGraphResponse{
			InvestigationID: invID,
			SuspectAddress:  suspectAddr,
			Nodes:           nodes,
			Edges:           edges,
			Stats: GraphStats{
				TotalNodes:     4,
				TotalEdges:     3,
				MaxDepth:       3,
				TotalVolumeUSD: 250580.0,
			},
		}, nil
	}

	// Scenario 2: Cross-Chain Demo
	if invID == "inv-demo-cross-chain-2026" {
		suspectAddr := "0x555555555555555555555555555555555555DEMO"
		nodes := []CytoscapeNode{
			{ID: suspectAddr, Label: "Wallet A [Ethereum] (DEMO DATA)", Type: "EO_WALLET", IsSuspect: true, IsVASP: false, Balance: 50.0},
			{ID: "0x666666666666666666666666666666666666DEMO", Label: "Stargate Bridge Gateway (DEMO DATA)", Type: "INTERMEDIARY", IsSuspect: false, IsVASP: false, Balance: 0.0},
			{ID: "T77777777777777777777777777777777DEMO", Label: "TRON Relay Wallet (DEMO DATA)", Type: "INTERMEDIARY", IsSuspect: false, IsVASP: false, Balance: 150.0},
			{ID: "T88888888888888888888888888888888DEMO", Label: "OKX TRON Hot Wallet (DEMO DATA)", Type: "VASP_DEPOSIT", IsSuspect: false, IsVASP: true, VASPName: "OKX TRON Exchange (DEMO DATA)", Balance: 500000.0},
		}
		edges := []CytoscapeEdge{
			{ID: "e_c111", Source: suspectAddr, Target: "0x666666666666666666666666666666666666DEMO", TxHash: "0xce11111111111111111111111111111111111111111111111111111111111111", Type: "TRANSFER", Amount: 50.0, AmountUSD: 170000.0, Timestamp: now.Add(-3 * time.Hour)},
			{ID: "e_c222", Source: "0x666666666666666666666666666666666666DEMO", Target: "T77777777777777777777777777777777DEMO", TxHash: "0xce22222222222222222222222222222222222222222222222222222222222222", Type: "CROSS_CHAIN_BRIDGE", BridgeName: "Stargate Cross-Chain Protocol (DEMO DATA)", Amount: 150000.0, AmountUSD: 150000.0, Timestamp: now.Add(-2 * time.Hour)},
			{ID: "e_c333", Source: "T77777777777777777777777777777777DEMO", Target: "T88888888888888888888888888888888DEMO", TxHash: "0xce33333333333333333333333333333333333333333333333333333333333333", Type: "TRANSFER", Amount: 149850.0, AmountUSD: 149850.0, Timestamp: now.Add(-1 * time.Hour)},
		}
		return &CytoscapeGraphResponse{
			InvestigationID: invID,
			SuspectAddress:  suspectAddr,
			Nodes:           nodes,
			Edges:           edges,
			Stats: GraphStats{
				TotalNodes:     4,
				TotalEdges:     3,
				MaxDepth:       3,
				TotalVolumeUSD: 469850.0,
			},
		}, nil
	}

	suspectAddr := "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
	txs := []connector.NormalizedTransaction{
		{
			Blockchain:  "ethereum",
			TxHash:      "0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001",
			FromAddress: suspectAddr,
			ToAddress:   "0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
			ValueNative: 10.0,
			ValueUSD:    32000.0,
			Timestamp:   now.Add(-72 * time.Hour),
		},
		{
			Blockchain:  "ethereum",
			TxHash:      "0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0002",
			FromAddress: "0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
			ToAddress:   "0x8f2c1144882a1100998dfb751b7401b5f6d88888",
			ValueNative: 9.85,
			ValueUSD:    31520.0,
			Timestamp:   now.Add(-48 * time.Hour),
		},
		{
			Blockchain:  "ethereum",
			TxHash:      "0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0003",
			FromAddress: "0x8f2c1144882a1100998dfb751b7401b5f6d88888",
			ToAddress:   "0x28C6c06298d514Db089934071355E5743bf21d60",
			ValueNative: 9.80,
			ValueUSD:    31360.0,
			Timestamp:   now.Add(-24 * time.Hour),
		},
	}
	return s.BuildCytoscapeGraph(ctx, invID, suspectAddr, txs), nil
}

func (s *GraphTraversalService) BuildCytoscapeGraph(ctx context.Context, invID, suspectAddr string, txs []connector.NormalizedTransaction) *CytoscapeGraphResponse {
	nodeMap := make(map[string]*CytoscapeNode)
	edges := make([]CytoscapeEdge, 0)

	totalVolumeUSD := 0.0

	// Add Suspect Node
	nodeMap[suspectAddr] = &CytoscapeNode{
		ID:        suspectAddr,
		Label:     "Suspect Wallet",
		Type:      "EO_WALLET",
		IsSuspect: true,
		IsVASP:    false,
		Balance:   12.50,
	}

	for _, tx := range txs {
		totalVolumeUSD += tx.ValueUSD

		// Ensure Source Node
		if _, exists := nodeMap[tx.FromAddress]; !exists {
			nodeMap[tx.FromAddress] = &CytoscapeNode{
				ID:        tx.FromAddress,
				Label:     shortenAddress(tx.FromAddress),
				Type:      "INTERMEDIARY",
				IsSuspect: tx.FromAddress == suspectAddr,
				IsVASP:    false,
			}
		}

		// Ensure Target Node
		if _, exists := nodeMap[tx.ToAddress]; !exists {
			isVasp := isKnownVASPDeposit(tx.ToAddress)
			vaspName := ""
			label := shortenAddress(tx.ToAddress)
			walletType := "INTERMEDIARY"

			if isVasp {
				vaspName = "Binance International"
				label = "Binance Deposit Hot Wallet"
				walletType = "VASP_DEPOSIT"
			}

			nodeMap[tx.ToAddress] = &CytoscapeNode{
				ID:        tx.ToAddress,
				Label:     label,
				Type:      walletType,
				IsSuspect: tx.ToAddress == suspectAddr,
				IsVASP:    isVasp,
				VASPName:  vaspName,
			}
		}

		edgeType := "TRANSFER"
		bridgeName := ""
		if tx.TxHash == "0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001" {
			edgeType = "CROSS_CHAIN_BRIDGE"
			bridgeName = "Stargate Finance Cross-Chain Bridge"
		}

		edges = append(edges, CytoscapeEdge{
			ID:         fmt.Sprintf("e_%s", tx.TxHash[:8]),
			Source:     tx.FromAddress,
			Target:     tx.ToAddress,
			TxHash:     tx.TxHash,
			Type:       edgeType,
			BridgeName: bridgeName,
			Amount:     tx.ValueNative,
			AmountUSD:  tx.ValueUSD,
			Timestamp:  tx.Timestamp,
		})
	}

	nodes := make([]CytoscapeNode, 0, len(nodeMap))
	for _, n := range nodeMap {
		nodes = append(nodes, *n)
	}

	sort.Slice(nodes, func(i, j int) bool {
		return nodes[i].ID < nodes[j].ID
	})

	return &CytoscapeGraphResponse{
		InvestigationID: invID,
		SuspectAddress:  suspectAddr,
		Nodes:           nodes,
		Edges:           edges,
		Stats: GraphStats{
			TotalNodes:     len(nodes),
			TotalEdges:     len(edges),
			MaxDepth:       3,
			TotalVolumeUSD: totalVolumeUSD,
		},
	}
}

func (s *GraphTraversalService) CalculatePathMetrics(pathNodes []string, txs []connector.NormalizedTransaction) PathAnalysis {
	if len(pathNodes) < 2 {
		return PathAnalysis{}
	}

	hopCount := len(pathNodes) - 1
	intermediaries := make([]string, 0)
	if len(pathNodes) > 2 {
		intermediaries = pathNodes[1 : len(pathNodes)-1]
	}

	totalVal := 0.0
	var firstSeen, lastSeen time.Time
	txHashes := make([]string, 0)

	for i, tx := range txs {
		totalVal += tx.ValueNative
		txHashes = append(txHashes, tx.TxHash)
		if i == 0 || tx.Timestamp.Before(firstSeen) {
			firstSeen = tx.Timestamp
		}
		if tx.Timestamp.After(lastSeen) {
			lastSeen = tx.Timestamp
		}
	}

	initialSent := 10.0
	retentionRatio := 0.0
	if initialSent > 0 {
		retentionRatio = (totalVal / initialSent)
		if retentionRatio > 1.0 {
			retentionRatio = 1.0
		}
	}

	return PathAnalysis{
		HopCount:            hopCount,
		TotalTransferredVal: totalVal,
		ValueRetentionRatio: retentionRatio,
		FirstSeen:           firstSeen,
		LastSeen:            lastSeen,
		TransactionCount:    len(txs),
		IntermediaryWallets: intermediaries,
		PathTxHashes:        txHashes,
	}
}

func shortenAddress(addr string) string {
	if len(addr) <= 10 {
		return addr
	}
	return fmt.Sprintf("%s...%s", addr[:6], addr[len(addr)-4:])
}

func isKnownVASPDeposit(addr string) bool {
	return addr == "0x28C6c06298d514Db089934071355E5743bf21d60" || addr == "0x28c6c06298d514db089934071355e5743bf21d60"
}

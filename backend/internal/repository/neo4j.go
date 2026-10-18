package repository

import (
	"context"
	"fmt"
	"log"
	"sync"

	"github.com/sih26182/tracex-backend/internal/connector"
)

type Neo4jRepository interface {
	MergeWalletNode(ctx context.Context, address, blockchain, walletType string) error
	MergeTransactionNode(ctx context.Context, tx *connector.NormalizedTransaction) error
	CreateTransactionEdges(ctx context.Context, tx *connector.NormalizedTransaction) error
}

// Memory Neo4j Fallback repository when live Neo4j database is unreachable in dev
type MemoryNeo4jRepo struct {
	mu           sync.RWMutex
	wallets      map[string]bool
	transactions map[string]bool
	edges        []string
}

func NewMemoryNeo4jRepo() *MemoryNeo4jRepo {
	return &MemoryNeo4jRepo{
		wallets:      make(map[string]bool),
		transactions: make(map[string]bool),
		edges:        make([]string, 0),
	}
}

func (r *MemoryNeo4jRepo) MergeWalletNode(ctx context.Context, address, blockchain, walletType string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	key := fmt.Sprintf("%s:%s", blockchain, address)
	r.wallets[key] = true
	log.Printf("[Neo4j-Mock] MERGE (:Wallet {address: '%s', blockchain: '%s', wallet_type: '%s'})", address, blockchain, walletType)
	return nil
}

func (r *MemoryNeo4jRepo) MergeTransactionNode(ctx context.Context, tx *connector.NormalizedTransaction) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.transactions[tx.TxHash] = true
	log.Printf("[Neo4j-Mock] MERGE (:Transaction {tx_hash: '%s', blockchain: '%s', amount: %f})", tx.TxHash, tx.Blockchain, tx.ValueNative)
	return nil
}

func (r *MemoryNeo4jRepo) CreateTransactionEdges(ctx context.Context, tx *connector.NormalizedTransaction) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	edgeSent := fmt.Sprintf("(%s)-[:SENT]->(%s)", tx.FromAddress, tx.TxHash)
	edgeReceived := fmt.Sprintf("(%s)-[:RECEIVED_BY]->(%s)", tx.TxHash, tx.ToAddress)
	r.edges = append(r.edges, edgeSent, edgeReceived)
	log.Printf("[Neo4j-Mock] CREATE %s and %s", edgeSent, edgeReceived)
	return nil
}

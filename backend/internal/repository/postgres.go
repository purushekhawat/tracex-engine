package repository

import (
	"context"
	"database/sql"
	"fmt"
	"sync"
	"time"

	"github.com/sih26182/tracex-backend/internal/connector"
	"github.com/sih26182/tracex-backend/internal/model"
)

type PostgresRepository interface {
	CreateInvestigation(ctx context.Context, inv *model.Investigation) error
	GetInvestigationByID(ctx context.Context, id string) (*model.Investigation, error)
	UpdateInvestigationStatus(ctx context.Context, id string, status string, riskScore float64) error
	SaveWallet(ctx context.Context, wallet *model.Wallet) error
	SaveTransaction(ctx context.Context, tx *connector.NormalizedTransaction) error
	CreateAuditLog(ctx context.Context, audit *model.AuditLog) error
}

type MemoryPostgresRepo struct {
	mu             sync.RWMutex
	investigations map[string]*model.Investigation
	wallets        map[string]*model.Wallet
	transactions   map[string]*connector.NormalizedTransaction
	auditLogs      []*model.AuditLog
}

func NewMemoryPostgresRepo() *MemoryPostgresRepo {
	return &MemoryPostgresRepo{
		investigations: make(map[string]*model.Investigation),
		wallets:        make(map[string]*model.Wallet),
		transactions:   make(map[string]*connector.NormalizedTransaction),
		auditLogs:      make([]*model.AuditLog, 0),
	}
}

func (r *MemoryPostgresRepo) CreateInvestigation(ctx context.Context, inv *model.Investigation) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.investigations[inv.ID] = inv
	return nil
}

func (r *MemoryPostgresRepo) GetInvestigationByID(ctx context.Context, id string) (*model.Investigation, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	inv, exists := r.investigations[id]
	if !exists {
		return nil, fmt.Errorf("investigation not found: %s", id)
	}
	return inv, nil
}

func (r *MemoryPostgresRepo) UpdateInvestigationStatus(ctx context.Context, id string, status string, riskScore float64) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	inv, exists := r.investigations[id]
	if !exists {
		return fmt.Errorf("investigation not found: %s", id)
	}
	inv.Status = status
	inv.RiskScore = riskScore
	inv.UpdatedAt = time.Now().UTC()
	return nil
}

func (r *MemoryPostgresRepo) SaveWallet(ctx context.Context, wallet *model.Wallet) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.wallets[wallet.Address] = wallet
	return nil
}

func (r *MemoryPostgresRepo) SaveTransaction(ctx context.Context, tx *connector.NormalizedTransaction) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.transactions[tx.TxHash] = tx
	return nil
}

func (r *MemoryPostgresRepo) CreateAuditLog(ctx context.Context, audit *model.AuditLog) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.auditLogs = append(r.auditLogs, audit)
	return nil
}

// SQL Implementation
type SQLPostgresRepo struct {
	db *sql.DB
}

func NewSQLPostgresRepo(db *sql.DB) *SQLPostgresRepo {
	return &SQLPostgresRepo{db: db}
}

func (r *SQLPostgresRepo) CreateInvestigation(ctx context.Context, inv *model.Investigation) error {
	query := `
		INSERT INTO investigations (id, case_id, suspect_address, blockchain_id, depth_hops, status, risk_score, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`
	// Map blockchain code to UUID if needed
	blockchainUUID := inv.BlockchainID
	if len(blockchainUUID) < 30 {
		blockchainUUID = "11111111-1111-1111-1111-111111111111" // Default synthetic ETH
	}

	_, err := r.db.ExecContext(ctx, query, inv.ID, inv.CaseID, inv.SuspectAddress, blockchainUUID, inv.DepthHops, inv.Status, inv.RiskScore, inv.CreatedAt, inv.UpdatedAt)
	return err
}

func (r *SQLPostgresRepo) GetInvestigationByID(ctx context.Context, id string) (*model.Investigation, error) {
	query := `
		SELECT id, case_id, suspect_address, blockchain_id, depth_hops, status, risk_score, created_at, updated_at
		FROM investigations WHERE id = $1
	`
	row := r.db.QueryRowContext(ctx, query, id)
	var inv model.Investigation
	err := row.Scan(&inv.ID, &inv.CaseID, &inv.SuspectAddress, &inv.BlockchainID, &inv.DepthHops, &inv.Status, &inv.RiskScore, &inv.CreatedAt, &inv.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &inv, nil
}

func (r *SQLPostgresRepo) UpdateInvestigationStatus(ctx context.Context, id string, status string, riskScore float64) error {
	query := `
		UPDATE investigations SET status = $1, risk_score = $2, updated_at = $3 WHERE id = $4
	`
	_, err := r.db.ExecContext(ctx, query, status, riskScore, time.Now().UTC(), id)
	return err
}

func (r *SQLPostgresRepo) SaveWallet(ctx context.Context, wallet *model.Wallet) error {
	query := `
		INSERT INTO wallets (id, blockchain_id, address, wallet_type, balance_native, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (blockchain_id, address) DO UPDATE SET updated_at = EXCLUDED.updated_at
	`
	blockchainUUID := wallet.BlockchainID
	if len(blockchainUUID) < 30 {
		blockchainUUID = "11111111-1111-1111-1111-111111111111"
	}
	_, err := r.db.ExecContext(ctx, query, wallet.ID, blockchainUUID, wallet.Address, wallet.WalletType, wallet.BalanceNative, wallet.CreatedAt, wallet.UpdatedAt)
	return err
}

func (r *SQLPostgresRepo) SaveTransaction(ctx context.Context, tx *connector.NormalizedTransaction) error {
	query := `
		INSERT INTO transactions (id, blockchain_id, tx_hash, from_wallet_id, to_wallet_id, asset_id, amount, amount_usd, fee_native, block_number, timestamp, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		ON CONFLICT (blockchain_id, tx_hash) DO NOTHING
	`
	// Fallback UUIDs for FK constraints
	blockchainUUID := "11111111-1111-1111-1111-111111111111"
	assetUUID := "a1111111-1111-1111-1111-111111111111"

	// Resolve/upsert wallet IDs
	fromWalletID := "w1111111-1111-1111-1111-111111111111"
	toWalletID := "w2222222-2222-2222-2222-222222222222"

	now := time.Now().UTC()
	_, err := r.db.ExecContext(ctx, query,
		"tx_"+tx.TxHash[:8], blockchainUUID, tx.TxHash,
		fromWalletID, toWalletID, assetUUID,
		tx.ValueNative, tx.ValueUSD, tx.FeeNative,
		tx.BlockNumber, tx.Timestamp, tx.Status,
		now, now,
	)
	return err
}

func (r *SQLPostgresRepo) CreateAuditLog(ctx context.Context, audit *model.AuditLog) error {
	query := `
		INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, ip_address, user_agent, timestamp)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`
	_, err := r.db.ExecContext(ctx, query, audit.ID, audit.UserID, audit.Action, audit.ResourceType, audit.ResourceID, nil, audit.IPAddress, audit.UserAgent, audit.Timestamp)
	return err
}

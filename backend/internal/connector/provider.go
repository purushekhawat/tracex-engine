package connector

import (
	"context"
	"errors"
	"time"
)

// Common Error Definitions
var (
	ErrInvalidAddress    = errors.New("invalid blockchain address format")
	ErrRateLimited       = errors.New("blockchain provider rate limit exceeded")
	ErrTimeout           = errors.New("blockchain provider request timed out")
	ErrMalformedResponse = errors.New("malformed or unparseable API response from provider")
	ErrTransactionNotFound = errors.New("transaction not found")
	ErrUnsupportedChain  = errors.New("unsupported blockchain network")
)

// Normalized Data Structures
type WalletBalance struct {
	Address       string  `json:"address"`
	Blockchain    string  `json:"blockchain"`
	BalanceNative float64 `json:"balance_native"`
	Symbol        string  `json:"symbol"`
}

type NormalizedTransaction struct {
	Blockchain  string    `json:"blockchain"`
	TxHash      string    `json:"tx_hash"`
	FromAddress string    `json:"from_address"`
	ToAddress   string    `json:"to_address"`
	ValueNative float64   `json:"value_native"`
	ValueUSD    float64   `json:"value_usd"`
	FeeNative   float64   `json:"fee_native"`
	BlockNumber uint64    `json:"block_number"`
	Timestamp   time.Time `json:"timestamp"`
	Status      string    `json:"status"` // "SUCCESS", "FAILED"
	IsContract  bool      `json:"is_contract"`
}

type NormalizedTokenTransfer struct {
	Blockchain      string    `json:"blockchain"`
	TxHash          string    `json:"tx_hash"`
	FromAddress     string    `json:"from_address"`
	ToAddress       string    `json:"to_address"`
	TokenSymbol     string    `json:"token_symbol"`
	TokenName       string    `json:"token_name"`
	ContractAddress string    `json:"contract_address"`
	ValueToken      float64   `json:"value_token"`
	Decimals        int       `json:"decimals"`
	BlockNumber     uint64    `json:"block_number"`
	Timestamp       time.Time `json:"timestamp"`
}

// Chain-Agnostic BlockchainProvider Interface
type BlockchainProvider interface {
	GetChainCode() string
	ValidateAddress(address string) bool
	GetWalletBalance(ctx context.Context, address string) (*WalletBalance, error)
	GetTransactions(ctx context.Context, address string, page, limit int) ([]NormalizedTransaction, error)
	GetTransaction(ctx context.Context, txHash string) (*NormalizedTransaction, error)
	GetTokenTransfers(ctx context.Context, address string, page, limit int) ([]NormalizedTokenTransfer, error)
	GetBlockTimestamp(ctx context.Context, blockNumber uint64) (time.Time, error)
}

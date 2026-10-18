package connector

import (
	"context"
	"strings"
	"time"
)

type MockProvider struct {
	ChainCode           string
	SimulateTimeout     bool
	SimulateRateLimit   bool
	SimulateMalformed   bool
	SimulateTxNotFound  bool
}

func NewMockProvider(chainCode string) *MockProvider {
	return &MockProvider{
		ChainCode: chainCode,
	}
}

func (m *MockProvider) GetChainCode() string {
	if m.ChainCode != "" {
		return m.ChainCode
	}
	return "mock-eth"
}

func (m *MockProvider) ValidateAddress(address string) bool {
	if strings.HasPrefix(address, "0x") && len(address) == 42 {
		return true
	}
	if strings.HasPrefix(address, "T") && len(address) == 34 {
		return true
	}
	return false
}

func (m *MockProvider) GetWalletBalance(ctx context.Context, address string) (*WalletBalance, error) {
	if err := m.checkSimulatedErrors(ctx); err != nil {
		return nil, err
	}
	if !m.ValidateAddress(address) {
		return nil, ErrInvalidAddress
	}

	return &WalletBalance{
		Address:       address,
		Blockchain:    m.GetChainCode(),
		BalanceNative: 12.50,
		Symbol:        "ETH",
	}, nil
}

func (m *MockProvider) GetTransactions(ctx context.Context, address string, page, limit int) ([]NormalizedTransaction, error) {
	if err := m.checkSimulatedErrors(ctx); err != nil {
		return nil, err
	}
	if !m.ValidateAddress(address) {
		return nil, ErrInvalidAddress
	}

	now := time.Now().UTC()
	return []NormalizedTransaction{
		{
			Blockchain:  m.GetChainCode(),
			TxHash:      "0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001",
			FromAddress: address,
			ToAddress:   "0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
			ValueNative: 10.0,
			ValueUSD:    32000.0,
			FeeNative:   0.002,
			BlockNumber: 19200100,
			Timestamp:   now.Add(-72 * time.Hour),
			Status:      "SUCCESS",
			IsContract:  false,
		},
		{
			Blockchain:  m.GetChainCode(),
			TxHash:      "0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0002",
			FromAddress: "0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
			ToAddress:   "0x8f2c1144882a1100998dfb751b7401b5f6d88888",
			ValueNative: 9.85,
			ValueUSD:    31520.0,
			FeeNative:   0.002,
			BlockNumber: 19200150,
			Timestamp:   now.Add(-48 * time.Hour),
			Status:      "SUCCESS",
			IsContract:  false,
		},
	}, nil
}

func (m *MockProvider) GetTransaction(ctx context.Context, txHash string) (*NormalizedTransaction, error) {
	if err := m.checkSimulatedErrors(ctx); err != nil {
		return nil, err
	}
	if m.SimulateTxNotFound {
		return nil, ErrTransactionNotFound
	}

	return &NormalizedTransaction{
		Blockchain:  m.GetChainCode(),
		TxHash:      txHash,
		FromAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
		ToAddress:   "0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
		ValueNative: 10.0,
		ValueUSD:    32000.0,
		BlockNumber: 19200100,
		Timestamp:   time.Now().UTC(),
		Status:      "SUCCESS",
	}, nil
}

func (m *MockProvider) GetTokenTransfers(ctx context.Context, address string, page, limit int) ([]NormalizedTokenTransfer, error) {
	if err := m.checkSimulatedErrors(ctx); err != nil {
		return nil, err
	}
	if !m.ValidateAddress(address) {
		return nil, ErrInvalidAddress
	}

	return []NormalizedTokenTransfer{
		{
			Blockchain:      m.GetChainCode(),
			TxHash:          "0xtoken111122223333444455556666777788889999",
			FromAddress:     address,
			ToAddress:       "0x28C6c06298d514Db089934071355E5743bf21d60",
			TokenSymbol:     "USDT",
			TokenName:       "Tether USD",
			ContractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
			ValueToken:      5000.0,
			Decimals:        6,
			BlockNumber:     19200100,
			Timestamp:       time.Now().UTC(),
		},
	}, nil
}

func (m *MockProvider) GetBlockTimestamp(ctx context.Context, blockNumber uint64) (time.Time, error) {
	if err := m.checkSimulatedErrors(ctx); err != nil {
		return time.Time{}, err
	}
	return time.Now().UTC(), nil
}

func (m *MockProvider) checkSimulatedErrors(ctx context.Context) error {
	if ctx.Err() == context.DeadlineExceeded || m.SimulateTimeout {
		return ErrTimeout
	}
	if m.SimulateRateLimit {
		return ErrRateLimited
	}
	if m.SimulateMalformed {
		return ErrMalformedResponse
	}
	return nil
}

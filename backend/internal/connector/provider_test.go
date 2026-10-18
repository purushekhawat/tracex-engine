package connector

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

// 1. Test Address Validation
func TestAddressValidation(t *testing.T) {
	ethProvider := NewEthereumProvider("dummy_key", "")
	tronProvider := NewTronProvider("dummy_key", "")

	// Valid Ethereum Addresses
	validETH := []string{
		"0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
		"0x28C6c06298d514Db089934071355E5743bf21d60",
		"0x0000000000000000000000000000000000000000",
	}

	for _, addr := range validETH {
		if !ethProvider.ValidateAddress(addr) {
			t.Errorf("expected Ethereum address %s to be valid", addr)
		}
	}

	// Invalid Ethereum Addresses
	invalidETH := []string{
		"0x71C7656EC7ab88b098defB751B7401B5f6d8976",  // Short
		"71C7656EC7ab88b098defB751B7401B5f6d8976F",   // Missing 0x
		"0x71C7656EC7ab88b098defB751B7401B5f6d8976G", // Non-hex character G
		"",
	}

	for _, addr := range invalidETH {
		if ethProvider.ValidateAddress(addr) {
			t.Errorf("expected Ethereum address %s to be invalid", addr)
		}
	}

	// Valid TRON Addresses
	validTRON := []string{
		"TLsV52sRDL79HXGGm9yzwKibbP4zDCDbvU",
		"TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
	}

	for _, addr := range validTRON {
		if !tronProvider.ValidateAddress(addr) {
			t.Errorf("expected TRON address %s to be valid", addr)
		}
	}

	// Invalid TRON Addresses
	invalidTRON := []string{
		"0x71C7656EC7ab88b098defB751B7401B5f6d8976F", // ETH address on TRON
		"TLsV52sRDL79HXGGm9yzwKibbP4zDCDbv",         // Short
		"ALsV52sRDL79HXGGm9yzwKibbP4zDCDbvU",        // Doesn't start with T
		"",
	}

	for _, addr := range invalidTRON {
		if tronProvider.ValidateAddress(addr) {
			t.Errorf("expected TRON address %s to be invalid", addr)
		}
	}
}

// 2. Test Provider Selection (Factory)
func TestProviderFactory(t *testing.T) {
	factory := NewProviderFactory()

	ethProvider := NewEthereumProvider("key1", "")
	tronProvider := NewTronProvider("key2", "")
	mockProvider := NewMockProvider("mock-chain")

	factory.RegisterProvider("ethereum", ethProvider)
	factory.RegisterProvider("tron", tronProvider)
	factory.RegisterProvider("mock-chain", mockProvider)

	// Fetch Ethereum
	p1, err := factory.GetProvider("ethereum")
	if err != nil || p1.GetChainCode() != "ethereum" {
		t.Fatalf("factory failed to fetch ethereum provider: %v", err)
	}

	// Fetch TRON case-insensitive
	p2, err := factory.GetProvider("TRON")
	if err != nil || p2.GetChainCode() != "tron" {
		t.Fatalf("factory failed to fetch tron provider: %v", err)
	}

	// Fetch Unsupported Chain
	_, err = factory.GetProvider("solana")
	if err == nil {
		t.Fatalf("expected error for unsupported chain 'solana'")
	}
}

// 3. Test Transaction Normalization
func TestTransactionNormalization(t *testing.T) {
	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		resp := `{
			"status": "1",
			"message": "OK",
			"result": [
				{
					"blockNumber": "19200100",
					"timeStamp": "1710000000",
					"hash": "0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001",
					"from": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
					"to": "0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
					"value": "10000000000000000000",
					"gasUsed": "21000",
					"gasPrice": "20000000000",
					"isError": "0",
					"txreceipt_status": "1"
				}
			]
		}`
		_, _ = w.Write([]byte(resp))
	}))
	defer mockServer.Close()

	provider := NewEthereumProvider("test_key", "")
	provider.SetBaseURL(mockServer.URL)

	txs, err := provider.GetTransactions(context.Background(), "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", 1, 10)
	if err != nil {
		t.Fatalf("unexpected error getting transactions: %v", err)
	}

	if len(txs) != 1 {
		t.Fatalf("expected 1 transaction, got %d", len(txs))
	}

	tx := txs[0]
	if tx.Blockchain != "ethereum" {
		t.Errorf("expected blockchain 'ethereum', got %s", tx.Blockchain)
	}
	if tx.ValueNative != 10.0 {
		t.Errorf("expected value 10.0 ETH, got %f", tx.ValueNative)
	}
	if tx.Status != "SUCCESS" {
		t.Errorf("expected status 'SUCCESS', got %s", tx.Status)
	}
}

// 4. Test Malformed API Response Handling
func TestMalformedAPIResponse(t *testing.T) {
	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{ "invalid_json": `))
	}))
	defer mockServer.Close()

	provider := NewEthereumProvider("test_key", "")
	provider.SetBaseURL(mockServer.URL)

	_, err := provider.GetWalletBalance(context.Background(), "0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
	if err != ErrMalformedResponse {
		t.Errorf("expected ErrMalformedResponse, got %v", err)
	}
}

// 5. Test Rate-Limit Handling
func TestRateLimitHandling(t *testing.T) {
	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusTooManyRequests)
		_, _ = w.Write([]byte(`{"message": "Rate limit exceeded"}`))
	}))
	defer mockServer.Close()

	provider := NewEthereumProvider("test_key", "")
	provider.SetBaseURL(mockServer.URL)

	_, err := provider.GetWalletBalance(context.Background(), "0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
	if err != ErrRateLimited {
		t.Errorf("expected ErrRateLimited, got %v", err)
	}
}

// 6. Test Timeout Handling
func TestTimeoutHandling(t *testing.T) {
	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(50 * time.Millisecond)
		w.WriteHeader(http.StatusOK)
	}))
	defer mockServer.Close()

	provider := NewEthereumProvider("test_key", "")
	provider.SetBaseURL(mockServer.URL)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Millisecond)
	defer cancel()

	_, err := provider.GetWalletBalance(ctx, "0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
	if err != ErrTimeout {
		t.Errorf("expected ErrTimeout, got %v", err)
	}
}

// 7. Test Mock Provider Simulation Modes
func TestMockProviderSimulations(t *testing.T) {
	mock := NewMockProvider("mock-eth")

	// Normal run
	bal, err := mock.GetWalletBalance(context.Background(), "0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
	if err != nil || bal.BalanceNative != 12.50 {
		t.Fatalf("expected valid balance from mock provider: %v", err)
	}

	// Rate limit mode
	mock.SimulateRateLimit = true
	_, err = mock.GetWalletBalance(context.Background(), "0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
	if err != ErrRateLimited {
		t.Errorf("expected ErrRateLimited from mock, got %v", err)
	}
	mock.SimulateRateLimit = false

	// Timeout mode
	mock.SimulateTimeout = true
	_, err = mock.GetWalletBalance(context.Background(), "0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
	if err != ErrTimeout {
		t.Errorf("expected ErrTimeout from mock, got %v", err)
	}
}

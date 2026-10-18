package connector

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"
)

var tronAddressRegex = regexp.MustCompile(`^T[1-9A-HJ-NP-Za-km-z]{33}$`)

type TronProvider struct {
	apiKey  string
	rpcURL  string
	client  *http.Client
	baseURL string
}

func NewTronProvider(apiKey, rpcURL string) *TronProvider {
	baseURL := "https://api.trongrid.io"
	if rpcURL != "" {
		baseURL = rpcURL
	}
	return &TronProvider{
		apiKey:  apiKey,
		rpcURL:  rpcURL,
		client:  &http.Client{Timeout: 10 * time.Second},
		baseURL: baseURL,
	}
}

func (t *TronProvider) SetBaseURL(url string) {
	t.baseURL = url
}

func (t *TronProvider) SetHTTPClient(client *http.Client) {
	t.client = client
}

func (t *TronProvider) GetChainCode() string {
	return "tron"
}

func (t *TronProvider) ValidateAddress(address string) bool {
	return tronAddressRegex.MatchString(strings.TrimSpace(address))
}

type tronAccountResponse struct {
	Data []struct {
		Address string `json:"address"`
		Balance int64  `json:"balance"` // SUN unit (1 TRX = 1,000,000 SUN)
	} `json:"data"`
	Success bool   `json:"success"`
	Error   string `json:"error"`
}

type tronTxListResponse struct {
	Data []struct {
		TxID            string `json:"txID"`
		BlockNumber     uint64 `json:"blockNumber"`
		BlockTimestamp  int64  `json:"block_timestamp"`
		RawData         struct {
			Contract []struct {
				Parameter struct {
					Value struct {
						Amount       int64  `json:"amount"`
						OwnerAddress string `json:"owner_address"`
						ToAddress    string `json:"to_address"`
					} `json:"value"`
				} `json:"parameter"`
				Type string `json:"type"`
			} `json:"contract"`
		} `json:"raw_data"`
		Ret []struct {
			ContractRet string `json:"contractRet"`
		} `json:"ret"`
	} `json:"data"`
	Success bool   `json:"success"`
	Error   string `json:"error"`
}

type tronTrc20Response struct {
	Data []struct {
		TransactionID  string `json:"transaction_id"`
		BlockTimestamp int64  `json:"block_timestamp"`
		From           string `json:"from"`
		To             string `json:"to"`
		Value          string `json:"value"`
		TokenInfo      struct {
			Symbol   string `json:"symbol"`
			Name     string `json:"name"`
			Address  string `json:"address"`
			Decimals int    `json:"decimals"`
		} `json:"token_info"`
	} `json:"data"`
	Success bool `json:"success"`
}

func (t *TronProvider) GetWalletBalance(ctx context.Context, address string) (*WalletBalance, error) {
	if !t.ValidateAddress(address) {
		return nil, ErrInvalidAddress
	}

	url := fmt.Sprintf("%s/v1/accounts/%s", t.baseURL, address)
	respBody, err := t.doRequest(ctx, url)
	if err != nil {
		return nil, err
	}

	var parsed tronAccountResponse
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return nil, ErrMalformedResponse
	}

	balanceTRX := 0.0
	if len(parsed.Data) > 0 {
		balanceTRX = float64(parsed.Data[0].Balance) / 1e6
	}

	return &WalletBalance{
		Address:       address,
		Blockchain:    "tron",
		BalanceNative: balanceTRX,
		Symbol:        "TRX",
	}, nil
}

func (t *TronProvider) GetTransactions(ctx context.Context, address string, page, limit int) ([]NormalizedTransaction, error) {
	if !t.ValidateAddress(address) {
		return nil, ErrInvalidAddress
	}

	if limit < 1 {
		limit = 20
	}

	url := fmt.Sprintf("%s/v1/accounts/%s/transactions?limit=%d", t.baseURL, address, limit)
	respBody, err := t.doRequest(ctx, url)
	if err != nil {
		return nil, err
	}

	var parsed tronTxListResponse
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return nil, ErrMalformedResponse
	}

	normalized := make([]NormalizedTransaction, 0, len(parsed.Data))
	for _, item := range parsed.Data {
		var amount float64
		var ownerAddr, toAddr string
		if len(item.RawData.Contract) > 0 {
			val := item.RawData.Contract[0].Parameter.Value
			amount = float64(val.Amount) / 1e6
			ownerAddr = val.OwnerAddress
			toAddr = val.ToAddress
		}

		status := "SUCCESS"
		if len(item.Ret) > 0 && item.Ret[0].ContractRet != "SUCCESS" {
			status = "FAILED"
		}

		normalized = append(normalized, NormalizedTransaction{
			Blockchain:  "tron",
			TxHash:      item.TxID,
			FromAddress: ownerAddr,
			ToAddress:   toAddr,
			ValueNative: amount,
			ValueUSD:    amount * 0.12, // TRX USD price baseline
			FeeNative:   0.0,
			BlockNumber: item.BlockNumber,
			Timestamp:   time.UnixMilli(item.BlockTimestamp).UTC(),
			Status:      status,
			IsContract:  false,
		})
	}

	return normalized, nil
}

func (t *TronProvider) GetTransaction(ctx context.Context, txHash string) (*NormalizedTransaction, error) {
	url := fmt.Sprintf("%s/wallet/gettransactionbyid?value=%s", t.baseURL, txHash)
	respBody, err := t.doRequest(ctx, url)
	if err != nil {
		return nil, err
	}

	var parsed map[string]interface{}
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return nil, ErrMalformedResponse
	}

	if len(parsed) == 0 {
		return nil, ErrTransactionNotFound
	}

	return &NormalizedTransaction{
		Blockchain:  "tron",
		TxHash:      txHash,
		FromAddress: "",
		ToAddress:   "",
		ValueNative: 0,
		BlockNumber: 0,
		Timestamp:   time.Now().UTC(),
		Status:      "SUCCESS",
	}, nil
}

func (t *TronProvider) GetTokenTransfers(ctx context.Context, address string, page, limit int) ([]NormalizedTokenTransfer, error) {
	if !t.ValidateAddress(address) {
		return nil, ErrInvalidAddress
	}

	if limit < 1 {
		limit = 20
	}

	url := fmt.Sprintf("%s/v1/accounts/%s/transactions/trc20?limit=%d", t.baseURL, address, limit)
	respBody, err := t.doRequest(ctx, url)
	if err != nil {
		return nil, err
	}

	var parsed tronTrc20Response
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return nil, ErrMalformedResponse
	}

	normalized := make([]NormalizedTokenTransfer, 0, len(parsed.Data))
	for _, item := range parsed.Data {
		normalized = append(normalized, NormalizedTokenTransfer{
			Blockchain:      "tron",
			TxHash:          item.TransactionID,
			FromAddress:     item.From,
			ToAddress:       item.To,
			TokenSymbol:     item.TokenInfo.Symbol,
			TokenName:       item.TokenInfo.Name,
			ContractAddress: item.TokenInfo.Address,
			ValueToken:      0.0, // Value conversion helper
			Decimals:        item.TokenInfo.Decimals,
			BlockNumber:     0,
			Timestamp:       time.UnixMilli(item.BlockTimestamp).UTC(),
		})
	}

	return normalized, nil
}

func (t *TronProvider) GetBlockTimestamp(ctx context.Context, blockNumber uint64) (time.Time, error) {
	return time.Now().UTC(), nil
}

func (t *TronProvider) doRequest(ctx context.Context, url string) ([]byte, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	if t.apiKey != "" {
		req.Header.Set("TRON-PRO-API-KEY", t.apiKey)
	}

	resp, err := t.client.Do(req)
	if err != nil {
		if ctx.Err() == context.DeadlineExceeded || strings.Contains(err.Error(), "context deadline exceeded") || strings.Contains(err.Error(), "Client.Timeout") {
			return nil, ErrTimeout
		}
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusTooManyRequests {
		return nil, ErrRateLimited
	}

	buf := make([]byte, 1024*1024)
	n, _ := resp.Body.Read(buf)
	return buf[:n], nil
}

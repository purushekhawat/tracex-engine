package connector

import (
	"context"
	"encoding/json"
	"fmt"

	"math"
	"math/big"
	"net/http"

	"regexp"
	"strconv"
	"strings"
	"time"
)

var ethAddressRegex = regexp.MustCompile(`^0x[0-9a-fA-F]{40}$`)

type EthereumProvider struct {
	apiKey  string
	rpcURL  string
	client  *http.Client
	baseURL string
}

func NewEthereumProvider(apiKey, rpcURL string) *EthereumProvider {
	baseURL := "https://api.etherscan.io/api"
	return &EthereumProvider{
		apiKey:  apiKey,
		rpcURL:  rpcURL,
		client:  &http.Client{Timeout: 10 * time.Second},
		baseURL: baseURL,
	}
}

// SetBaseURL allows overriding the base API URL (useful for HTTP mock servers in tests)
func (e *EthereumProvider) SetBaseURL(url string) {
	e.baseURL = url
}

func (e *EthereumProvider) SetHTTPClient(client *http.Client) {
	e.client = client
}

func (e *EthereumProvider) GetChainCode() string {
	return "ethereum"
}

func (e *EthereumProvider) ValidateAddress(address string) bool {
	return ethAddressRegex.MatchString(strings.TrimSpace(address))
}

type etherscanResponse struct {
	Status  string          `json:"status"`
	Message string          `json:"message"`
	Result  json.RawMessage `json:"result"`
}

type etherscanTxItem struct {
	BlockNumber     string `json:"blockNumber"`
	TimeStamp       string `json:"timeStamp"`
	Hash            string `json:"hash"`
	From            string `json:"from"`
	To              string `json:"to"`
	Value           string `json:"value"`
	GasUsed         string `json:"gasUsed"`
	GasPrice        string `json:"gasPrice"`
	IsError         string `json:"isError"`
	TxReceiptStatus string `json:"txreceipt_status"`
	ContractAddress string `json:"contractAddress"`
}

type etherscanTokenTxItem struct {
	BlockNumber     string `json:"blockNumber"`
	TimeStamp       string `json:"timeStamp"`
	Hash            string `json:"hash"`
	From            string `json:"from"`
	To              string `json:"to"`
	Value           string `json:"value"`
	ContractAddress string `json:"contractAddress"`
	TokenName       string `json:"tokenName"`
	TokenSymbol     string `json:"tokenSymbol"`
	TokenDecimal    string `json:"tokenDecimal"`
}

func (e *EthereumProvider) GetWalletBalance(ctx context.Context, address string) (*WalletBalance, error) {
	if !e.ValidateAddress(address) {
		return nil, ErrInvalidAddress
	}

	url := fmt.Sprintf("%s?module=account&action=balance&address=%s&tag=latest&apikey=%s", e.baseURL, address, e.apiKey)
	respBody, err := e.doRequest(ctx, url)
	if err != nil {
		return nil, err
	}

	var parsed etherscanResponse
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return nil, ErrMalformedResponse
	}

	if parsed.Status != "1" {
		if strings.Contains(strings.ToLower(parsed.Message), "rate limit") || strings.Contains(strings.ToLower(string(parsed.Result)), "rate limit") {
			return nil, ErrRateLimited
		}
	}

	var rawBalanceStr string
	_ = json.Unmarshal(parsed.Result, &rawBalanceStr)

	balanceWei, ok := new(big.Int).SetString(rawBalanceStr, 10)
	if !ok {
		balanceWei = big.NewInt(0)
	}

	balanceETH := weiToETH(balanceWei)

	return &WalletBalance{
		Address:       address,
		Blockchain:    "ethereum",
		BalanceNative: balanceETH,
		Symbol:        "ETH",
	}, nil
}

func (e *EthereumProvider) GetTransactions(ctx context.Context, address string, page, limit int) ([]NormalizedTransaction, error) {
	if !e.ValidateAddress(address) {
		return nil, ErrInvalidAddress
	}

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}

	url := fmt.Sprintf("%s?module=account&action=txlist&address=%s&page=%d&offset=%d&sort=desc&apikey=%s",
		e.baseURL, address, page, limit, e.apiKey)

	respBody, err := e.doRequest(ctx, url)
	if err != nil {
		return nil, err
	}

	var parsed etherscanResponse
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return nil, ErrMalformedResponse
	}

	if parsed.Status != "1" && len(parsed.Result) > 0 {
		errMsg := strings.ToLower(string(parsed.Result))
		if strings.Contains(errMsg, "rate limit") || strings.Contains(strings.ToLower(parsed.Message), "rate limit") {
			return nil, ErrRateLimited
		}
		if strings.Contains(errMsg, "no transactions found") {
			return []NormalizedTransaction{}, nil
		}
	}

	var rawItems []etherscanTxItem
	if err := json.Unmarshal(parsed.Result, &rawItems); err != nil {
		return []NormalizedTransaction{}, nil
	}

	normalized := make([]NormalizedTransaction, 0, len(rawItems))
	for _, item := range rawItems {
		tx, err := e.normalizeTx(item)
		if err == nil {
			normalized = append(normalized, tx)
		}
	}

	return normalized, nil
}

func (e *EthereumProvider) GetTransaction(ctx context.Context, txHash string) (*NormalizedTransaction, error) {
	url := fmt.Sprintf("%s?module=proxy&action=eth_getTransactionByHash&txhash=%s&apikey=%s", e.baseURL, txHash, e.apiKey)
	respBody, err := e.doRequest(ctx, url)
	if err != nil {
		return nil, err
	}

	var parsed map[string]interface{}
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return nil, ErrMalformedResponse
	}

	result, ok := parsed["result"].(map[string]interface{})
	if !ok || result == nil {
		return nil, ErrTransactionNotFound
	}

	fromStr, _ := result["from"].(string)
	toStr, _ := result["to"].(string)
	valueHex, _ := result["value"].(string)
	blockHex, _ := result["blockNumber"].(string)

	blockNum := parseHexUint64(blockHex)
	valWei := parseHexBigInt(valueHex)

	return &NormalizedTransaction{
		Blockchain:  "ethereum",
		TxHash:      txHash,
		FromAddress: fromStr,
		ToAddress:   toStr,
		ValueNative: weiToETH(valWei),
		BlockNumber: blockNum,
		Timestamp:   time.Now(), // Proxy call timestamp fallback
		Status:      "SUCCESS",
	}, nil
}

func (e *EthereumProvider) GetTokenTransfers(ctx context.Context, address string, page, limit int) ([]NormalizedTokenTransfer, error) {
	if !e.ValidateAddress(address) {
		return nil, ErrInvalidAddress
	}

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}

	url := fmt.Sprintf("%s?module=account&action=tokentx&address=%s&page=%d&offset=%d&sort=desc&apikey=%s",
		e.baseURL, address, page, limit, e.apiKey)

	respBody, err := e.doRequest(ctx, url)
	if err != nil {
		return nil, err
	}

	var parsed etherscanResponse
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return nil, ErrMalformedResponse
	}

	if parsed.Status != "1" && len(parsed.Result) > 0 {
		errMsg := strings.ToLower(string(parsed.Result))
		if strings.Contains(errMsg, "rate limit") {
			return nil, ErrRateLimited
		}
		if strings.Contains(errMsg, "no transactions found") {
			return []NormalizedTokenTransfer{}, nil
		}
	}

	var rawItems []etherscanTokenTxItem
	if err := json.Unmarshal(parsed.Result, &rawItems); err != nil {
		return []NormalizedTokenTransfer{}, nil
	}

	normalized := make([]NormalizedTokenTransfer, 0, len(rawItems))
	for _, item := range rawItems {
		tokenTx := e.normalizeTokenTx(item)
		normalized = append(normalized, tokenTx)
	}

	return normalized, nil
}

func (e *EthereumProvider) GetBlockTimestamp(ctx context.Context, blockNumber uint64) (time.Time, error) {
	url := fmt.Sprintf("%s?module=block&action=getblockreward&blockno=%d&apikey=%s", e.baseURL, blockNumber, e.apiKey)
	respBody, err := e.doRequest(ctx, url)
	if err != nil {
		return time.Time{}, err
	}

	var parsed etherscanResponse
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return time.Time{}, ErrMalformedResponse
	}

	var resObj struct {
		TimeStamp string `json:"timeStamp"`
	}
	if err := json.Unmarshal(parsed.Result, &resObj); err == nil && resObj.TimeStamp != "" {
		tsInt, _ := strconv.ParseInt(resObj.TimeStamp, 10, 64)
		return time.Unix(tsInt, 0).UTC(), nil
	}

	return time.Now().UTC(), nil
}

func (e *EthereumProvider) doRequest(ctx context.Context, url string) ([]byte, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := e.client.Do(req)
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

	buf := make([]byte, 1024*1024) // 1MB limit for payload
	n, _ := resp.Body.Read(buf)
	return buf[:n], nil
}

func (e *EthereumProvider) normalizeTx(item etherscanTxItem) (NormalizedTransaction, error) {
	blockNum, _ := strconv.ParseUint(item.BlockNumber, 10, 64)
	tsInt, _ := strconv.ParseInt(item.TimeStamp, 10, 64)

	valWei, ok := new(big.Int).SetString(item.Value, 10)
	if !ok {
		valWei = big.NewInt(0)
	}

	gasUsed, _ := strconv.ParseFloat(item.GasUsed, 64)
	gasPrice, _ := strconv.ParseFloat(item.GasPrice, 64)
	feeETH := (gasUsed * gasPrice) / 1e18

	status := "SUCCESS"
	if item.IsError == "1" || item.TxReceiptStatus == "0" {
		status = "FAILED"
	}

	return NormalizedTransaction{
		Blockchain:  "ethereum",
		TxHash:      item.Hash,
		FromAddress: item.From,
		ToAddress:   item.To,
		ValueNative: weiToETH(valWei),
		ValueUSD:    weiToETH(valWei) * 3200.0, // Base calculation conversion
		FeeNative:   feeETH,
		BlockNumber: blockNum,
		Timestamp:   time.Unix(tsInt, 0).UTC(),
		Status:      status,
		IsContract:  item.ContractAddress != "",
	}, nil
}

func (e *EthereumProvider) normalizeTokenTx(item etherscanTokenTxItem) NormalizedTokenTransfer {
	blockNum, _ := strconv.ParseUint(item.BlockNumber, 10, 64)
	tsInt, _ := strconv.ParseInt(item.TimeStamp, 10, 64)
	decimals, _ := strconv.Atoi(item.TokenDecimal)

	rawVal, ok := new(big.Float).SetString(item.Value)
	if !ok {
		rawVal = big.NewFloat(0)
	}

	divisor := math.Pow(10, float64(decimals))
	valToken := 0.0
	if divisor > 0 {
		valFloat, _ := rawVal.Float64()
		valToken = valFloat / divisor
	}

	return NormalizedTokenTransfer{
		Blockchain:      "ethereum",
		TxHash:          item.Hash,
		FromAddress:     item.From,
		ToAddress:       item.To,
		TokenSymbol:     item.TokenSymbol,
		TokenName:       item.TokenName,
		ContractAddress: item.ContractAddress,
		ValueToken:      valToken,
		Decimals:        decimals,
		BlockNumber:     blockNum,
		Timestamp:       time.Unix(tsInt, 0).UTC(),
	}
}

func weiToETH(wei *big.Int) float64 {
	if wei == nil {
		return 0
	}
	fWei := new(big.Float).SetInt(wei)
	ethDivisor := new(big.Float).SetFloat64(1e18)
	fETH := new(big.Float).Quo(fWei, ethDivisor)
	res, _ := fETH.Float64()
	return res
}

func parseHexUint64(hexStr string) uint64 {
	clean := strings.TrimPrefix(hexStr, "0x")
	val, _ := strconv.ParseUint(clean, 16, 64)
	return val
}

func parseHexBigInt(hexStr string) *big.Int {
	clean := strings.TrimPrefix(hexStr, "0x")
	val, ok := new(big.Int).SetString(clean, 16)
	if !ok {
		return big.NewInt(0)
	}
	return val
}

package model

import (
	"encoding/json"
	"testing"
	"time"
)

func TestModelsSerialization(t *testing.T) {
	now := time.Now()

	blockchain := Blockchain{
		ID:           "11111111-1111-1111-1111-111111111111",
		Code:         "ethereum",
		Name:         "Ethereum Mainnet",
		NativeSymbol: "ETH",
		ChainID:      "1",
		IsActive:     true,
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	data, err := json.Marshal(blockchain)
	if err != nil {
		t.Fatalf("failed to marshal blockchain: %v", err)
	}

	var decoded Blockchain
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("failed to unmarshal blockchain: %v", err)
	}

	if decoded.Code != "ethereum" || decoded.NativeSymbol != "ETH" {
		t.Errorf("unexpected decoded values: %+v", decoded)
	}
}

func TestAttributionResultModel(t *testing.T) {
	now := time.Now()
	vaspID := "v1111111-1111-1111-1111-111111111111"

	attr := AttributionResult{
		ID:                  "res11111-1111-1111-1111-111111111111",
		InvestigationID:     "i1111111-1111-1111-1111-111111111111",
		SuspectAddress:      "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
		CandidateVASPID:     &vaspID,
		AttributionCategory: "STRONG_ASSOCIATION",
		EvidenceScore:       87.50,
		UncertaintyScore:    12.50,
		HopDistance:         3,
		ValueFlowUSD:        31360.00,
		PathTxHashes:        []string{"tx1", "tx2", "tx3"},
		Explanation:         "Multi-hop peel chain flow to Binance",
		AnalysisVersion:     "v1.0.0",
		CreatedAt:           now,
		UpdatedAt:           now,
	}

	if attr.AttributionCategory != "STRONG_ASSOCIATION" {
		t.Errorf("expected category STRONG_ASSOCIATION, got %s", attr.AttributionCategory)
	}
	if attr.EvidenceScore != 87.50 {
		t.Errorf("expected score 87.50, got %f", attr.EvidenceScore)
	}
}

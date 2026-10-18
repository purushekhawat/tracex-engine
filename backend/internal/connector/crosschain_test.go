package connector

import (
	"context"
	"testing"

	"github.com/sih26182/tracex-backend/internal/model"
)

func TestCrossChainResolverVerifiedEvent(t *testing.T) {
	resolver := NewMockCrossChainResolver()

	txEth := "0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001"
	evt, err := resolver.ResolveCrossChainEvent(context.Background(), "ethereum", txEth)
	if err != nil {
		t.Fatalf("unexpected error resolving cross-chain event: %v", err)
	}

	if evt.VerificationStatus != model.StatusVerified {
		t.Errorf("expected status VERIFIED, got %s", evt.VerificationStatus)
	}
	if evt.DestinationChain != "tron" {
		t.Errorf("expected destination chain tron, got %s", evt.DestinationChain)
	}
	if evt.BridgeOrService != "Stargate Finance Cross-Chain Bridge" {
		t.Errorf("expected Stargate bridge, got %s", evt.BridgeOrService)
	}
}

func TestCrossChainResolverUnknownEvent(t *testing.T) {
	resolver := NewMockCrossChainResolver()

	unmatchedTx := "0x0000000000000000000000000000000000000000000000000000000000000000"
	evt, err := resolver.ResolveCrossChainEvent(context.Background(), "ethereum", unmatchedTx)
	if err != nil {
		t.Fatalf("unexpected error resolving unmatched tx: %v", err)
	}

	if evt.VerificationStatus != model.StatusUnknown {
		t.Errorf("expected status UNKNOWN for unevidenced cross-chain link, got %s", evt.VerificationStatus)
	}
	if evt.Confidence != 0.0 {
		t.Errorf("expected 0.0 confidence for UNKNOWN event, got %f", evt.Confidence)
	}
}

func TestSupportedChains(t *testing.T) {
	supported := []string{"ethereum", "tron", "bitcoin", "bsc", "polygon", "solana"}
	for _, chain := range supported {
		if !IsSupportedChain(chain) {
			t.Errorf("expected chain %s to be supported", chain)
		}
	}

	if IsSupportedChain("dogecoin") {
		t.Errorf("expected unsupported chain to return false")
	}
}

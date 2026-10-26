package connector

import (
	"context"
	"strings"
	"time"

	"github.com/tracex/tracex-backend/internal/model"
)

type CrossChainEvent struct {
	ID                     string                   `json:"id"`
	SourceChain            string                   `json:"source_chain"`
	SourceTransaction      string                   `json:"source_transaction"`
	SourceAddress          string                   `json:"source_address"`
	DestinationChain       string                   `json:"destination_chain"`
	DestinationTransaction string                   `json:"destination_transaction"`
	DestinationAddress     string                   `json:"destination_address"`
	BridgeOrService        string                   `json:"bridge_or_service"`
	EvidenceSource         string                   `json:"evidence_source"`
	Confidence             float64                  `json:"confidence"`
	VerificationStatus     model.VerificationStatus `json:"verification_status"`
	ValueUSD               float64                  `json:"value_usd"`
	Timestamp              time.Time                `json:"timestamp"`
}

type CrossChainResolver interface {
	ResolveCrossChainEvent(ctx context.Context, chainCode, txHash string) (*CrossChainEvent, error)
	GetCrossChainEventsForAddress(ctx context.Context, address string) ([]CrossChainEvent, error)
}

type MockCrossChainResolver struct {
	events map[string]*CrossChainEvent // key: txHash
}

func NewMockCrossChainResolver() *MockCrossChainResolver {
	r := &MockCrossChainResolver{
		events: make(map[string]*CrossChainEvent),
	}
	r.seedSyntheticEvents()
	return r
}

func (r *MockCrossChainResolver) ResolveCrossChainEvent(ctx context.Context, chainCode, txHash string) (*CrossChainEvent, error) {
	evt, exists := r.events[strings.ToLower(txHash)]
	if !exists {
		return &CrossChainEvent{
			SourceChain:        chainCode,
			SourceTransaction:  txHash,
			Confidence:         0.0,
			VerificationStatus: model.StatusUnknown,
			EvidenceSource:     "NO_BRIDGE_EVENT_MATCHED",
		}, nil
	}
	return evt, nil
}

func (r *MockCrossChainResolver) GetCrossChainEventsForAddress(ctx context.Context, address string) ([]CrossChainEvent, error) {
	matched := make([]CrossChainEvent, 0)
	lowerAddr := strings.ToLower(address)
	for _, evt := range r.events {
		if strings.ToLower(evt.SourceAddress) == lowerAddr || strings.ToLower(evt.DestinationAddress) == lowerAddr {
			matched = append(matched, *evt)
		}
	}
	return matched, nil
}

func (r *MockCrossChainResolver) seedSyntheticEvents() {
	now := time.Now().UTC()

	// Synthetic Cross-Chain Bridge Event: Ethereum -> TRON via Stargate Bridge
	txEth := "0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001"
	r.events[strings.ToLower(txEth)] = &CrossChainEvent{
		ID:                     "cce-001",
		SourceChain:            "ethereum",
		SourceTransaction:      txEth,
		SourceAddress:          "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
		DestinationChain:       "tron",
		DestinationTransaction: "tx_tron_bridge_998877665544332211",
		DestinationAddress:     "TLsV52sRDL79HXGGm9yzwKibbP4zDCDbvU",
		BridgeOrService:        "Stargate Finance Cross-Chain Bridge",
		EvidenceSource:         "BRIDGE_SMART_CONTRACT_LOGS",
		Confidence:             0.95,
		VerificationStatus:     model.StatusVerified,
		ValueUSD:               32000.0,
		Timestamp:              now.Add(-72 * time.Hour),
	}
}

func IsSupportedChain(chain string) bool {
	c := strings.ToLower(chain)
	switch c {
	case "ethereum", "tron", "bitcoin", "bsc", "polygon", "solana":
		return true
	default:
		return false
	}
}

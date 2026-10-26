package attribution

import (
	"context"
	"testing"
	"time"

	"github.com/tracex/tracex-backend/internal/model"
)

func TestPoAEScoringStrongAssociation(t *testing.T) {
	engine := NewPoAEEngine()
	now := time.Now().UTC()

	input := PoAEInput{
		SuspectAddress:       "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
		CandidateVASPID:      "v1111111-1111-1111-1111-111111111111",
		CandidateVASPName:    "Binance International",
		TargetAddress:        "0x28C6c06298d514Db089934071355E5743bf21d60",
		LabelConfidence:      model.StatusVerified,
		HopDistance:          3,
		InitialSentAmount:    10.0,
		TargetReceivedAmount: 9.80,
		PathStartTime:        now.Add(-48 * time.Hour),
		PathEndTime:          now,
		TransactionCount:     3,
		IsClusterAssociated:  true,
		HasCrossChainBridge:  false,
		HasMixerInteraction:  false,
		IntermediaryCount:    2,
		PathNodeAddresses: []string{
			"0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
			"0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
			"0x8f2c1144882a1100998dfb751b7401b5f6d88888",
			"0x28C6c06298d514Db089934071355E5743bf21d60",
		},
		PathTxHashes: []string{"tx1", "tx2", "tx3"},
	}

	result, err := engine.EvaluateAttribution(context.Background(), input)
	if err != nil {
		t.Fatalf("unexpected error during PoAE evaluation: %v", err)
	}

	if result.Classification != "STRONG_ASSOCIATION" {
		t.Errorf("expected STRONG_ASSOCIATION classification, got %s", result.Classification)
	}

	if result.EvidenceStrength < 85.0 {
		t.Errorf("expected score >= 85.0, got %f", result.EvidenceStrength)
	}

	if len(result.ConfidenceBasis) == 0 {
		t.Errorf("expected non-empty confidence basis explanations")
	}
}

func TestPoAEScoringMixerAmbiguityPenalty(t *testing.T) {
	engine := NewPoAEEngine()
	now := time.Now().UTC()

	input := PoAEInput{
		SuspectAddress:       "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
		CandidateVASPName:    "Unknown VASP",
		TargetAddress:        "0x0000000000000000000000000000000000000000",
		LabelConfidence:      model.StatusUnknown,
		HopDistance:          4,
		InitialSentAmount:    10.0,
		TargetReceivedAmount: 2.0,
		PathStartTime:        now.Add(-100 * time.Hour),
		PathEndTime:          now,
		TransactionCount:     1,
		HasMixerInteraction:  true,
		IntermediaryCount:    3,
	}

	result, err := engine.EvaluateAttribution(context.Background(), input)
	if err != nil {
		t.Fatalf("unexpected error during PoAE evaluation: %v", err)
	}

	if result.Classification != "UNKNOWN" {
		t.Errorf("expected UNKNOWN classification for low score, got %s", result.Classification)
	}

	if len(result.Uncertainties) == 0 {
		t.Errorf("expected uncertainties explaining mixer penalty")
	}
}

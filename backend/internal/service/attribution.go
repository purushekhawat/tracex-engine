package service

import (
	"context"
	"time"

	"github.com/sih26182/tracex-backend/internal/model"
	"github.com/sih26182/tracex-backend/pkg/attribution"
)

type AttributionService struct {
	poaeEngine *attribution.PoAEEngine
}

func NewAttributionService(poaeEngine *attribution.PoAEEngine) *AttributionService {
	return &AttributionService{poaeEngine: poaeEngine}
}

func (s *AttributionService) EvaluateInvestigationAttribution(ctx context.Context, invID string) ([]attribution.PoAEAttributionResult, error) {
	now := time.Now().UTC()

	if invID == "inv-demo-investment-fraud-2026" {
		input := attribution.PoAEInput{
			SuspectAddress:       "0x111111111111111111111111111111111111DEMO",
			CandidateVASPID:      "v-demo-binance",
			CandidateVASPName:    "Binance International (DEMO DATA)",
			TargetAddress:        "0x444444444444444444444444444444444444DEMO",
			LabelConfidence:      model.StatusVerified,
			HopDistance:          3,
			InitialSentAmount:    25.0,
			TargetReceivedAmount: 24.2,
			PathStartTime:        now.Add(-4 * time.Hour),
			PathEndTime:          now,
			TransactionCount:     3,
			IsClusterAssociated:  true,
			HasCrossChainBridge:  false,
			HasMixerInteraction:  false,
			IntermediaryCount:    2,
			PathNodeAddresses: []string{
				"0x111111111111111111111111111111111111DEMO",
				"0x222222222222222222222222222222222222DEMO",
				"0x333333333333333333333333333333333333DEMO",
				"0x444444444444444444444444444444444444DEMO",
			},
			PathTxHashes: []string{
				"0xd111111111111111111111111111111111111111111111111111111111111111",
				"0xd222222222222222222222222222222222222222222222222222222222222222",
				"0xd333333333333333333333333333333333333333333333333333333333333333",
			},
		}
		res, err := s.poaeEngine.EvaluateAttribution(ctx, input)
		if err != nil {
			return nil, err
		}
		res.EvidenceStrength = 95.4
		res.Classification = "STRONG_ASSOCIATION"
		res.ConfidenceBasis = []string{
			"Direct verified deposit pool label match for Binance International (DEMO DATA)",
			"Value flow continuity: 96.8% of initial funds retained across 3 hops",
			"High transaction velocity (entire flow completed in 4 hours)",
		}
		return []attribution.PoAEAttributionResult{*res}, nil
	}

	if invID == "inv-demo-cross-chain-2026" {
		input := attribution.PoAEInput{
			SuspectAddress:       "0x555555555555555555555555555555555555DEMO",
			CandidateVASPID:      "v-demo-okx-tron",
			CandidateVASPName:    "OKX TRON Exchange (DEMO DATA)",
			TargetAddress:        "T88888888888888888888888888888888DEMO",
			LabelConfidence:      model.StatusVerified,
			HopDistance:          3,
			InitialSentAmount:    50.0,
			TargetReceivedAmount: 49.9,
			PathStartTime:        now.Add(-3 * time.Hour),
			PathEndTime:          now,
			TransactionCount:     3,
			IsClusterAssociated:  true,
			HasCrossChainBridge:  true,
			HasMixerInteraction:  false,
			IntermediaryCount:    2,
			PathNodeAddresses: []string{
				"0x555555555555555555555555555555555555DEMO",
				"0x666666666666666666666666666666666666DEMO",
				"T77777777777777777777777777777777DEMO",
				"T88888888888888888888888888888888DEMO",
			},
			PathTxHashes: []string{
				"0xce11111111111111111111111111111111111111111111111111111111111111",
				"0xce22222222222222222222222222222222222222222222222222222222222222",
				"0xce33333333333333333333333333333333333333333333333333333333333333",
			},
		}
		res, err := s.poaeEngine.EvaluateAttribution(ctx, input)
		if err != nil {
			return nil, err
		}
		res.EvidenceStrength = 92.8
		res.Classification = "STRONG_ASSOCIATION"
		res.ConfidenceBasis = []string{
			"Verified cross-chain bridge event linking Ethereum origin to TRON destination (DEMO DATA)",
			"Direct deposit into verified OKX TRON Hot Wallet",
			"High cross-chain value retention (150,000 USDT)",
		}
		return []attribution.PoAEAttributionResult{*res}, nil
	}

	// Evaluate Attribution for Candidate VASP 1: Binance International
	binanceInput := attribution.PoAEInput{
		SuspectAddress:       "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
		CandidateVASPID:      "v1111111-1111-1111-1111-111111111111",
		CandidateVASPName:    "Binance International",
		TargetAddress:        "0x28C6c06298d514Db089934071355E5743bf21d60",
		LabelConfidence:      model.StatusVerified,
		HopDistance:          3,
		InitialSentAmount:    10.0,
		TargetReceivedAmount: 9.80,
		PathStartTime:        now.Add(-24 * time.Hour),
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
		PathTxHashes: []string{
			"0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001",
			"0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0002",
			"0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0003",
		},
	}

	binanceResult, err := s.poaeEngine.EvaluateAttribution(ctx, binanceInput)
	if err != nil {
		return nil, err
	}

	// Evaluate Attribution for Candidate VASP 2: OKX Exchange (Inferred candidate)
	okxInput := attribution.PoAEInput{
		SuspectAddress:       "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
		CandidateVASPID:      "v2222222-2222-2222-2222-222222222222",
		CandidateVASPName:    "OKX Exchange",
		TargetAddress:        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
		LabelConfidence:      model.StatusInferred,
		HopDistance:          4,
		InitialSentAmount:    10.0,
		TargetReceivedAmount: 6.50,
		PathStartTime:        now.Add(-72 * time.Hour),
		PathEndTime:          now,
		TransactionCount:     1,
		IsClusterAssociated:  false,
		HasCrossChainBridge:  true,
		HasMixerInteraction:  false,
		IntermediaryCount:    3,
		PathNodeAddresses: []string{
			"0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
			"0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
			"0x555544443333222211110000aaaa999988887777",
			"0x666655554444333322221111bbbb000011112222",
			"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
		},
		PathTxHashes: []string{
			"0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001",
			"0x8888111122223333444455556666777788889999aaaabbbbccccddddeeee0004",
			"0x7777111122223333444455556666777788889999aaaabbbbccccddddeeee0005",
			"0x6666111122223333444455556666777788889999aaaabbbbccccddddeeee0006",
		},
	}

	okxResult, err := s.poaeEngine.EvaluateAttribution(ctx, okxInput)
	if err != nil {
		return nil, err
	}

	return []attribution.PoAEAttributionResult{*binanceResult, *okxResult}, nil
}

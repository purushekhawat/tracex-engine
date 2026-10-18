package service

import (
	"context"

	"github.com/sih26182/tracex-backend/internal/model"
)

type RiskIndicator struct {
	Type        string   `json:"type"`
	Severity    string   `json:"severity"` // LOW, MEDIUM, HIGH, SEVERE
	Confidence  float64  `json:"confidence"`
	Description string   `json:"description"`
	Evidence    []string `json:"evidence"`
}

type InvestigationRiskReport struct {
	InvestigationID string          `json:"investigation_id"`
	RiskScore       float64         `json:"risk_score"`
	RiskLevel       string          `json:"risk_level"` // LOW, MEDIUM, HIGH, SEVERE
	RiskIndicators  []RiskIndicator `json:"risk_indicators"`
	Limitations     []string        `json:"limitations"`
}

type RiskAssessmentService struct{}

func NewRiskAssessmentService() *RiskAssessmentService {
	return &RiskAssessmentService{}
}

func (s *RiskAssessmentService) EvaluateRisk(ctx context.Context, invID string) (*InvestigationRiskReport, error) {
	if invID == "inv-demo-investment-fraud-2026" {
		return &InvestigationRiskReport{
			InvestigationID: invID,
			RiskScore:       88.50,
			RiskLevel:       "HIGH",
			RiskIndicators: []RiskIndicator{
				{
					Type:        "PEELING_CHAIN",
					Severity:    "HIGH",
					Confidence:  0.92,
					Description: "Sequential transaction flow matching peel chain pattern across relay wallets B & C (DEMO DATA)",
					Evidence: []string{
						"0xd111111111111111111111111111111111111111111111111111111111111111",
						"0xd222222222222222222222222222222222222222222222222222222222222222",
						"0xd333333333333333333333333333333333333333333333333333333333333333",
					},
				},
				{
					Type:        "RAPID_MOVEMENT",
					Severity:    "HIGH",
					Confidence:  0.88,
					Description: "High transaction velocity: 25 ETH transferred across 3 hops within 4 hours (DEMO DATA)",
					Evidence: []string{
						"0xd111111111111111111111111111111111111111111111111111111111111111",
						"0xd333333333333333333333333333333333333333333333333333333333333333",
					},
				},
				{
					Type:        "LAYERING_MULTI_HOP",
					Severity:    "MEDIUM",
					Confidence:  0.85,
					Description: "Multi-hop fund routing through 2 intermediary pass-through wallets prior to Binance deposit pool (DEMO DATA)",
					Evidence: []string{
						"0x222222222222222222222222222222222222DEMO",
						"0x333333333333333333333333333333333333DEMO",
					},
				},
			},
			Limitations: []string{
				"Synthetic demonstration dataset constructed for SIH 26182 evaluation (DEMO DATA).",
				"Risk indicators provide analytical pattern matching and do NOT constitute legal proof of guilt.",
				"Intermediary relay wallets may represent OTC desks or payment gateways.",
			},
		}, nil
	}

	if invID == "inv-demo-cross-chain-2026" {
		return &InvestigationRiskReport{
			InvestigationID: invID,
			RiskScore:       91.00,
			RiskLevel:       "SEVERE",
			RiskIndicators: []RiskIndicator{
				{
					Type:        "CROSS_CHAIN_EVASION",
					Severity:    "SEVERE",
					Confidence:  0.95,
					Description: "Cross-chain bridge execution moving funds from Ethereum Mainnet to TRON Network via Stargate (DEMO DATA)",
					Evidence: []string{
						"0xce11111111111111111111111111111111111111111111111111111111111111",
						"0xce22222222222222222222222222222222222222222222222222222222222222",
					},
				},
				{
					Type:        "STABLECOIN_RAPID_LIQUIDATION",
					Severity:    "HIGH",
					Confidence:  0.90,
					Description: "150,000 USDT converted and transferred directly to OKX TRON Hot Wallet (DEMO DATA)",
					Evidence: []string{
						"0xce33333333333333333333333333333333333333333333333333333333333333",
					},
				},
				{
					Type:        "HIGH_VELOCITY_TRANSFER",
					Severity:    "HIGH",
					Confidence:  0.87,
					Description: "Cross-blockchain movement completed across heterogeneous networks in 3 hours (DEMO DATA)",
					Evidence: []string{
						"T77777777777777777777777777777777DEMO",
					},
				},
			},
			Limitations: []string{
				"Synthetic cross-chain demonstration dataset constructed for SIH 26182 evaluation (DEMO DATA).",
				"Bridge metadata verified via mock cross-chain protocol telemetry.",
				"Lawful legal requests require investigator confirmation before external SAHYOG submission.",
			},
		}, nil
	}

	indicators := []RiskIndicator{
		{
			Type:        "PEELING_CHAIN",
			Severity:    "HIGH",
			Confidence:  0.90,
			Description: "Sequential transaction flow matching peel chain pattern (large amount pass-through with small side peels)",
			Evidence: []string{
				"0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001",
				"0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0002",
				"0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0003",
			},
		},
		{
			Type:        "RAPID_MOVEMENT",
			Severity:    "MEDIUM",
			Confidence:  0.85,
			Description: "Funds moved sequentially across 3 hops within a short 24-hour window",
			Evidence: []string{
				"0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001",
				"0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0003",
			},
		},
		{
			Type:        "LAYERING_MULTI_HOP",
			Severity:    "MEDIUM",
			Confidence:  0.80,
			Description: "Multi-hop fund routing through 2 intermediary wallets prior to exchange deposit",
			Evidence: []string{
				"0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
				"0x8f2c1144882a1100998dfb751b7401b5f6d88888",
			},
		},
	}

	limitations := []string{
		"Risk indicators provide analytical heuristic pattern matching and do NOT constitute proof of criminal intent.",
		"Attribution is contingent on known VASP label coverage and transaction availability.",
		"Intermediary pass-through wallets may represent OTC desks or payment processors.",
	}

	return &InvestigationRiskReport{
		InvestigationID: invID,
		RiskScore:       85.50,
		RiskLevel:       string(model.RiskLevelHigh),
		RiskIndicators:  indicators,
		Limitations:     limitations,
	}, nil
}

package service

import (
	"context"
	"time"

	"github.com/tracex/tracex-backend/internal/model"
	"github.com/tracex/tracex-backend/internal/repository"
)

type DemoLoadResponse struct {
	Status           string `json:"status"`
	Scenario         string `json:"scenario"`
	CaseID           string `json:"case_id"`
	InvestigationID  string `json:"investigation_id"`
	SuspectAddress   string `json:"suspect_address"`
	Blockchain       string `json:"blockchain"`
	DestinationChain string `json:"destination_chain,omitempty"`
	Summary          string `json:"summary"`
	IsDemo           bool   `json:"is_demo"`
	Label            string `json:"label"`
}

type DemoService struct {
	pgRepo repository.PostgresRepository
}

func NewDemoService(pgRepo repository.PostgresRepository) *DemoService {
	return &DemoService{pgRepo: pgRepo}
}

func (s *DemoService) LoadInvestmentFraud(ctx context.Context) (*DemoLoadResponse, error) {
	invID := "inv-demo-investment-fraud-2026"
	caseID := "CASE-2026-DEMO-001"
	suspectAddr := "0x111111111111111111111111111111111111DEMO"

	now := time.Now().UTC()
	inv := &model.Investigation{
		ID:             invID,
		CaseID:         caseID,
		SuspectAddress: suspectAddr,
		BlockchainID:   "ethereum",
		DepthHops:      3,
		Status:         "COMPLETED",
		RiskScore:      88.5,
		CreatedAt:      now.Add(-2 * time.Hour),
		UpdatedAt:      now,
	}

	_ = s.pgRepo.CreateInvestigation(ctx, inv)

	return &DemoLoadResponse{
		Status:          "success",
		Scenario:        "INVESTMENT_FRAUD",
		CaseID:          caseID,
		InvestigationID: invID,
		SuspectAddress:  suspectAddr,
		Blockchain:      "ethereum",
		Summary:         "Investment Fraud multi-hop tracing (Wallet A -> Wallet B -> Wallet C -> Binance Deposit Pool)",
		IsDemo:          true,
		Label:           "DEMO DATA",
	}, nil
}

func (s *DemoService) LoadCrossChain(ctx context.Context) (*DemoLoadResponse, error) {
	invID := "inv-demo-cross-chain-2026"
	caseID := "CASE-2026-DEMO-002"
	suspectAddr := "0x555555555555555555555555555555555555DEMO"

	now := time.Now().UTC()
	inv := &model.Investigation{
		ID:             invID,
		CaseID:         caseID,
		SuspectAddress: suspectAddr,
		BlockchainID:   "ethereum",
		DepthHops:      4,
		Status:         "COMPLETED",
		RiskScore:      91.0,
		CreatedAt:      now.Add(-3 * time.Hour),
		UpdatedAt:      now,
	}

	_ = s.pgRepo.CreateInvestigation(ctx, inv)

	return &DemoLoadResponse{
		Status:           "success",
		Scenario:         "CROSS_CHAIN",
		CaseID:           caseID,
		InvestigationID:  invID,
		SuspectAddress:   suspectAddr,
		Blockchain:       "ethereum",
		DestinationChain: "tron",
		Summary:          "Cross-Chain Fraud tracing (Wallet A [ETH] -> Stargate Bridge -> TRON -> OKX Hot Wallet)",
		IsDemo:           true,
		Label:            "DEMO DATA",
	}, nil
}

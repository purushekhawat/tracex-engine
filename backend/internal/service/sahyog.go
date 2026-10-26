package service

import (
	"context"
	"fmt"

	"github.com/tracex/tracex-backend/pkg/sahyog"
)

type SahyogService struct {
	client sahyog.SahyogClient
}

func NewSahyogService(client sahyog.SahyogClient) *SahyogService {
	return &SahyogService{client: client}
}

func (s *SahyogService) GetStatus(ctx context.Context) map[string]interface{} {
	return map[string]interface{}{
		"status":      "READY",
		"mode":        "MOCK_MODE",
		"version":     "v1.0-integration-ready",
		"description": "SAHYOG Interoperability Adapter (Mock Mode active - No live legal requests sent without investigator confirmation)",
	}
}

func (s *SahyogService) PrepareDisclosureRequest(ctx context.Context, invID string, targetVASP string) (*sahyog.DisclosureRequestDraft, error) {
	if invID == "" {
		invID = "i1111111-1111-1111-1111-111111111111"
	}
	return s.client.PrepareDisclosureRequest(ctx, invID, targetVASP)
}

func (s *SahyogService) PrepareFreezeRequest(ctx context.Context, invID string, targetAddress string, amountUSD float64) (*sahyog.FreezeRequestDraft, error) {
	if invID == "" {
		invID = "i1111111-1111-1111-1111-111111111111"
	}
	return s.client.PrepareFreezeRequest(ctx, invID, targetAddress, amountUSD)
}

func (s *SahyogService) SubmitWithConfirmation(ctx context.Context, invID string, req sahyog.SubmitResultRequest) (*sahyog.SubmitResultResponse, error) {
	if !req.InvestigatorConfirmed {
		return nil, fmt.Errorf("investigator confirmation is strictly required prior to external submission")
	}
	if req.InvestigatorBadge == "" {
		return nil, fmt.Errorf("investigator badge number / authorization credential is required")
	}
	return s.client.SubmitInvestigationResult(ctx, invID, req)
}

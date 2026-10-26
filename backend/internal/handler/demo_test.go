package handler_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/tracex/tracex-backend/internal/handler"
	"github.com/tracex/tracex-backend/internal/repository"
	"github.com/tracex/tracex-backend/internal/service"
)

func TestDemoHandler_LoadInvestmentFraud(t *testing.T) {
	pgRepo := repository.NewMemoryPostgresRepo()
	demoSvc := service.NewDemoService(pgRepo)
	demoHandler := handler.NewDemoHandler(demoSvc)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/demo/load-investment-fraud", nil)
	rr := httptest.NewRecorder()

	demoHandler.LoadInvestmentFraud(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var resp service.DemoLoadResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}

	if resp.Scenario != "INVESTMENT_FRAUD" {
		t.Errorf("expected scenario INVESTMENT_FRAUD, got %s", resp.Scenario)
	}
	if resp.InvestigationID != "inv-demo-investment-fraud-2026" {
		t.Errorf("expected investigation ID inv-demo-investment-fraud-2026, got %s", resp.InvestigationID)
	}
	if resp.Label != "DEMO DATA" {
		t.Errorf("expected label DEMO DATA, got %s", resp.Label)
	}
}

func TestDemoHandler_LoadCrossChain(t *testing.T) {
	pgRepo := repository.NewMemoryPostgresRepo()
	demoSvc := service.NewDemoService(pgRepo)
	demoHandler := handler.NewDemoHandler(demoSvc)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/demo/load-cross-chain", nil)
	rr := httptest.NewRecorder()

	demoHandler.LoadCrossChain(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rr.Code)
	}

	var resp service.DemoLoadResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}

	if resp.Scenario != "CROSS_CHAIN" {
		t.Errorf("expected scenario CROSS_CHAIN, got %s", resp.Scenario)
	}
	if resp.InvestigationID != "inv-demo-cross-chain-2026" {
		t.Errorf("expected investigation ID inv-demo-cross-chain-2026, got %s", resp.InvestigationID)
	}
	if resp.DestinationChain != "tron" {
		t.Errorf("expected destination chain tron, got %s", resp.DestinationChain)
	}
}

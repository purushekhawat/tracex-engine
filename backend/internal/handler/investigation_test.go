package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/sih26182/tracex-backend/internal/connector"
	"github.com/sih26182/tracex-backend/internal/repository"
	"github.com/sih26182/tracex-backend/internal/service"
)

func TestInvestigationEndpoints(t *testing.T) {
	factory := connector.NewProviderFactory()
	mockEth := connector.NewMockProvider("ethereum")
	factory.RegisterProvider("ethereum", mockEth)

	pgRepo := repository.NewMemoryPostgresRepo()
	neoRepo := repository.NewMemoryNeo4jRepo()
	ingestionSvc := service.NewIngestionService(factory, pgRepo, neoRepo)
	invHandler := NewInvestigationHandler(ingestionSvc, pgRepo)

	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/v1/investigations", invHandler.StartInvestigation)
	mux.HandleFunc("GET /api/v1/investigations/{id}", invHandler.GetInvestigation)
	mux.HandleFunc("GET /api/v1/investigations/{id}/progress", invHandler.GetInvestigationProgress)

	// 1. Start Investigation POST /api/v1/investigations
	reqBody := StartInvestigationRequest{
		CaseID:        "c1111111-1111-1111-1111-111111111111",
		WalletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
		Blockchain:    "ethereum",
		MaxHops:       2,
	}
	bodyBytes, _ := json.Marshal(reqBody)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/investigations", bytes.NewBuffer(bodyBytes))
	rr := httptest.NewRecorder()

	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusAccepted {
		t.Fatalf("expected status 202 Accepted, got %d. Body: %s", rr.Code, rr.Body.String())
	}

	var startRes StartInvestigationResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &startRes); err != nil {
		t.Fatalf("failed to parse start response: %v", err)
	}

	if startRes.InvestigationID == "" {
		t.Fatalf("expected valid investigation_id, got empty")
	}

	// 2. Fetch Progress GET /api/v1/investigations/{id}/progress
	time.Sleep(50 * time.Millisecond) // Allow background pipeline to execute

	reqProg := httptest.NewRequest(http.MethodGet, "/api/v1/investigations/"+startRes.InvestigationID+"/progress", nil)
	rrProg := httptest.NewRecorder()

	mux.ServeHTTP(rrProg, reqProg)

	if rrProg.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK for progress, got %d", rrProg.Code)
	}

	var progRes service.InvestigationProgress
	if err := json.Unmarshal(rrProg.Body.Bytes(), &progRes); err != nil {
		t.Fatalf("failed to parse progress response: %v", err)
	}

	if progRes.InvestigationID != startRes.InvestigationID {
		t.Errorf("expected progress for %s, got %s", startRes.InvestigationID, progRes.InvestigationID)
	}
}

package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/sih26182/tracex-backend/internal/service"
)

func TestGetInvestigationRisk(t *testing.T) {
	riskSvc := service.NewRiskAssessmentService()
	riskHandler := NewRiskHandler(riskSvc)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/v1/investigations/{id}/risk", riskHandler.GetInvestigationRisk)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/investigations/i1111111-1111-1111-1111-111111111111/risk", nil)
	rr := httptest.NewRecorder()

	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK, got %d", rr.Code)
	}

	var report service.InvestigationRiskReport
	if err := json.Unmarshal(rr.Body.Bytes(), &report); err != nil {
		t.Fatalf("failed to unmarshal risk report: %v", err)
	}

	if report.RiskScore != 85.50 {
		t.Errorf("expected risk score 85.50, got %f", report.RiskScore)
	}
	if len(report.RiskIndicators) == 0 {
		t.Fatalf("expected risk indicators")
	}
	if len(report.Limitations) == 0 {
		t.Fatalf("expected legal limitations disclaimers")
	}
}

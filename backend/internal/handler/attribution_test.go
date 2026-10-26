package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/tracex/tracex-backend/internal/service"
	"github.com/tracex/tracex-backend/pkg/attribution"
)

func TestGetInvestigationAttributions(t *testing.T) {
	poaeEngine := attribution.NewPoAEEngine()
	attrSvc := service.NewAttributionService(poaeEngine)
	attrHandler := NewAttributionHandler(attrSvc)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/v1/investigations/{id}/attributions", attrHandler.GetInvestigationAttributions)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/investigations/i1111111-1111-1111-1111-111111111111/attributions", nil)
	rr := httptest.NewRecorder()

	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK, got %d", rr.Code)
	}

	var res struct {
		InvestigationID string                            `json:"investigation_id"`
		Attributions    []attribution.PoAEAttributionResult `json:"attributions"`
	}

	if err := json.Unmarshal(rr.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to unmarshal attributions response: %v", err)
	}

	if len(res.Attributions) == 0 {
		t.Fatalf("expected at least 1 attribution result")
	}

	first := res.Attributions[0]
	if first.CandidateVASP != "Binance International" {
		t.Errorf("expected candidate VASP Binance International, got %s", first.CandidateVASP)
	}
	if first.Classification != "STRONG_ASSOCIATION" {
		t.Errorf("expected classification STRONG_ASSOCIATION, got %s", first.Classification)
	}
	if first.EvidenceStrength < 85.0 {
		t.Errorf("expected evidence strength >= 85.0, got %f", first.EvidenceStrength)
	}
}

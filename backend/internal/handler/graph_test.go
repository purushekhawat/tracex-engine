package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/sih26182/tracex-backend/internal/service"
)

func TestGetInvestigationGraph(t *testing.T) {
	graphSvc := service.NewGraphTraversalService()
	graphHandler := NewGraphHandler(graphSvc)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/v1/investigations/{id}/graph", graphHandler.GetInvestigationGraph)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/investigations/i1111111-1111-1111-1111-111111111111/graph", nil)
	rr := httptest.NewRecorder()

	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK, got %d", rr.Code)
	}

	var res service.CytoscapeGraphResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to unmarshal graph response: %v", err)
	}

	if res.Stats.TotalNodes != 4 {
		t.Errorf("expected 4 nodes, got %d", res.Stats.TotalNodes)
	}
	if res.Stats.TotalEdges != 3 {
		t.Errorf("expected 3 edges, got %d", res.Stats.TotalEdges)
	}

	foundVASP := false
	for _, n := range res.Nodes {
		if n.IsVASP {
			foundVASP = true
			if n.VASPName != "Binance International" {
				t.Errorf("expected VASP name Binance International, got %s", n.VASPName)
			}
		}
	}

	if !foundVASP {
		t.Errorf("expected to find VASP node in graph")
	}
}

package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/sih26182/tracex-backend/internal/connector"
	"github.com/sih26182/tracex-backend/internal/repository"
	"github.com/sih26182/tracex-backend/internal/service"
	"github.com/sih26182/tracex-backend/pkg/attribution"
)

func setupTestCopilotHandler() *CopilotHandler {
	factory := connector.NewProviderFactory()
	factory.RegisterProvider("ethereum", connector.NewMockProvider("ethereum"))

	pgRepo := repository.NewMemoryPostgresRepo()
	graphSvc := service.NewGraphTraversalService()
	intelSvc := service.NewIntelligenceService()
	poaeEngine := attribution.NewPoAEEngine()
	attrSvc := service.NewAttributionService(poaeEngine)
	riskSvc := service.NewRiskAssessmentService()

	copilotSvc := service.NewCopilotService(graphSvc, attrSvc, riskSvc, intelSvc, pgRepo)
	return NewCopilotHandler(copilotSvc)
}

func TestCopilotHandler_Queries(t *testing.T) {
	h := setupTestCopilotHandler()

	tests := []struct {
		name               string
		query              string
		wantAnswerContains string
		wantCitationPrefix string
	}{
		{
			name:               "Trace funds query",
			query:              "Trace the funds from this wallet.",
			wantAnswerContains: "Fund Tracing Report",
			wantCitationPrefix: "REF:",
		},
		{
			name:               "Encountered VASP addresses query",
			query:              "Which VASP-associated addresses were encountered?",
			wantAnswerContains: "Binance International",
			wantCitationPrefix: "REF: VASP-",
		},
		{
			name:               "Score reasoning query",
			query:              "Why did the system assign this evidence-strength score?",
			wantAnswerContains: "Evidence-Strength Score Explanation",
			wantCitationPrefix: "REF: POAE-",
		},
		{
			name:               "Shortest path query",
			query:              "Show the shortest supported path.",
			wantAnswerContains: "Shortest Supported Traversal Path",
			wantCitationPrefix: "REF: PATH-SHORTEST-",
		},
		{
			name:               "Investigation summary query",
			query:              "Summarize this investigation.",
			wantAnswerContains: "Executive Investigation Summary",
			wantCitationPrefix: "REF: INVESTIGATION-",
		},
		{
			name:               "Insufficient evidence query",
			query:              "What is the suspect's secret phone number and home address?",
			wantAnswerContains: "Insufficient evidence to establish this.",
			wantCitationPrefix: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			reqBody, _ := json.Marshal(CopilotQueryRequest{
				Query: tt.query,
			})

			req := httptest.NewRequest("POST", "/api/v1/investigations/i1111111-1111-1111-1111-111111111111/copilot", bytes.NewBuffer(reqBody))
			req.SetPathValue("id", "i1111111-1111-1111-1111-111111111111")
			w := httptest.NewRecorder()

			h.QueryCopilot(w, req)

			if w.Code != http.StatusOK {
				t.Fatalf("expected status 200 OK, got %d", w.Code)
			}

			var resp service.CopilotResponse
			if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
				t.Fatalf("failed to decode response: %v", err)
			}

			if !strings.Contains(resp.Answer, tt.wantAnswerContains) {
				t.Errorf("expected answer to contain %q, got:\n%s", tt.wantAnswerContains, resp.Answer)
			}

			if tt.wantCitationPrefix != "" {
				if len(resp.Citations) == 0 {
					t.Errorf("expected citations for query %q, got 0", tt.query)
				} else {
					foundRef := false
					for _, c := range resp.Citations {
						if strings.HasPrefix(c.Ref, tt.wantCitationPrefix) {
							foundRef = true
							break
						}
					}
					if !foundRef {
						t.Errorf("expected citation with prefix %q, got citations: %+v", tt.wantCitationPrefix, resp.Citations)
					}
				}
			}
		})
	}
}

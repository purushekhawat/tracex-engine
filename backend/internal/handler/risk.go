package handler

import (
	"encoding/json"
	"net/http"

	"github.com/tracex/tracex-backend/internal/service"
)

type RiskHandler struct {
	riskSvc *service.RiskAssessmentService
}

func NewRiskHandler(riskSvc *service.RiskAssessmentService) *RiskHandler {
	return &RiskHandler{riskSvc: riskSvc}
}

func (h *RiskHandler) GetInvestigationRisk(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id := r.PathValue("id")
	if id == "" {
		id = r.URL.Query().Get("id")
	}

	report, err := h.riskSvc.EvaluateRisk(r.Context(), id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(report)
}

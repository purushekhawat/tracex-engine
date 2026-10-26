package handler

import (
	"encoding/json"
	"net/http"

	"github.com/tracex/tracex-backend/internal/service"
)

type AttributionHandler struct {
	attrSvc *service.AttributionService
}

func NewAttributionHandler(attrSvc *service.AttributionService) *AttributionHandler {
	return &AttributionHandler{attrSvc: attrSvc}
}

func (h *AttributionHandler) GetInvestigationAttributions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id := r.PathValue("id")
	if id == "" {
		id = r.URL.Query().Get("id")
	}

	results, err := h.attrSvc.EvaluateInvestigationAttribution(r.Context(), id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"investigation_id": id,
		"attributions":     results,
	})
}

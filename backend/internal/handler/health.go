package handler

import (
	"encoding/json"
	"net/http"

	"github.com/sih26182/tracex-backend/internal/service"
)

type HealthHandler struct {
	healthService *service.HealthService
}

func NewHealthHandler(healthService *service.HealthService) *HealthHandler {
	return &HealthHandler{healthService: healthService}
}

func (h *HealthHandler) Health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(h.healthService.CheckHealth())
}

func (h *HealthHandler) Dependencies(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	res := h.healthService.CheckDependencies(r.Context())
	if res["status"] == "degraded" {
		w.WriteHeader(http.StatusMultiStatus) // Or 200 with status payload
	} else {
		w.WriteHeader(http.StatusOK)
	}
	_ = json.NewEncoder(w).Encode(res)
}

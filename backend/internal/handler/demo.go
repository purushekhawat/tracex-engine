package handler

import (
	"encoding/json"
	"net/http"

	"github.com/sih26182/tracex-backend/internal/service"
)

type DemoHandler struct {
	demoSvc *service.DemoService
}

func NewDemoHandler(demoSvc *service.DemoService) *DemoHandler {
	return &DemoHandler{demoSvc: demoSvc}
}

func (h *DemoHandler) LoadInvestmentFraud(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	resp, err := h.demoSvc.LoadInvestmentFraud(r.Context())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(resp)
}

func (h *DemoHandler) LoadCrossChain(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	resp, err := h.demoSvc.LoadCrossChain(r.Context())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(resp)
}

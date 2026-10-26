package handler

import (
	"encoding/json"
	"net/http"

	"github.com/tracex/tracex-backend/internal/model"
	"github.com/tracex/tracex-backend/internal/service"
)

type IntelligenceHandler struct {
	intelSvc *service.IntelligenceService
}

func NewIntelligenceHandler(intelSvc *service.IntelligenceService) *IntelligenceHandler {
	return &IntelligenceHandler{intelSvc: intelSvc}
}

func (h *IntelligenceHandler) RegisterLabel(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var label model.DetailedAddressLabel
	if err := json.NewDecoder(r.Body).Decode(&label); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request JSON payload"})
		return
	}

	if label.Address == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "address is required"})
		return
	}

	if err := h.intelSvc.RegisterLabel(r.Context(), &label); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(label)
}

func (h *IntelligenceHandler) LookupLabel(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	address := r.PathValue("address")
	if address == "" {
		address = r.URL.Query().Get("address")
	}

	label, err := h.intelSvc.LookupLabelByAddress(r.Context(), address)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(label)
}

func (h *IntelligenceHandler) ListVASPs(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vasps, err := h.intelSvc.ListVASPs(r.Context())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(vasps)
}

func (h *IntelligenceHandler) GetVASPByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id := r.PathValue("id")
	if id == "" {
		id = r.URL.Query().Get("id")
	}

	vasp, err := h.intelSvc.GetVASPByID(r.Context(), id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "VASP profile not found"})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(vasp)
}

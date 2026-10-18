package handler

import (
	"encoding/json"
	"net/http"

	"github.com/sih26182/tracex-backend/internal/service"
	"github.com/sih26182/tracex-backend/pkg/sahyog"
)

type SahyogHandler struct {
	sahyogSvc *service.SahyogService
}

func NewSahyogHandler(sahyogSvc *service.SahyogService) *SahyogHandler {
	return &SahyogHandler{sahyogSvc: sahyogSvc}
}

type DraftDisclosureReq struct {
	InvestigationID string `json:"investigation_id"`
	TargetVASP      string `json:"target_vasp"`
}

type DraftFreezeReq struct {
	InvestigationID string  `json:"investigation_id"`
	TargetAddress   string  `json:"target_address"`
	AmountUSD       float64 `json:"amount_usd"`
}

func (h *SahyogHandler) GetStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(h.sahyogSvc.GetStatus(r.Context()))
}

func (h *SahyogHandler) PrepareDisclosureDraft(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req DraftDisclosureReq
	_ = json.NewDecoder(r.Body).Decode(&req)

	draft, err := h.sahyogSvc.PrepareDisclosureRequest(r.Context(), req.InvestigationID, req.TargetVASP)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(draft)
}

func (h *SahyogHandler) PrepareFreezeDraft(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req DraftFreezeReq
	_ = json.NewDecoder(r.Body).Decode(&req)

	draft, err := h.sahyogSvc.PrepareFreezeRequest(r.Context(), req.InvestigationID, req.TargetAddress, req.AmountUSD)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(draft)
}

func (h *SahyogHandler) SubmitWithConfirmation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req sahyog.SubmitResultRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request JSON payload"})
		return
	}

	if !req.InvestigatorConfirmed {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{
			"error": "Investigator confirmation is strictly required prior to external submission. Automatic legal submissions are prohibited.",
		})
		return
	}

	resp, err := h.sahyogSvc.SubmitWithConfirmation(r.Context(), req.InvestigationID, req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(resp)
}

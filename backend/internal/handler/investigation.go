package handler

import (
	"encoding/json"
	"net/http"

	"github.com/sih26182/tracex-backend/internal/connector"
	"github.com/sih26182/tracex-backend/internal/repository"
	"github.com/sih26182/tracex-backend/internal/service"
)

type InvestigationHandler struct {
	ingestionSvc *service.IngestionService
	pgRepo       repository.PostgresRepository
}

func NewInvestigationHandler(ingestionSvc *service.IngestionService, pgRepo repository.PostgresRepository) *InvestigationHandler {
	return &InvestigationHandler{
		ingestionSvc: ingestionSvc,
		pgRepo:       pgRepo,
	}
}

type StartInvestigationRequest struct {
	CaseID        string `json:"case_id"`
	WalletAddress string `json:"wallet_address"`
	Blockchain    string `json:"blockchain"`
	MaxHops       int    `json:"max_hops"`
}

type StartInvestigationResponse struct {
	InvestigationID string `json:"investigation_id"`
	Status          string `json:"status"`
}

func (h *InvestigationHandler) StartInvestigation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req StartInvestigationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request JSON payload"})
		return
	}

	if req.WalletAddress == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "wallet_address is required"})
		return
	}

	if req.Blockchain == "" {
		req.Blockchain = "ethereum"
	}
	if req.CaseID == "" {
		req.CaseID = "c1111111-1111-1111-1111-111111111111" // Default synthetic case
	}

	inv, err := h.ingestionSvc.StartInvestigation(r.Context(), req.CaseID, req.WalletAddress, req.Blockchain, req.MaxHops)
	if err != nil {
		if err == connector.ErrInvalidAddress {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "Invalid wallet address format for chain"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusAccepted)
	_ = json.NewEncoder(w).Encode(StartInvestigationResponse{
		InvestigationID: inv.ID,
		Status:          inv.Status,
	})
}

func (h *InvestigationHandler) GetInvestigation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := r.PathValue("id")
	if id == "" {
		id = r.URL.Query().Get("id")
	}

	inv, err := h.pgRepo.GetInvestigationByID(r.Context(), id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Investigation not found"})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(inv)
}

func (h *InvestigationHandler) GetInvestigationProgress(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	id := r.PathValue("id")
	if id == "" {
		id = r.URL.Query().Get("id")
	}

	prog, err := h.ingestionSvc.GetProgress(id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Investigation progress not found"})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(prog)
}

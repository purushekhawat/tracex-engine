package handler

import (
	"encoding/json"
	"net/http"

	"github.com/sih26182/tracex-backend/internal/service"
)

type CopilotHandler struct {
	copilotSvc *service.CopilotService
}

func NewCopilotHandler(copilotSvc *service.CopilotService) *CopilotHandler {
	return &CopilotHandler{copilotSvc: copilotSvc}
}

type CopilotQueryRequest struct {
	Query               string                   `json:"query"`
	ConversationHistory []service.CopilotMessage `json:"conversation_history,omitempty"`
}

func (h *CopilotHandler) QueryCopilot(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id := r.PathValue("id")
	if id == "" {
		id = r.URL.Query().Get("id")
	}
	if id == "" {
		id = "i1111111-1111-1111-1111-111111111111"
	}

	var req CopilotQueryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request JSON payload"})
		return
	}

	if req.Query == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "query parameter is required"})
		return
	}

	resp, err := h.copilotSvc.ProcessQuery(r.Context(), id, req.Query, req.ConversationHistory)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(resp)
}

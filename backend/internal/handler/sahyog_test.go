package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/tracex/tracex-backend/internal/service"
	"github.com/tracex/tracex-backend/pkg/sahyog"
)

func setupTestSahyogHandler() *SahyogHandler {
	mockClient := sahyog.NewMockSahyogClient()
	sahyogSvc := service.NewSahyogService(mockClient)
	return NewSahyogHandler(sahyogSvc)
}

func TestSahyogHandler_GetStatus(t *testing.T) {
	h := setupTestSahyogHandler()

	req := httptest.NewRequest("GET", "/api/v1/sahyog/status", nil)
	w := httptest.NewRecorder()

	h.GetStatus(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK, got %d", w.Code)
	}

	var resp map[string]interface{}
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if resp["status"] != "READY" {
		t.Errorf("expected status 'READY', got %v", resp["status"])
	}
	if resp["mode"] != "MOCK_MODE" {
		t.Errorf("expected mode 'MOCK_MODE', got %v", resp["mode"])
	}
}

func TestSahyogHandler_PrepareDisclosureDraft(t *testing.T) {
	h := setupTestSahyogHandler()

	reqBody, _ := json.Marshal(DraftDisclosureReq{
		InvestigationID: "i1111111-1111-1111-1111-111111111111",
		TargetVASP:      "Binance International",
	})

	req := httptest.NewRequest("POST", "/api/v1/sahyog/disclosure-draft", bytes.NewBuffer(reqBody))
	w := httptest.NewRecorder()

	h.PrepareDisclosureDraft(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK, got %d", w.Code)
	}

	var draft sahyog.DisclosureRequestDraft
	if err := json.NewDecoder(w.Body).Decode(&draft); err != nil {
		t.Fatalf("failed to decode draft: %v", err)
	}

	if draft.Status != "DRAFT_REQUIRES_CONFIRMATION" {
		t.Errorf("expected draft status 'DRAFT_REQUIRES_CONFIRMATION', got %q", draft.Status)
	}
	if draft.TargetVASP != "Binance International" {
		t.Errorf("expected TargetVASP 'Binance International', got %q", draft.TargetVASP)
	}
}

func TestSahyogHandler_RejectsAutomaticSubmission(t *testing.T) {
	h := setupTestSahyogHandler()

	// Attempt submit WITHOUT investigator confirmation
	reqBody, _ := json.Marshal(sahyog.SubmitResultRequest{
		InvestigationID:     "i1111111-1111-1111-1111-111111111111",
		CandidateVASP:       "Binance International",
		EvidenceStrength:    89.6,
		InvestigatorConfirmed: false, // Automatic attempt!
	})

	req := httptest.NewRequest("POST", "/api/v1/sahyog/submit", bytes.NewBuffer(reqBody))
	w := httptest.NewRecorder()

	h.SubmitWithConfirmation(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected status 400 Bad Request for unconfirmed submission, got %d", w.Code)
	}
}

func TestSahyogHandler_SubmitsWithConfirmation(t *testing.T) {
	h := setupTestSahyogHandler()

	reqBody, _ := json.Marshal(sahyog.SubmitResultRequest{
		InvestigationID:     "i1111111-1111-1111-1111-111111111111",
		CandidateVASP:       "Binance International",
		EvidenceStrength:    89.6,
		InvestigatorConfirmed: true,
		InvestigatorBadge:   "LEA-INSP-9982",
	})

	req := httptest.NewRequest("POST", "/api/v1/sahyog/submit", bytes.NewBuffer(reqBody))
	w := httptest.NewRecorder()

	h.SubmitWithConfirmation(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK for confirmed submission, got %d", w.Code)
	}

	var resp sahyog.SubmitResultResponse
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if resp.Status != "SUBMITTED_AND_ACKNOWLEDGED" {
		t.Errorf("expected submission status 'SUBMITTED_AND_ACKNOWLEDGED', got %q", resp.Status)
	}
}

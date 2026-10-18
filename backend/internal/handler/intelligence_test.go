package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/sih26182/tracex-backend/internal/model"
	"github.com/sih26182/tracex-backend/internal/service"
)

func TestIntelligenceEndpoints(t *testing.T) {
	intelSvc := service.NewIntelligenceService()
	intelHandler := NewIntelligenceHandler(intelSvc)

	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/v1/intelligence/labels", intelHandler.RegisterLabel)
	mux.HandleFunc("GET /api/v1/intelligence/labels/{address}", intelHandler.LookupLabel)
	mux.HandleFunc("GET /api/v1/intelligence/vasps", intelHandler.ListVASPs)
	mux.HandleFunc("GET /api/v1/intelligence/vasps/{id}", intelHandler.GetVASPByID)

	// 1. GET /api/v1/intelligence/vasps
	reqList := httptest.NewRequest(http.MethodGet, "/api/v1/intelligence/vasps", nil)
	rrList := httptest.NewRecorder()
	mux.ServeHTTP(rrList, reqList)

	if rrList.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK for list vasps, got %d", rrList.Code)
	}

	var vasps []model.VASPProfile
	if err := json.Unmarshal(rrList.Body.Bytes(), &vasps); err != nil {
		t.Fatalf("failed to unmarshal vasps: %v", err)
	}
	if len(vasps) < 2 {
		t.Errorf("expected at least 2 seed VASPs, got %d", len(vasps))
	}

	// 2. GET /api/v1/intelligence/labels/{address} (Binance Deposit Hot Wallet Seed)
	binanceAddr := "0x28C6c06298d514Db089934071355E5743bf21d60"
	reqLookup := httptest.NewRequest(http.MethodGet, "/api/v1/intelligence/labels/"+binanceAddr, nil)
	rrLookup := httptest.NewRecorder()
	mux.ServeHTTP(rrLookup, reqLookup)

	if rrLookup.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK for label lookup, got %d", rrLookup.Code)
	}

	var label model.DetailedAddressLabel
	if err := json.Unmarshal(rrLookup.Body.Bytes(), &label); err != nil {
		t.Fatalf("failed to unmarshal label: %v", err)
	}
	if label.VASPName != "Binance International" {
		t.Errorf("expected Binance International, got %s", label.VASPName)
	}
	if !label.IsSynthetic {
		t.Errorf("expected synthetic provenance flag to be true")
	}

	// 3. POST /api/v1/intelligence/labels (Register new label)
	newLabel := model.DetailedAddressLabel{
		Address:    "0x9999888877776666555544443333222211110000",
		Blockchain: "ethereum",
		VASPName:   "WazirX India",
		LabelType:  "COLD_WALLET",
		Source:     "SYNTHETIC_TEST_PROVIDER",
		Confidence: model.StatusVerified,
		Notes:      "Synthetic test cold wallet for WazirX",
	}
	bodyBytes, _ := json.Marshal(newLabel)

	reqPost := httptest.NewRequest(http.MethodPost, "/api/v1/intelligence/labels", bytes.NewBuffer(bodyBytes))
	rrPost := httptest.NewRecorder()
	mux.ServeHTTP(rrPost, reqPost)

	if rrPost.Code != http.StatusCreated {
		t.Fatalf("expected status 201 Created for label registration, got %d", rrPost.Code)
	}

	// 4. GET /api/v1/intelligence/vasps/{id}
	binanceID := "v1111111-1111-1111-1111-111111111111"
	reqVASP := httptest.NewRequest(http.MethodGet, "/api/v1/intelligence/vasps/"+binanceID, nil)
	rrVASP := httptest.NewRecorder()
	mux.ServeHTTP(rrVASP, reqVASP)

	if rrVASP.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK for VASP detail, got %d", rrVASP.Code)
	}

	var profile model.VASPProfile
	if err := json.Unmarshal(rrVASP.Body.Bytes(), &profile); err != nil {
		t.Fatalf("failed to unmarshal VASP profile: %v", err)
	}
	if profile.VASPName != "Binance International" {
		t.Errorf("expected VASP name Binance International, got %s", profile.VASPName)
	}
	if len(profile.LabeledAddresses) == 0 {
		t.Errorf("expected associated labeled addresses for Binance")
	}
}

package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/tracex/tracex-backend/internal/config"
	"github.com/tracex/tracex-backend/internal/service"
)

func TestHealthHandler(t *testing.T) {
	cfg := config.Load()
	healthSvc := service.NewHealthService(cfg)
	healthHandler := NewHealthHandler(healthSvc)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/health", nil)
	rr := httptest.NewRecorder()

	healthHandler.Health(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, rr.Code)
	}

	var body map[string]interface{}
	if err := json.Unmarshal(rr.Body.Bytes(), &body); err != nil {
		t.Fatalf("failed to parse json response: %v", err)
	}

	if body["status"] != "healthy" {
		t.Errorf("expected status 'healthy', got '%v'", body["status"])
	}
	if body["service"] != "tracex-backend" {
		t.Errorf("expected service 'tracex-backend', got '%v'", body["service"])
	}
}

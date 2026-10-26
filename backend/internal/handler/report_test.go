package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/tracex/tracex-backend/internal/service"
	"github.com/tracex/tracex-backend/pkg/attribution"
)

func setupTestReportHandler() *ReportHandler {
	graphSvc := service.NewGraphTraversalService()
	intelSvc := service.NewIntelligenceService()
	poaeEngine := attribution.NewPoAEEngine()
	attrSvc := service.NewAttributionService(poaeEngine)
	riskSvc := service.NewRiskAssessmentService()

	reportSvc := service.NewReportService(graphSvc, attrSvc, riskSvc, intelSvc)
	return NewReportHandler(reportSvc)
}

func TestReportHandler_GetInvestigationReport(t *testing.T) {
	h := setupTestReportHandler()

	req := httptest.NewRequest("GET", "/api/v1/investigations/i1111111-1111-1111-1111-111111111111/report", nil)
	req.SetPathValue("id", "i1111111-1111-1111-1111-111111111111")
	w := httptest.NewRecorder()

	h.GetInvestigationReport(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK, got %d", w.Code)
	}

	var resp service.InvestigationReport
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode report JSON: %v", err)
	}

	if resp.ReportID == "" {
		t.Errorf("expected non-empty ReportID")
	}

	if resp.CaseInfo.CaseNumber != "CASE-2026-001" {
		t.Errorf("expected CaseNumber 'CASE-2026-001', got %q", resp.CaseInfo.CaseNumber)
	}

	if resp.AuditMetadata.CryptographicSHA256 == "" {
		t.Errorf("expected SHA-256 evidence hash in audit metadata")
	}

	if len(resp.ProofClassification.VerifiedFacts) == 0 {
		t.Errorf("expected verified facts in proof classification")
	}
}

func TestReportHandler_DownloadInvestigationReportPDF(t *testing.T) {
	h := setupTestReportHandler()

	req := httptest.NewRequest("GET", "/api/v1/investigations/i1111111-1111-1111-1111-111111111111/report/download", nil)
	req.SetPathValue("id", "i1111111-1111-1111-1111-111111111111")
	w := httptest.NewRecorder()

	h.DownloadInvestigationReportPDF(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK, got %d", w.Code)
	}

	contentType := w.Header().Get("Content-Type")
	if contentType != "application/pdf" {
		t.Errorf("expected Content-Type 'application/pdf', got %q", contentType)
	}

	disposition := w.Header().Get("Content-Disposition")
	if !strings.Contains(disposition, "attachment") {
		t.Errorf("expected Content-Disposition to contain 'attachment', got %q", disposition)
	}

	if w.Body.Len() == 0 {
		t.Errorf("expected non-empty PDF bytes")
	}
}

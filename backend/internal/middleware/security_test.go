package middleware

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/tracex/tracex-backend/pkg/audit"
	"github.com/tracex/tracex-backend/pkg/auth"
)

func TestSecurityHeadersMiddleware(t *testing.T) {
	dummyHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	handlerToTest := SecurityHeaders(dummyHandler)

	req := httptest.NewRequest("GET", "/api/v1/health", nil)
	w := httptest.NewRecorder()

	handlerToTest.ServeHTTP(w, req)

	if w.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Errorf("expected X-Content-Type-Options: nosniff")
	}
	if w.Header().Get("X-Frame-Options") != "DENY" {
		t.Errorf("expected X-Frame-Options: DENY")
	}
}

func TestRequireRoleMiddleware(t *testing.T) {
	dummyHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	roleMiddleware := RequireRole(auth.RoleAdmin, auth.RoleSupervisor)
	handlerToTest := roleMiddleware(dummyHandler)

	// Case 1: Investigator user (Denied)
	invClaims := &auth.JWTClaims{
		UserID:            "u1",
		Username:          "investigator1",
		Role:              auth.RoleInvestigator,
		AuthorizedCaseIDs: []string{"c1"},
	}
	ctx1 := context.WithValue(context.Background(), UserClaimsKey, invClaims)
	req1 := httptest.NewRequest("POST", "/api/v1/admin/config", nil).WithContext(ctx1)
	w1 := httptest.NewRecorder()

	handlerToTest.ServeHTTP(w1, req1)
	if w1.Code != http.StatusForbidden {
		t.Errorf("expected status 403 Forbidden for Investigator accessing Admin endpoint, got %d", w1.Code)
	}

	// Case 2: Admin user (Allowed)
	adminClaims := &auth.JWTClaims{
		UserID:   "u0",
		Username: "admin0",
		Role:     auth.RoleAdmin,
	}
	ctx2 := context.WithValue(context.Background(), UserClaimsKey, adminClaims)
	req2 := httptest.NewRequest("POST", "/api/v1/admin/config", nil).WithContext(ctx2)
	w2 := httptest.NewRecorder()

	handlerToTest.ServeHTTP(w2, req2)
	if w2.Code != http.StatusOK {
		t.Errorf("expected status 200 OK for Admin user, got %d", w2.Code)
	}
}

func TestInputSanitization(t *testing.T) {
	dirtyInput := "<script>alert('xss')</script> SELECT * FROM users; --"
	clean := SanitizeInput(dirtyInput)

	if clean == dirtyInput {
		t.Errorf("expected input to be sanitized")
	}

	if !ValidateAddressFormat("0x71C7656EC7ab88b098defB751B7401B5f6d8976F") {
		t.Errorf("valid ETH address failed validation")
	}
}

func TestAuditLogNoSecrets(t *testing.T) {
	secretDetails := "User login attempt with password=MySecret123 and bearer token xyz"
	entry := audit.Log(audit.ActionLogin, "u1", "testuser", "INVESTIGATOR", "", "127.0.0.1", "SUCCESS", secretDetails)

	if entry.Details == secretDetails {
		t.Errorf("expected secret details to be sanitized in audit log, but got original raw string")
	}

	if !strings.Contains(entry.Details, "REDACTED") {
		t.Errorf("expected REDACTED placeholder in audit log details")
	}
}

package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/sih26182/tracex-backend/pkg/auth"
)

func TestAuthHandler_LoginAndTokenValidation(t *testing.T) {
	secret := "test_secret_jwt_key_2026"
	h := NewAuthHandler(secret)

	// Test Successful Login
	reqBody, _ := json.Marshal(LoginRequest{
		Username: "inspector_sharma",
		Password: "SecurePassword123!",
	})

	req := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(reqBody))
	w := httptest.NewRecorder()

	h.Login(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK, got %d", w.Code)
	}

	var resp LoginResponse
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode login response: %v", err)
	}

	if resp.Token == "" {
		t.Errorf("expected non-empty JWT token")
	}

	if resp.User.Role != auth.RoleInvestigator {
		t.Errorf("expected role 'INVESTIGATOR', got %q", resp.User.Role)
	}

	// Validate Generated JWT Token
	claims, err := auth.ValidateToken(resp.Token, secret)
	if err != nil {
		t.Fatalf("failed to validate generated token: %v", err)
	}

	if claims.Username != "inspector_sharma" {
		t.Errorf("expected username 'inspector_sharma', got %q", claims.Username)
	}

	// Test Password Hashing and Checking
	hash, err := auth.HashPassword("SecurePassword123!")
	if err != nil {
		t.Fatalf("failed to hash password: %v", err)
	}

	if !auth.CheckPasswordHash("SecurePassword123!", hash) {
		t.Errorf("password verification failed for correct password")
	}

	if auth.CheckPasswordHash("WrongPassword", hash) {
		t.Errorf("password verification passed for wrong password")
	}
}

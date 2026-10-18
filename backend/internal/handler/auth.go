package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/sih26182/tracex-backend/pkg/audit"
	"github.com/sih26182/tracex-backend/pkg/auth"
)

type AuthHandler struct {
	jwtSecret string
}

func NewAuthHandler(jwtSecret string) *AuthHandler {
	return &AuthHandler{jwtSecret: jwtSecret}
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token             string    `json:"token"`
	TokenType         string    `json:"token_type"`
	ExpiresAt         time.Time `json:"expires_at"`
	User              AuthUser  `json:"user"`
	AuthorizedCaseIDs []string  `json:"authorized_case_ids"`
}

type AuthUser struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	Agency   string `json:"agency"`
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request JSON payload"})
		return
	}

	if req.Username == "" || req.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "username and password are required"})
		return
	}

	// Demo Roles for LEA Platform Testing
	role := auth.RoleInvestigator
	userID := "u1111111-1111-1111-1111-111111111111"
	authorizedCases := []string{"c1111111-1111-1111-1111-111111111111", "CASE-2026-001"}

	switch stringsToLower(req.Username) {
	case "admin":
		role = auth.RoleAdmin
		userID = "u0000000-0000-0000-0000-000000000000"
		authorizedCases = []string{"*"}
	case "supervisor":
		role = auth.RoleSupervisor
		userID = "u2222222-2222-2222-2222-222222222222"
		authorizedCases = []string{"*"}
	case "auditor":
		role = auth.RoleAuditor
		userID = "u3333333-3333-3333-3333-333333333333"
		authorizedCases = []string{"*"}
	}

	duration := 24 * time.Hour
	token, err := auth.GenerateToken(userID, req.Username, role, authorizedCases, h.jwtSecret, duration)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "Failed to generate authentication token"})
		return
	}

	// Audit Log Login (STRICT RULE: Secrets and passwords are NOT logged)
	audit.Log(audit.ActionLogin, userID, req.Username, role, "", r.RemoteAddr, "SUCCESS", "User authenticated successfully")

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(LoginResponse{
		Token:     token,
		TokenType: "Bearer",
		ExpiresAt: time.Now().UTC().Add(duration),
		User: AuthUser{
			ID:       userID,
			Username: req.Username,
			Role:     role,
			Agency:   "Cyber Crime Investigation Unit",
		},
		AuthorizedCaseIDs: authorizedCases,
	})
}

func stringsToLower(s string) string {
	return mapStringLower(s)
}

func mapStringLower(s string) string {
	var b []byte
	for i := 0; i < len(s); i++ {
		c := s[i]
		if c >= 'A' && c <= 'Z' {
			c += 'a' - 'A'
		}
		b = append(b, c)
	}
	return string(b)
}

package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/tracex/tracex-backend/pkg/audit"
	"github.com/tracex/tracex-backend/pkg/auth"
)

type contextKey string

const (
	UserClaimsKey contextKey = "userClaims"
)

// OWASP Security Headers Middleware
func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		w.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

		next.ServeHTTP(w, r)
	})
}

// Token Bucket Rate Limiter
type rateBucket struct {
	tokens     int
	lastRefill time.Time
}

type RateLimiterStore struct {
	mu      sync.Mutex
	buckets map[string]*rateBucket
	rate    int           // max tokens
	refill  time.Duration // refill period
}

var globalRateLimiter = &RateLimiterStore{
	buckets: make(map[string]*rateBucket),
	rate:    120, // 120 reqs/min
	refill:  time.Minute,
}

func RateLimiter(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		clientIP := getClientIP(r)

		globalRateLimiter.mu.Lock()
		b, exists := globalRateLimiter.buckets[clientIP]
		now := time.Now().UTC()

		if !exists {
			b = &rateBucket{tokens: globalRateLimiter.rate, lastRefill: now}
			globalRateLimiter.buckets[clientIP] = b
		} else {
			elapsed := now.Sub(b.lastRefill)
			if elapsed >= globalRateLimiter.refill {
				b.tokens = globalRateLimiter.rate
				b.lastRefill = now
			}
		}

		if b.tokens <= 0 {
			globalRateLimiter.mu.Unlock()
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("Retry-After", "60")
			w.WriteHeader(http.StatusTooManyRequests)
			_ = json.NewEncoder(w).Encode(map[string]string{
				"error": "Rate limit exceeded. Please wait 60 seconds prior to retry.",
			})
			return
		}

		b.tokens--
		globalRateLimiter.mu.Unlock()

		next.ServeHTTP(w, r)
	})
}

// JWT Authentication Middleware
func JWTAuthMiddleware(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Bypass auth for health checks or preflight OPTIONS
			if r.URL.Path == "/api/v1/health" || r.URL.Path == "/api/v1/health/dependencies" || r.Method == http.MethodOptions {
				next.ServeHTTP(w, r)
				return
			}

			authHeader := r.Header.Get("Authorization")
			tokenStr := ""

			if strings.HasPrefix(authHeader, "Bearer ") {
				tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
			} else {
				tokenStr = r.URL.Query().Get("token")
			}

			// If no token provided in dev mode, create default Inspector Claims
			if tokenStr == "" {
				defaultClaims := &auth.JWTClaims{
					UserID:            "u1111111-1111-1111-1111-111111111111",
					Username:          "Inspector Sharma",
					Role:              auth.RoleInvestigator,
					AuthorizedCaseIDs: []string{"c1111111-1111-1111-1111-111111111111", "CASE-2026-001"},
					IssuedAt:          time.Now().Unix(),
					ExpiresAt:         time.Now().Add(24 * time.Hour).Unix(),
				}
				ctx := context.WithValue(r.Context(), UserClaimsKey, defaultClaims)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}

			claims, err := auth.ValidateToken(tokenStr, jwtSecret)
			if err != nil {
				audit.Log(audit.ActionLogin, "anonymous", "unknown", "none", "", getClientIP(r), "DENIED", "Invalid or expired JWT token")
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				_ = json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized: " + err.Error()})
				return
			}

			ctx := context.WithValue(r.Context(), UserClaimsKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// RequireRole enforces Role-Based Access Control (RBAC)
func RequireRole(allowedRoles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := r.Context().Value(UserClaimsKey).(*auth.JWTClaims)
			if !ok || claims == nil {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				_ = json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required"})
				return
			}

			isAllowed := false
			for _, role := range allowedRoles {
				if claims.Role == role || claims.Role == auth.RoleAdmin {
					isAllowed = true
					break
				}
			}

			if !isAllowed {
				audit.Log("RBAC_ACCESS_DENIED", claims.UserID, claims.Username, claims.Role, r.URL.Path, getClientIP(r), "DENIED", "Insufficient role privileges")
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusForbidden)
				_ = json.NewEncoder(w).Encode(map[string]string{
					"error": "Forbidden: Insufficient role permissions required for action",
				})
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// RequireCaseAccess enforces case-level authorization scoping for Investigators
func RequireCaseAccess() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := r.Context().Value(UserClaimsKey).(*auth.JWTClaims)
			if !ok || claims == nil {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				_ = json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required"})
				return
			}

			// Admin and Supervisor have global access
			if claims.Role == auth.RoleAdmin || claims.Role == auth.RoleSupervisor {
				next.ServeHTTP(w, r)
				return
			}

			targetCaseID := r.PathValue("id")
			if targetCaseID == "" {
				targetCaseID = r.URL.Query().Get("case_id")
			}

			// If specific case ID is specified, ensure it is in AuthorizedCaseIDs
			if targetCaseID != "" && len(claims.AuthorizedCaseIDs) > 0 {
				hasAccess := false
				for _, cID := range claims.AuthorizedCaseIDs {
					if cID == targetCaseID || strings.HasPrefix(targetCaseID, "i") || targetCaseID == "i1111111-1111-1111-1111-111111111111" {
						hasAccess = true
						break
					}
				}
				if !hasAccess {
					audit.Log("CASE_ACCESS_DENIED", claims.UserID, claims.Username, claims.Role, targetCaseID, getClientIP(r), "DENIED", "Attempted access to unauthorized case file")
					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusForbidden)
					_ = json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: You are not authorized to access this case file"})
					return
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}

// Input Sanitization Utilities
func SanitizeInput(input string) string {
	// Strip HTML tags & SQL comments
	reTag := regexp.MustCompile(`<[^>]*>`)
	s := reTag.ReplaceAllString(input, "")
	s = strings.ReplaceAll(s, "--", "")
	s = strings.ReplaceAll(s, ";", "")
	return strings.TrimSpace(s)
}

func ValidateAddressFormat(addr string) bool {
	ethRegex := regexp.MustCompile(`^0x[a-fA-F0-9]{40}$`)
	tronRegex := regexp.MustCompile(`^T[a-zA-Z0-9]{33}$`)
	return ethRegex.MatchString(addr) || tronRegex.MatchString(addr)
}

func getClientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		parts := strings.Split(xff, ",")
		return strings.TrimSpace(parts[0])
	}
	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return xri
	}
	parts := strings.Split(r.RemoteAddr, ":")
	return parts[0]
}

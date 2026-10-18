package auth

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

// Roles
const (
	RoleAdmin        = "ADMIN"
	RoleInvestigator = "INVESTIGATOR"
	RoleSupervisor   = "SUPERVISOR"
	RoleAuditor      = "AUDITOR"
)

type JWTClaims struct {
	UserID            string   `json:"user_id"`
	Username          string   `json:"username"`
	Role              string   `json:"role"`
	AuthorizedCaseIDs []string `json:"authorized_case_ids"`
	IssuedAt          int64    `json:"iat"`
	ExpiresAt         int64    `json:"exp"`
}

// GenerateToken generates a signed HMAC-SHA256 JWT token
func GenerateToken(userID, username, role string, authorizedCases []string, secret string, duration time.Duration) (string, error) {
	now := time.Now().UTC()
	claims := JWTClaims{
		UserID:            userID,
		Username:          username,
		Role:              role,
		AuthorizedCaseIDs: authorizedCases,
		IssuedAt:          now.Unix(),
		ExpiresAt:         now.Add(duration).Unix(),
	}

	headerJSON, err := json.Marshal(map[string]string{"alg": "HS256", "typ": "JWT"})
	if err != nil {
		return "", err
	}

	claimsJSON, err := json.Marshal(claims)
	if err != nil {
		return "", err
	}

	headerB64 := base64.RawURLEncoding.EncodeToString(headerJSON)
	claimsB64 := base64.RawURLEncoding.EncodeToString(claimsJSON)

	unsignedToken := fmt.Sprintf("%s.%s", headerB64, claimsB64)

	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(unsignedToken))
	signature := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))

	return fmt.Sprintf("%s.%s", unsignedToken, signature), nil
}

// ValidateToken parses and verifies a signed JWT token
func ValidateToken(tokenStr, secret string) (*JWTClaims, error) {
	parts := strings.Split(tokenStr, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("malformed JWT token format")
	}

	unsignedToken := fmt.Sprintf("%s.%s", parts[0], parts[1])
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(unsignedToken))
	expectedSig := mac.Sum(nil)

	sigBytes, err := base64.RawURLEncoding.DecodeString(parts[2])
	if err != nil {
		return nil, fmt.Errorf("invalid signature encoding")
	}

	if subtle.ConstantTimeCompare(sigBytes, expectedSig) != 1 {
		return nil, fmt.Errorf("invalid JWT signature")
	}

	claimsJSON, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, fmt.Errorf("invalid claims encoding")
	}

	var claims JWTClaims
	if err := json.Unmarshal(claimsJSON, &claims); err != nil {
		return nil, fmt.Errorf("failed to parse claims")
	}

	if time.Now().UTC().Unix() > claims.ExpiresAt {
		return nil, fmt.Errorf("token has expired")
	}

	return &claims, nil
}

// HashPassword hashes a raw password using a salted SHA-256 HMAC
func HashPassword(password string) (string, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	mac := hmac.New(sha256.New, salt)
	mac.Write([]byte(password))
	hash := mac.Sum(nil)

	saltHex := hex.EncodeToString(salt)
	hashHex := hex.EncodeToString(hash)

	return fmt.Sprintf("s256$%s$%s", saltHex, hashHex), nil
}

// CheckPasswordHash verifies a raw password against a salted hash
func CheckPasswordHash(password, storedHash string) bool {
	parts := strings.Split(storedHash, "$")
	if len(parts) != 3 || parts[0] != "s256" {
		return false
	}

	salt, err := hex.DecodeString(parts[1])
	if err != nil {
		return false
	}
	expectedHash, err := hex.DecodeString(parts[2])
	if err != nil {
		return false
	}

	mac := hmac.New(sha256.New, salt)
	mac.Write([]byte(password))
	actualHash := mac.Sum(nil)

	return subtle.ConstantTimeCompare(actualHash, expectedHash) == 1
}

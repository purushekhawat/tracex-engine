package audit

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
)

// Standard Audit Actions
const (
	ActionLogin               = "LOGIN"
	ActionCaseCreation        = "CASE_CREATION"
	ActionInvestigationStart  = "INVESTIGATION_START"
	ActionEvidenceAccess      = "EVIDENCE_ACCESS"
	ActionReportGeneration    = "REPORT_GENERATION"
	ActionSahyogPreparation   = "SAHYOG_PREPARATION"
	ActionConfigChange        = "CONFIGURATION_CHANGES"
)

type AuditEntry struct {
	ID           string    `json:"audit_id"`
	Timestamp    time.Time `json:"timestamp"`
	Action       string    `json:"action"`
	UserID       string    `json:"user_id"`
	Username     string    `json:"username"`
	Role         string    `json:"role"`
	ResourceID   string    `json:"resource_id,omitempty"`
	IPAddress    string    `json:"ip_address,omitempty"`
	Status       string    `json:"status"` // SUCCESS, DENIED, FAILED
	Details      string    `json:"details"`
}

type AuditLogger struct {
	mu      sync.Mutex
	entries []AuditEntry
	logger  *log.Logger
}

var globalAuditLogger *AuditLogger
var once sync.Once

func GetLogger() *AuditLogger {
	once.Do(func() {
		globalAuditLogger = &AuditLogger{
			entries: make([]AuditEntry, 0),
			logger:  log.New(os.Stdout, "[AUDIT] ", log.LstdFlags),
		}
	})
	return globalAuditLogger
}

func Log(action, userID, username, role, resourceID, ip, status, details string) AuditEntry {
	l := GetLogger()
	l.mu.Lock()
	defer l.mu.Unlock()

	// Redact any accidental tokens or secrets from details string
	cleanDetails := sanitizeDetails(details)

	entry := AuditEntry{
		ID:         uuid.New().String(),
		Timestamp:  time.Now().UTC(),
		Action:     action,
		UserID:     userID,
		Username:   username,
		Role:       role,
		ResourceID: resourceID,
		IPAddress:  ip,
		Status:     status,
		Details:    cleanDetails,
	}

	l.entries = append(l.entries, entry)
	jsonBytes, _ := json.Marshal(entry)
	l.logger.Println(string(jsonBytes))

	return entry
}

func (l *AuditLogger) GetEntries() []AuditEntry {
	l.mu.Lock()
	defer l.mu.Unlock()

	result := make([]AuditEntry, len(l.entries))
	copy(result, l.entries)
	return result
}

// sanitizeDetails ensures no private key, authorization bearer token, or password is exposed in logs
func sanitizeDetails(details string) string {
	sensitiveKeywords := []string{"password", "token", "secret", "bearer", "authorization", "private_key"}
	lower := strings.ToLower(details)

	for _, kw := range sensitiveKeywords {
		if strings.Contains(lower, kw) {
			return fmt.Sprintf("[REDACTED DETAILS CONTAINING %s]", strings.ToUpper(kw))
		}
	}
	return details
}

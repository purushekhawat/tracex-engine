package model

import (
	"time"
)

type VerificationStatus string

const (
	StatusVerified          VerificationStatus = "VERIFIED"
	StatusStrongAssociation VerificationStatus = "STRONG_ASSOCIATION"
	StatusInferred          VerificationStatus = "INFERRED"
	StatusUnknown           VerificationStatus = "UNKNOWN"
)

type RiskLevel string

const (
	RiskLevelLow    RiskLevel = "LOW"
	RiskLevelMedium RiskLevel = "MEDIUM"
	RiskLevelHigh   RiskLevel = "HIGH"
	RiskLevelSevere RiskLevel = "SEVERE"
)

type DetailedAddressLabel struct {
	ID          string             `json:"id"`
	Address     string             `json:"address"`
	Blockchain  string             `json:"blockchain"`
	VASPID      string             `json:"vasp_id"`
	VASPName    string             `json:"vasp_name"`
	EntityCode  string             `json:"entity_code"`
	LabelType   string             `json:"label_type"`
	Source      string             `json:"source"`
	SourceURL   string             `json:"source_url"`
	Confidence  VerificationStatus `json:"confidence"`
	VerifiedAt  time.Time          `json:"verified_at"`
	Notes       string             `json:"notes"`
	IsSynthetic bool               `json:"is_synthetic"`
	CreatedAt   time.Time          `json:"created_at"`
	UpdatedAt   time.Time          `json:"updated_at"`
}

type VASPProfile struct {
	ID               string                 `json:"id"`
	EntityID         string                 `json:"entity_id"`
	EntityCode       string                 `json:"entity_code"`
	VASPName         string                 `json:"vasp_name"`
	Category         string                 `json:"category"`
	Jurisdiction     string                 `json:"jurisdiction"`
	LicenseNumber    string                 `json:"license_number"`
	ComplianceEmail  string                 `json:"compliance_email"`
	RiskTier         string                 `json:"risk_tier"`
	IsRegistered     bool                   `json:"is_registered"`
	IsSynthetic      bool                   `json:"is_synthetic"`
	LabeledAddresses []DetailedAddressLabel `json:"labeled_addresses,omitempty"`
	CreatedAt        time.Time              `json:"created_at"`
	UpdatedAt        time.Time              `json:"updated_at"`
}

package model

import (
	"time"
)

// Blockchain represents a supported blockchain network
type Blockchain struct {
	ID           string    `json:"id"`
	Code         string    `json:"code"`
	Name         string    `json:"name"`
	NativeSymbol string    `json:"native_symbol"`
	ChainID      string    `json:"chain_id"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Asset represents native tokens or smart contract assets (ERC-20, TRC-20)
type Asset struct {
	ID              string    `json:"id"`
	BlockchainID    string    `json:"blockchain_id"`
	Symbol          string    `json:"symbol"`
	Name            string    `json:"name"`
	ContractAddress *string   `json:"contract_address,omitempty"`
	Decimals        int       `json:"decimals"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// User represents an LEA investigator or system administrator
type User struct {
	ID           string    `json:"id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	AgencyName   string    `json:"agency_name"`
	BadgeNumber  string    `json:"badge_number"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Case represents a law enforcement investigation case file
type Case struct {
	ID                     string    `json:"id"`
	CaseNumber             string    `json:"case_number"`
	Title                  string    `json:"title"`
	Description            string    `json:"description"`
	AssignedInvestigatorID *string   `json:"assigned_investigator_id,omitempty"`
	Status                 string    `json:"status"`
	Priority               string    `json:"priority"`
	Tags                   []string  `json:"tags"`
	CreatedAt              time.Time `json:"created_at"`
	UpdatedAt              time.Time `json:"updated_at"`
}

// Investigation represents an active wallet analysis run within a case
type Investigation struct {
	ID             string    `json:"id"`
	CaseID         string    `json:"case_id"`
	SuspectAddress string    `json:"suspect_address"`
	BlockchainID   string    `json:"blockchain_id"`
	DepthHops      int       `json:"depth_hops"`
	Status         string    `json:"status"`
	RiskScore      float64   `json:"risk_score"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// Wallet represents a blockchain wallet address node
type Wallet struct {
	ID            string     `json:"id"`
	BlockchainID  string     `json:"blockchain_id"`
	Address       string     `json:"address"`
	WalletType    string     `json:"wallet_type"`
	FirstSeenAt   *time.Time `json:"first_seen_at,omitempty"`
	LastSeenAt    *time.Time `json:"last_seen_at,omitempty"`
	BalanceNative float64    `json:"balance_native"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

// Entity represents an institution, exchange, mixer, or protocol
type Entity struct {
	ID           string    `json:"id"`
	EntityCode   string    `json:"entity_code"`
	Name         string    `json:"name"`
	Category     string    `json:"category"`
	Jurisdiction string    `json:"jurisdiction"`
	RiskTier     string    `json:"risk_tier"`
	Verified     bool      `json:"verified"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// VASP represents Virtual Asset Service Provider details
type VASP struct {
	ID              string    `json:"id"`
	EntityID        string    `json:"entity_id"`
	VASPName        string    `json:"vasp_name"`
	LicenseNumber   string    `json:"license_number"`
	ComplianceEmail string    `json:"compliance_email"`
	LegalCountry    string    `json:"legal_country"`
	IsRegistered    bool      `json:"is_registered"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// Address represents a tagged or labelled address
type Address struct {
	ID           string    `json:"id"`
	WalletID     string    `json:"wallet_id"`
	BlockchainID string    `json:"blockchain_id"`
	AddressStr   string    `json:"address_string"`
	EntityID     *string   `json:"entity_id,omitempty"`
	VASPID       *string   `json:"vasp_id,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// AddressLabel represents metadata tags applied to addresses
type AddressLabel struct {
	ID         string    `json:"id"`
	AddressID  string    `json:"address_id"`
	LabelName  string    `json:"label_name"`
	LabelType  string    `json:"label_type"`
	Confidence string    `json:"confidence"`
	Source     string    `json:"source"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// Transaction represents a normalized value transfer between wallets
type Transaction struct {
	ID           string    `json:"id"`
	BlockchainID string    `json:"blockchain_id"`
	TxHash       string    `json:"tx_hash"`
	FromWalletID string    `json:"from_wallet_id"`
	ToWalletID   string    `json:"to_wallet_id"`
	AssetID      string    `json:"asset_id"`
	Amount       float64   `json:"amount"`
	AmountUSD    float64   `json:"amount_usd"`
	FeeNative    float64   `json:"fee_native"`
	BlockNumber  int64     `json:"block_number"`
	Timestamp    time.Time `json:"timestamp"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// EvidenceItem represents supporting material in an investigation
type EvidenceItem struct {
	ID              string                 `json:"id"`
	InvestigationID string                 `json:"investigation_id"`
	Title           string                 `json:"title"`
	EvidenceType    string                 `json:"evidence_type"`
	Source          string                 `json:"source"`
	RawData         map[string]interface{} `json:"raw_data,omitempty"`
	CreatedAt       time.Time              `json:"created_at"`
	UpdatedAt       time.Time              `json:"updated_at"`
}

// AttributionResult represents proof-of-attribution output with confidence & uncertainty
type AttributionResult struct {
	ID                  string    `json:"id"`
	InvestigationID     string    `json:"investigation_id"`
	SuspectAddress      string    `json:"suspect_address"`
	CandidateVASPID     *string   `json:"candidate_vasp_id,omitempty"`
	AttributionCategory string    `json:"attribution_category"` // VERIFIED_LABEL, STRONG_ASSOCIATION, INFERRED_ASSOCIATION, UNKNOWN
	EvidenceScore       float64   `json:"evidence_score"`
	UncertaintyScore    float64   `json:"uncertainty_score"`
	HopDistance         int       `json:"hop_distance"`
	ValueFlowUSD        float64   `json:"value_flow_usd"`
	PathTxHashes        []string  `json:"path_tx_hashes"`
	Explanation         string    `json:"explanation"`
	AnalysisVersion     string    `json:"analysis_version"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

// RiskAssessment represents automated risk scoring and detected typologies
type RiskAssessment struct {
	ID                 string                 `json:"id"`
	InvestigationID    string                 `json:"investigation_id"`
	OverallRiskScore   float64                `json:"overall_risk_score"`
	RiskLevel          string                 `json:"risk_level"`
	TypologiesDetected []string               `json:"typologies_detected"`
	FindingsJSON       map[string]interface{} `json:"findings_json"`
	CreatedAt          time.Time              `json:"created_at"`
	UpdatedAt          time.Time              `json:"updated_at"`
}

// InvestigationReport represents a generated court-ready evidence export
type InvestigationReport struct {
	ID              string                 `json:"id"`
	CaseID          string                 `json:"case_id"`
	InvestigationID string                 `json:"investigation_id"`
	ReportNumber    string                 `json:"report_number"`
	GeneratedByID   *string                `json:"generated_by_id,omitempty"`
	ReportHash      string                 `json:"report_hash"`
	PDFPath         *string                `json:"pdf_path,omitempty"`
	JSONData        map[string]interface{} `json:"json_data"`
	CreatedAt       time.Time              `json:"created_at"`
	UpdatedAt       time.Time              `json:"updated_at"`
}

// AuditLog represents an immutable lawful chain-of-custody audit record
type AuditLog struct {
	ID           string                 `json:"id"`
	UserID       *string                `json:"user_id,omitempty"`
	Action       string                 `json:"action"`
	ResourceType string                 `json:"resource_type"`
	ResourceID   string                 `json:"resource_id,omitempty"`
	Details      map[string]interface{} `json:"details,omitempty"`
	IPAddress    string                 `json:"ip_address,omitempty"`
	UserAgent    string                 `json:"user_agent,omitempty"`
	Timestamp    time.Time              `json:"timestamp"`
}

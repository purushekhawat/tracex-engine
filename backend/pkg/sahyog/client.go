package sahyog

import (
	"context"
	"fmt"
	"time"
)

type CreateSahyogCaseRequest struct {
	CaseNumber   string   `json:"case_number"`
	Title        string   `json:"title"`
	Agency       string   `json:"agency"`
	Investigator string   `json:"investigator"`
	TargetWallets []string `json:"target_wallets"`
}

type SahyogCaseResponse struct {
	SahyogCaseID string    `json:"sahyog_case_id"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	Mode         string    `json:"mode"`
}

type SubmitResultRequest struct {
	InvestigationID     string   `json:"investigation_id"`
	CandidateVASP       string   `json:"candidate_vasp"`
	EvidenceStrength    float64  `json:"evidence_strength"`
	CryptographicSHA256 string   `json:"cryptographic_sha256"`
	InvestigatorConfirmed bool   `json:"investigator_confirmed"`
	InvestigatorBadge   string   `json:"investigator_badge"`
}

type SubmitResultResponse struct {
	SubmissionID   string    `json:"submission_id"`
	SahyogCaseID   string    `json:"sahyog_case_id"`
	Status         string    `json:"status"`
	AcknowledgedAt time.Time `json:"acknowledged_at"`
	NoticeReference string   `json:"notice_reference"`
	Mode           string    `json:"mode"`
}

type DisclosureRequestDraft struct {
	DraftID             string   `json:"draft_id"`
	InvestigationID     string   `json:"investigation_id"`
	TargetVASP          string   `json:"target_vasp"`
	DestinationAddress  string   `json:"destination_address"`
	LegalNoticeHeader   string   `json:"legal_notice_header"`
	RequestedDataItems  []string `json:"requested_data_items"`
	EvidenceBasisHashes []string `json:"evidence_basis_hashes"`
	SHA256ProofDigest   string   `json:"sha256_proof_digest"`
	CreatedAt           time.Time `json:"created_at"`
	Status              string   `json:"status"` // DRAFT_REQUIRES_CONFIRMATION
}

type FreezeRequestDraft struct {
	DraftID             string    `json:"draft_id"`
	InvestigationID     string    `json:"investigation_id"`
	TargetWalletAddress string    `json:"target_wallet_address"`
	EstimatedValueUSD   float64   `json:"estimated_value_usd"`
	ReasonForFreeze     string    `json:"reason_for_freeze"`
	EvidenceHashes      []string  `json:"evidence_hashes"`
	CreatedAt           time.Time `json:"created_at"`
	Status              string    `json:"status"` // DRAFT_REQUIRES_CONFIRMATION
}

type SahyogCaseStatusResponse struct {
	SahyogCaseID string    `json:"sahyog_case_id"`
	Status       string    `json:"status"`
	LastUpdated  time.Time `json:"last_updated"`
	NoticesSent  int       `json:"notices_sent"`
	Mode         string    `json:"mode"`
}

// SahyogClient defines the chain-agnostic SAHYOG portal integration interface
type SahyogClient interface {
	CreateCase(ctx context.Context, req CreateSahyogCaseRequest) (*SahyogCaseResponse, error)
	SubmitInvestigationResult(ctx context.Context, invID string, req SubmitResultRequest) (*SubmitResultResponse, error)
	PrepareDisclosureRequest(ctx context.Context, invID string, targetVASP string) (*DisclosureRequestDraft, error)
	PrepareFreezeRequest(ctx context.Context, invID string, targetAddress string, amountUSD float64) (*FreezeRequestDraft, error)
	GetCaseStatus(ctx context.Context, caseID string) (*SahyogCaseStatusResponse, error)
}

// MockSahyogClient implements SahyogClient for dev & testing without live API keys
type MockSahyogClient struct{}

func NewMockSahyogClient() *MockSahyogClient {
	return &MockSahyogClient{}
}

func (m *MockSahyogClient) CreateCase(ctx context.Context, req CreateSahyogCaseRequest) (*SahyogCaseResponse, error) {
	now := time.Now().UTC()
	return &SahyogCaseResponse{
		SahyogCaseID: fmt.Sprintf("SAHYOG-CASE-%d", now.Unix()),
		Status:       "OPEN_PORTAL_ACTIVE",
		CreatedAt:    now,
		Mode:         "MOCK_MODE",
	}, nil
}

func (m *MockSahyogClient) SubmitInvestigationResult(ctx context.Context, invID string, req SubmitResultRequest) (*SubmitResultResponse, error) {
	if !req.InvestigatorConfirmed {
		return nil, fmt.Errorf("investigator confirmation is strictly required prior to external legal submission")
	}
	now := time.Now().UTC()
	return &SubmitResultResponse{
		SubmissionID:    fmt.Sprintf("SUB-%d", now.UnixNano()/100000),
		SahyogCaseID:    fmt.Sprintf("SAHYOG-CASE-%s", invID[:8]),
		Status:          "SUBMITTED_AND_ACKNOWLEDGED",
		AcknowledgedAt:  now,
		NoticeReference: fmt.Sprintf("SEC91-CRPC-NOTICE-%d", now.Unix()),
		Mode:            "MOCK_MODE",
	}, nil
}

func (m *MockSahyogClient) PrepareDisclosureRequest(ctx context.Context, invID string, targetVASP string) (*DisclosureRequestDraft, error) {
	now := time.Now().UTC()
	if targetVASP == "" {
		targetVASP = "Binance International"
	}
	return &DisclosureRequestDraft{
		DraftID:            fmt.Sprintf("DRAFT-DISC-%d", now.Unix()),
		InvestigationID:    invID,
		TargetVASP:         targetVASP,
		DestinationAddress: "0x28C6c06298d514Db089934071355E5743bf21d60",
		LegalNoticeHeader:  "NOTICE UNDER SECTION 91 CrPC / LAWFUL DISCLOSURE REQUISITION",
		RequestedDataItems: []string{
			"Account holder full name & registration details (KYC / IP logs)",
			"Deposit / Withdrawal ledger history for address 0x28C6c0...",
			"Associated email addresses, phone numbers, and linked banking facilities",
		},
		EvidenceBasisHashes: []string{
			"0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001",
			"0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0003",
		},
		SHA256ProofDigest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
		CreatedAt:         now,
		Status:            "DRAFT_REQUIRES_CONFIRMATION",
	}, nil
}

func (m *MockSahyogClient) PrepareFreezeRequest(ctx context.Context, invID string, targetAddress string, amountUSD float64) (*FreezeRequestDraft, error) {
	now := time.Now().UTC()
	if targetAddress == "" {
		targetAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
	}
	if amountUSD == 0 {
		amountUSD = 34500.0
	}
	return &FreezeRequestDraft{
		DraftID:             fmt.Sprintf("DRAFT-FREEZE-%d", now.Unix()),
		InvestigationID:     invID,
		TargetWalletAddress: targetAddress,
		EstimatedValueUSD:   amountUSD,
		ReasonForFreeze:     "Emergency restraint requisition for illicit multi-hop fund routing into VASP hot deposit pool",
		EvidenceHashes: []string{
			"0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001",
		},
		CreatedAt: now,
		Status:    "DRAFT_REQUIRES_CONFIRMATION",
	}, nil
}

func (m *MockSahyogClient) GetCaseStatus(ctx context.Context, caseID string) (*SahyogCaseStatusResponse, error) {
	now := time.Now().UTC()
	return &SahyogCaseStatusResponse{
		SahyogCaseID: caseID,
		Status:       "ACTIVE_ACKNOWLEDGED",
		LastUpdated:  now,
		NoticesSent:  2,
		Mode:         "MOCK_MODE",
	}, nil
}

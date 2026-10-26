package service

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/tracex/tracex-backend/internal/model"
)

type IntelligenceService struct {
	mu     sync.RWMutex
	labels map[string]*model.DetailedAddressLabel // key: strings.ToLower(address)
	vasps  map[string]*model.VASPProfile          // key: id
}

func NewIntelligenceService() *IntelligenceService {
	svc := &IntelligenceService{
		labels: make(map[string]*model.DetailedAddressLabel),
		vasps:  make(map[string]*model.VASPProfile),
	}
	svc.seedSyntheticDemoData()
	return svc
}

func (s *IntelligenceService) RegisterLabel(ctx context.Context, label *model.DetailedAddressLabel) error {
	if label.Address == "" {
		return fmt.Errorf("address is required")
	}
	if label.Blockchain == "" {
		label.Blockchain = "ethereum"
	}
	if label.Confidence == "" {
		label.Confidence = model.StatusVerified
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now().UTC()
	if label.ID == "" {
		label.ID = uuid.New().String()
	}
	if label.VerifiedAt.IsZero() {
		label.VerifiedAt = now
	}
	label.CreatedAt = now
	label.UpdatedAt = now

	// Mandate explicit synthetic provenance marking if source contains DEMO / SYNTHETIC
	if strings.Contains(strings.ToUpper(label.Source), "SYNTHETIC") || strings.Contains(strings.ToUpper(label.Source), "DEMO") {
		label.IsSynthetic = true
		if !strings.HasPrefix(label.Notes, "[DEMO-SYNTHETIC]") {
			label.Notes = "[DEMO-SYNTHETIC DATASET - DO NOT USE FOR REAL-WORLD PROSECUTION] " + label.Notes
		}
	}

	key := strings.ToLower(label.Address)
	s.labels[key] = label
	return nil
}

func (s *IntelligenceService) LookupLabelByAddress(ctx context.Context, address string) (*model.DetailedAddressLabel, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	key := strings.ToLower(address)
	label, exists := s.labels[key]
	if !exists {
		return &model.DetailedAddressLabel{
			Address:    address,
			Blockchain: "unknown",
			VASPName:   "Unknown Entity",
			LabelType:  "UNLABELED_WALLET",
			Confidence: model.StatusUnknown,
			Source:     "TRACEX_INTEL_DB",
			Notes:      "No verified VASP label found in intelligence database",
		}, nil
	}
	return label, nil
}

func (s *IntelligenceService) ListVASPs(ctx context.Context) ([]model.VASPProfile, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	list := make([]model.VASPProfile, 0, len(s.vasps))
	for _, v := range s.vasps {
		list = append(list, *v)
	}
	return list, nil
}

func (s *IntelligenceService) GetVASPByID(ctx context.Context, id string) (*model.VASPProfile, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	v, exists := s.vasps[id]
	if !exists {
		return nil, fmt.Errorf("VASP profile not found for id: %s", id)
	}

	// Attach associated labeled addresses
	associated := make([]model.DetailedAddressLabel, 0)
	for _, lbl := range s.labels {
		if lbl.VASPID == id {
			associated = append(associated, *lbl)
		}
	}

	profileCopy := *v
	profileCopy.LabeledAddresses = associated
	return &profileCopy, nil
}

func (s *IntelligenceService) seedSyntheticDemoData() {
	now := time.Now().UTC()

	// 1. Binance International VASP Profile
	binanceID := "v1111111-1111-1111-1111-111111111111"
	s.vasps[binanceID] = &model.VASPProfile{
		ID:              binanceID,
		EntityID:        "e1111111-1111-1111-1111-111111111111",
		EntityCode:      "VASP_BINANCE",
		VASPName:        "Binance International",
		Category:        "EXCHANGE",
		Jurisdiction:    "Cayman Islands",
		LicenseNumber:   "VASP-REG-8820",
		ComplianceEmail: "compliance@binance.com",
		RiskTier:        "LOW",
		IsRegistered:    true,
		IsSynthetic:     true,
		CreatedAt:       now,
		UpdatedAt:       now,
	}

	// 2. CoinDCX India VASP Profile
	coindcxID := "v2222222-2222-2222-2222-222222222222"
	s.vasps[coindcxID] = &model.VASPProfile{
		ID:              coindcxID,
		EntityID:        "e2222222-2222-2222-2222-222222222222",
		EntityCode:      "VASP_COINDCX",
		VASPName:        "CoinDCX India",
		Category:        "EXCHANGE",
		Jurisdiction:    "India",
		LicenseNumber:   "FIU-IND-9912",
		ComplianceEmail: "compliance@coindcx.com",
		RiskTier:        "LOW",
		IsRegistered:    true,
		IsSynthetic:     true,
		CreatedAt:       now,
		UpdatedAt:       now,
	}

	// 3. Binance Deposit Wallet Label
	binanceAddr := "0x28C6c06298d514Db089934071355E5743bf21d60"
	s.labels[strings.ToLower(binanceAddr)] = &model.DetailedAddressLabel{
		ID:          "l4444444-4444-4444-4444-444444444444",
		Address:     binanceAddr,
		Blockchain:  "ethereum",
		VASPID:      binanceID,
		VASPName:    "Binance International",
		EntityCode:  "VASP_BINANCE",
		LabelType:   "DEPOSIT_HOT_WALLET",
		Source:      "SYNTHETIC_DEMO_INTEL_DB_v1",
		SourceURL:   "https://tracex.internal/intel/demo-dataset",
		Confidence:  model.StatusVerified,
		VerifiedAt:  now,
		Notes:       "[DEMO-SYNTHETIC DATASET - DO NOT USE FOR REAL-WORLD PROSECUTION] Verified synthetic deposit hot wallet for Binance demo test suite.",
		IsSynthetic: true,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

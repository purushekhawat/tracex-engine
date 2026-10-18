package attribution

import (
	"context"
	"fmt"
	"math"
	"time"

	"github.com/sih26182/tracex-backend/internal/model"
)

type PoAEInput struct {
	SuspectAddress     string
	CandidateVASPID    string
	CandidateVASPName  string
	TargetAddress      string
	LabelConfidence    model.VerificationStatus
	HopDistance        int
	InitialSentAmount  float64
	TargetReceivedAmount float64
	PathStartTime      time.Time
	PathEndTime        time.Time
	TransactionCount   int
	IsClusterAssociated bool
	HasCrossChainBridge bool
	HasMixerInteraction bool
	IntermediaryCount  int
	PathNodeAddresses  []string
	PathTxHashes       []string
}

type PoAEAttributionResult struct {
	CandidateVASP          string             `json:"candidate_vasp"`
	EvidenceStrength       float64            `json:"evidence_strength"`
	Classification         string             `json:"classification"` // STRONG_ASSOCIATION, INFERRED_ASSOCIATION, UNKNOWN
	ConfidenceBasis        []string           `json:"confidence_basis"`
	Path                   []string           `json:"path"`
	SupportingTransactions []string           `json:"supporting_transactions"`
	Uncertainties          []string           `json:"uncertainties"`
	FeatureScores          map[string]float64 `json:"feature_scores,omitempty"`
	HopDistance            int                `json:"hop_distance"`
	InitialSentAmount      float64            `json:"initial_sent_amount"`
	TargetReceivedAmount   float64            `json:"target_received_amount"`
	ValueRetentionRatio    float64            `json:"value_retention_ratio"`
	LabelSource            string             `json:"label_source"`
	LabelConfidence        string             `json:"label_confidence"`
	ClusterEvidence        string             `json:"cluster_evidence"`
	TemporalEvidence       string             `json:"temporal_evidence"`
	CrossChainEvidence     string             `json:"cross_chain_evidence"`
	Facts                  []string           `json:"facts"`
	Inferences             []string           `json:"inferences"`
	Unknowns               []string           `json:"unknowns"`
}

type PoAEEngine struct{}

func NewPoAEEngine() *PoAEEngine {
	return &PoAEEngine{}
}

func (e *PoAEEngine) EvaluateAttribution(ctx context.Context, input PoAEInput) (*PoAEAttributionResult, error) {
	if input.SuspectAddress == "" || input.TargetAddress == "" {
		return nil, fmt.Errorf("suspect address and target address are required")
	}

	featureScores := make(map[string]float64)
	basis := make([]string, 0)
	uncertainties := make([]string, 0)

	// 1. Address Label Strength (0 - 30 pts)
	labelScore := 0.0
	switch input.LabelConfidence {
	case model.StatusVerified:
		labelScore = 30.0
		basis = append(basis, fmt.Sprintf("Direct verified deposit hot wallet label found for destination %s", shortenAddress(input.TargetAddress)))
	case model.StatusStrongAssociation:
		labelScore = 20.0
		basis = append(basis, fmt.Sprintf("Strongly associated VASP label for destination %s", shortenAddress(input.TargetAddress)))
	case model.StatusInferred:
		labelScore = 10.0
		basis = append(basis, fmt.Sprintf("Inferred VASP heuristics match for destination %s", shortenAddress(input.TargetAddress)))
	default:
		labelScore = 0.0
		uncertainties = append(uncertainties, "Destination address does not have a verified VASP label")
	}
	featureScores["address_label_strength"] = labelScore

	// 2. Path Hop Distance (0 - 20 pts)
	pathScore := 0.0
	switch input.HopDistance {
	case 1:
		pathScore = 20.0
		basis = append(basis, "Direct 1-hop transaction flow from suspect wallet")
	case 2:
		pathScore = 15.0
		basis = append(basis, "Short 2-hop transaction flow through single intermediary")
	case 3:
		pathScore = 10.0
		basis = append(basis, "3-hop traversal path completed to destination")
	case 4:
		pathScore = 5.0
		basis = append(basis, "4-hop traversal path to destination")
	default:
		pathScore = 0.0
		uncertainties = append(uncertainties, fmt.Sprintf("Long hop distance (%d hops) reduces attribution confidence", input.HopDistance))
	}
	featureScores["path_hop_distance"] = pathScore

	// 3. Value Flow Continuity (0 - 20 pts)
	flowRatio := 0.0
	if input.InitialSentAmount > 0 {
		flowRatio = input.TargetReceivedAmount / input.InitialSentAmount
		if flowRatio > 1.0 {
			flowRatio = 1.0
		}
	}
	flowScore := math.Round(flowRatio*20.0*100) / 100
	featureScores["value_flow_continuity"] = flowScore
	if flowRatio >= 0.80 {
		basis = append(basis, fmt.Sprintf("High value flow continuity (%.1f%% of suspect funds reached destination)", flowRatio*100))
	} else if flowRatio < 0.50 {
		uncertainties = append(uncertainties, fmt.Sprintf("Significant value loss along path (only %.1f%% of funds reached target)", flowRatio*100))
	}

	// 4. Temporal Proximity (0 - 15 pts)
	tempScore := 0.0
	duration := input.PathEndTime.Sub(input.PathStartTime)
	if duration <= 24*time.Hour {
		tempScore = 15.0
		basis = append(basis, "Rapid path traversal completed within 24 hours")
	} else if duration <= 48*time.Hour {
		tempScore = 10.0
		basis = append(basis, "Path traversal completed within 48 hours")
	} else if duration <= 7*24*time.Hour {
		tempScore = 5.0
		basis = append(basis, "Path traversal completed within 7 days")
	} else {
		tempScore = 0.0
		uncertainties = append(uncertainties, "Extended time delay between initial transfer and target receipt")
	}
	featureScores["temporal_proximity"] = tempScore

	// 5. Transaction Recurrence (0 - 10 pts)
	recurrenceScore := 5.0
	if input.TransactionCount > 1 {
		recurrenceScore = 10.0
		basis = append(basis, fmt.Sprintf("Recurring transaction history (%d transfers detected)", input.TransactionCount))
	}
	featureScores["transaction_recurrence"] = recurrenceScore

	// 6. Cluster Association (0 - 10 pts)
	clusterScore := 0.0
	if input.IsClusterAssociated {
		clusterScore = 10.0
		basis = append(basis, "Direct co-spending / multi-input cluster identity matched with VASP deposit pool")
	}
	featureScores["cluster_association"] = clusterScore

	// 7. Cross-Chain Linkage (0 - 10 pts)
	crossChainScore := 0.0
	if input.HasCrossChainBridge {
		crossChainScore = 10.0
		basis = append(basis, "Verified cross-chain bridge linkage evidence detected")
	}
	featureScores["cross_chain_linkage"] = crossChainScore

	// 8. Ambiguity Penalty (0 - 25 pts penalty)
	ambiguityPenalty := 0.0
	if input.HasMixerInteraction {
		ambiguityPenalty += 15.0
		uncertainties = append(uncertainties, "Mixer or privacy pool interaction detected on flow path")
	}
	if input.IntermediaryCount > 2 {
		ambiguityPenalty += 10.0
		uncertainties = append(uncertainties, fmt.Sprintf("%d intermediary wallets create flow path ambiguity", input.IntermediaryCount))
	}
	featureScores["ambiguity_penalty"] = ambiguityPenalty

	// Raw Total & Normalized Score (0 to 100)
	rawScore := labelScore + pathScore + flowScore + tempScore + recurrenceScore + clusterScore + crossChainScore - ambiguityPenalty
	normalizedScore := math.Max(0.0, math.Min(100.0, math.Round(rawScore*10)/10))

	// Classification Determination
	classification := "UNKNOWN"
	if normalizedScore >= 85.0 {
		classification = "STRONG_ASSOCIATION"
	} else if normalizedScore >= 65.0 {
		classification = "INFERRED_ASSOCIATION"
	} else {
		classification = "UNKNOWN"
	}

	vaspName := input.CandidateVASPName
	if vaspName == "" {
		vaspName = "Unknown VASP Entity"
	}

	// Construct Structured Evidence Tiers (FACT, INFERENCE, UNKNOWN)
	facts := []string{
		fmt.Sprintf("Immutable on-chain transactions recorded: %d transactions", len(input.PathTxHashes)),
		fmt.Sprintf("Destination target address %s verified on-chain", shortenAddress(input.TargetAddress)),
		fmt.Sprintf("Exact block timestamps recorded between %s and %s", input.PathStartTime.Format("2006-01-02 15:04"), input.PathEndTime.Format("2006-01-02 15:04")),
	}
	if input.LabelConfidence == model.StatusVerified {
		facts = append(facts, fmt.Sprintf("Verified deposit pool label for %s in TRACE-X Intelligence Registry", vaspName))
	}

	inferences := []string{
		fmt.Sprintf("Multi-hop graph traversal flow: %d hop distance between suspect and candidate VASP", input.HopDistance),
		fmt.Sprintf("Value retention continuity ratio calculated at %.1f%%", flowRatio*100),
		fmt.Sprintf("Temporal velocity inference: funds transferred across path in %v", duration.Round(time.Minute)),
	}
	if input.IsClusterAssociated {
		inferences = append(inferences, "Multi-input co-spending cluster heuristic indicates common wallet control pool")
	}
	if input.HasCrossChainBridge {
		inferences = append(inferences, "Cross-chain bridge relay heuristic links source chain to destination chain event")
	}

	unknowns := []string{
		"Off-chain VASP user account registration identity (KYC record)",
		"Internal VASP off-chain database sub-ledger transfer allocation",
		"Beneficial owner behind intermediary pass-through relay wallets",
	}

	labelSource := "TRACE-X Synthetic Intelligence Registry (DEMO)"
	if input.LabelConfidence == model.StatusVerified {
		labelSource = fmt.Sprintf("%s Verified Hot Wallet Registry v2.4", vaspName)
	}

	clusterEv := "No multi-input cluster identity detected"
	if input.IsClusterAssociated {
		clusterEv = "Direct co-spending / multi-input cluster identity matched with VASP deposit pool"
	}

	tempEv := fmt.Sprintf("Path traversal duration: %v (Temporal score: %.0f/15)", duration.Round(time.Minute), tempScore)
	crossEv := "No cross-chain bridge activity detected on path"
	if input.HasCrossChainBridge {
		crossEv = "Verified cross-chain bridge event detected"
	}

	return &PoAEAttributionResult{
		CandidateVASP:          vaspName,
		EvidenceStrength:       normalizedScore,
		Classification:         classification,
		ConfidenceBasis:        basis,
		Path:                   input.PathNodeAddresses,
		SupportingTransactions: input.PathTxHashes,
		Uncertainties:          uncertainties,
		FeatureScores:          featureScores,
		HopDistance:            input.HopDistance,
		InitialSentAmount:      input.InitialSentAmount,
		TargetReceivedAmount:   input.TargetReceivedAmount,
		ValueRetentionRatio:    math.Round(flowRatio*1000)/10,
		LabelSource:            labelSource,
		LabelConfidence:        string(input.LabelConfidence),
		ClusterEvidence:        clusterEv,
		TemporalEvidence:       tempEv,
		CrossChainEvidence:     crossEv,
		Facts:                  facts,
		Inferences:             inferences,
		Unknowns:               unknowns,
	}, nil
}

func shortenAddress(addr string) string {
	if len(addr) <= 10 {
		return addr
	}
	return fmt.Sprintf("%s...%s", addr[:6], addr[len(addr)-4:])
}

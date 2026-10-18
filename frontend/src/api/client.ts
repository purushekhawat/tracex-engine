export interface SystemHealth {
  status: string;
  service: string;
  version: string;
  timestamp: string;
}

export interface DependencyStatus {
  name: string;
  status: 'healthy' | 'unhealthy';
  details?: string;
}

export interface SystemDependencies {
  status: string;
  timestamp: string;
  dependencies: DependencyStatus[];
}

export interface Case {
  id: string;
  case_number: string;
  title: string;
  description: string;
  assigned_investigator_id?: string;
  status: string;
  priority: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Investigation {
  id: string;
  case_id: string;
  suspect_address: string;
  blockchain_id: string;
  depth_hops: number;
  status: string;
  risk_score: number;
  created_at: string;
  completed_at?: string;
}

export interface CytoscapeNode {
  id: string;
  label: string;
  type: string;
  is_suspect: boolean;
  is_vasp: boolean;
  vasp_name?: string;
  balance?: number;
}

export interface CytoscapeEdge {
  id: string;
  source: string;
  target: string;
  tx_hash: string;
  type: string;
  bridge_name?: string;
  amount: number;
  amount_usd: number;
  timestamp: string;
}

export interface CytoscapeGraphData {
  investigation_id: string;
  suspect_address: string;
  nodes: CytoscapeNode[];
  edges: CytoscapeEdge[];
  stats: {
    total_nodes: number;
    total_edges: number;
    max_depth: number;
    total_volume_usd: number;
  };
}

export interface AttributionResult {
  candidate_vasp: string;
  evidence_strength: number;
  classification: string;
  confidence_basis: string[];
  path: string[];
  supporting_transactions: string[];
  uncertainties: string[];
  feature_scores?: Record<string, number>;
  hop_distance?: number;
  initial_sent_amount?: number;
  target_received_amount?: number;
  value_retention_ratio?: number;
  label_source?: string;
  label_confidence?: string;
  cluster_evidence?: string;
  temporal_evidence?: string;
  cross_chain_evidence?: string;
  facts?: string[];
  inferences?: string[];
  unknowns?: string[];
}

export interface RiskIndicator {
  type: string;
  severity: string;
  confidence: number;
  description: string;
  evidence: string[];
}

export interface RiskReport {
  investigation_id: string;
  risk_score: number;
  risk_level: string;
  risk_indicators: RiskIndicator[];
  limitations: string[];
}



const API_BASE = (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : '/api/v1');

export async function fetchHealth(): Promise<SystemHealth> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health fetch error: ${res.statusText}`);
  return res.json();
}

export async function fetchDependencies(): Promise<SystemDependencies> {
  const res = await fetch(`${API_BASE}/health/dependencies`);
  if (!res.ok && res.status !== 207) throw new Error(`Dependencies fetch error: ${res.statusText}`);
  return res.json();
}

export async function fetchInvestigationByID(id: string): Promise<Investigation> {
  const res = await fetch(`${API_BASE}/investigations/${id}`);
  if (!res.ok) throw new Error(`Investigation fetch error: ${res.statusText}`);
  return res.json();
}

export async function fetchInvestigationGraph(id: string): Promise<CytoscapeGraphData> {
  const res = await fetch(`${API_BASE}/investigations/${id}/graph`);
  if (!res.ok) throw new Error(`Graph fetch error: ${res.statusText}`);
  return res.json();
}

export async function fetchInvestigationAttributions(id: string): Promise<{ investigation_id: string; attributions: AttributionResult[] }> {
  const res = await fetch(`${API_BASE}/investigations/${id}/attributions`);
  if (!res.ok) throw new Error(`Attributions fetch error: ${res.statusText}`);
  return res.json();
}

export async function fetchInvestigationRisk(id: string): Promise<RiskReport> {
  const res = await fetch(`${API_BASE}/investigations/${id}/risk`);
  if (!res.ok) throw new Error(`Risk fetch error: ${res.statusText}`);
  return res.json();
}

export interface CopilotCitation {
  ref: string;
  type: string;
  description: string;
}

export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: CopilotCitation[];
}

export interface CopilotResponse {
  investigation_id: string;
  query: string;
  answer: string;
  citations: CopilotCitation[];
  evidence_sources_used: string[];
  conversation_scoped: boolean;
}

export async function fetchCopilotQuery(
  id: string,
  query: string,
  history: CopilotMessage[] = []
): Promise<CopilotResponse> {
  const res = await fetch(`${API_BASE}/investigations/${id}/copilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, conversation_history: history }),
  });
  if (!res.ok) throw new Error(`Copilot query error: ${res.statusText}`);
  return res.json();
}

export interface InvestigationReportData {
  report_id: string;
  '1_case_information': {
    case_id: string;
    case_number: string;
    title: string;
    description: string;
    investigator: string;
    priority: string;
    status: string;
    tags: string[];
  };
  '2_investigation_scope': {
    investigation_id: string;
    max_hops: number;
    target_chain: string;
    legal_standard: string;
  };
  '3_suspect_wallet': {
    address: string;
    blockchain: string;
    balance: number;
    first_seen: string;
    last_seen: string;
    risk_score: number;
  };
  '4_blockchain': string;
  '5_transaction_summary': Record<string, any>;
  '6_fund_flow_timeline': Array<{
    step_index: number;
    from_address: string;
    to_address: string;
    amount_eth: number;
    amount_usd: number;
    tx_hash: string;
    timestamp: string;
  }>;
  '7_graph_summary': {
    total_nodes: number;
    total_edges: number;
    max_depth: number;
    total_volume_usd: number;
  };
  '8_candidate_vasp_attribution': AttributionResult[];
  '9_evidence_supporting_attribution': string[];
  '10_risk_indicators': RiskIndicator[];
  '11_cross_chain_activity': string[];
  '12_uncertainties_limitations': string[];
  '13_source_provenance_information': string[];
  '14_audit_metadata': {
    report_id: string;
    case_id: string;
    generated_at: string;
    analysis_version: string;
    cryptographic_sha256_hash: string;
    generated_by: string;
  };
  proof_classification: {
    verified_facts: string[];
    system_inferences: string[];
    unknown_information: string[];
  };
}

export async function fetchInvestigationReport(id: string): Promise<InvestigationReportData> {
  const res = await fetch(`${API_BASE}/investigations/${id}/report`);
  if (!res.ok) throw new Error(`Report fetch error: ${res.statusText}`);
  return res.json();
}

export function getReportDownloadURL(id: string): string {
  return `${API_BASE}/investigations/${id}/report/download`;
}

export async function fetchVASPList(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/intelligence/vasps`);
  if (!res.ok) throw new Error(`VASPs fetch error: ${res.statusText}`);
  return res.json();
}

export interface SahyogStatus {
  status: string;
  mode: string;
  version: string;
  description: string;
}

export interface DisclosureRequestDraft {
  draft_id: string;
  investigation_id: string;
  target_vasp: string;
  destination_address: string;
  legal_notice_header: string;
  requested_data_items: string[];
  evidence_basis_hashes: string[];
  sha256_proof_digest: string;
  created_at: string;
  status: string;
}

export interface FreezeRequestDraft {
  draft_id: string;
  investigation_id: string;
  target_wallet_address: string;
  estimated_value_usd: number;
  reason_for_freeze: string;
  evidence_hashes: string[];
  created_at: string;
  status: string;
}

export interface SahyogSubmitResponse {
  submission_id: string;
  sahyog_case_id: string;
  status: string;
  acknowledged_at: string;
  notice_reference: string;
  mode: string;
}

export async function fetchSahyogStatus(): Promise<SahyogStatus> {
  const res = await fetch(`${API_BASE}/sahyog/status`);
  if (!res.ok) throw new Error(`Sahyog status error: ${res.statusText}`);
  return res.json();
}

export async function createDisclosureDraft(id: string, targetVASP: string): Promise<DisclosureRequestDraft> {
  const res = await fetch(`${API_BASE}/sahyog/disclosure-draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ investigation_id: id, target_vasp: targetVASP }),
  });
  if (!res.ok) throw new Error(`Disclosure draft error: ${res.statusText}`);
  return res.json();
}

export async function createFreezeDraft(id: string, targetAddress: string, amountUSD: number): Promise<FreezeRequestDraft> {
  const res = await fetch(`${API_BASE}/sahyog/freeze-draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ investigation_id: id, target_address: targetAddress, amount_usd: amountUSD }),
  });
  if (!res.ok) throw new Error(`Freeze draft error: ${res.statusText}`);
  return res.json();
}

export async function submitSahyogRequest(payload: {
  investigation_id: string;
  candidate_vasp: string;
  evidence_strength: number;
  investigator_confirmed: boolean;
  investigator_badge: string;
}): Promise<SahyogSubmitResponse> {
  const res = await fetch(`${API_BASE}/sahyog/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || `Submit error: ${res.statusText}`);
  }
  return res.json();
}

export interface DemoLoadResponse {
  status: string;
  scenario: 'INVESTMENT_FRAUD' | 'CROSS_CHAIN';
  case_id: string;
  investigation_id: string;
  suspect_address: string;
  blockchain: string;
  destination_chain?: string;
  summary: string;
  is_demo: boolean;
  label: string;
}

export async function loadDemoInvestmentFraud(): Promise<DemoLoadResponse> {
  const res = await fetch(`${API_BASE}/demo/load-investment-fraud`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Demo load error: ${res.statusText}`);
  return res.json();
}

export async function loadDemoCrossChain(): Promise<DemoLoadResponse> {
  const res = await fetch(`${API_BASE}/demo/load-cross-chain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Demo load error: ${res.statusText}`);
  return res.json();
}

export interface StartInvestigationRequest {
  case_id?: string;
  wallet_address: string;
  blockchain: string;
  max_hops?: number;
}

export interface StartInvestigationResponse {
  investigation_id: string;
  status: string;
}

export interface InvestigationProgress {
  investigation_id: string;
  status: string;
  current_hop: number;
  max_hops: number;
  nodes_processed: number;
  edges_processed: number;
  progress_percent: number;
  message: string;
  last_updated: string;
}

export async function startInvestigation(req: StartInvestigationRequest): Promise<StartInvestigationResponse> {
  const res = await fetch(`${API_BASE}/investigations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || `Start investigation error: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchInvestigationProgress(id: string): Promise<InvestigationProgress> {
  const res = await fetch(`${API_BASE}/investigations/${id}/progress`);
  if (!res.ok) throw new Error(`Progress fetch error: ${res.statusText}`);
  return res.json();
}

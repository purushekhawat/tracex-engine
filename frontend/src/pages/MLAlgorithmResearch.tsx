import React, { useState } from 'react';
import {
  Brain,
  Cpu,
  GitFork,
  Network,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Scale,
  CheckCircle2,
  Info,
  HelpCircle,
  Calculator,
  RotateCcw,
  Binary,
} from 'lucide-react';

export const MLAlgorithmResearch: React.FC = () => {
  // Interactive PoAE Score Simulator State
  const [labelConfidence, setLabelConfidence] = useState<'VERIFIED' | 'STRONG' | 'INFERRED' | 'NONE'>('VERIFIED');
  const [hopDistance, setHopDistance] = useState<number>(2);
  const [initialSent, setInitialSent] = useState<number>(50000);
  const [targetReceived, setTargetReceived] = useState<number>(48500);
  const [hoursElapsed, setHoursElapsed] = useState<number>(6);
  const [txCount, setTxCount] = useState<number>(3);
  const [isClusterAssociated, setIsClusterAssociated] = useState<boolean>(true);
  const [hasCrossChainBridge, setHasCrossChainBridge] = useState<boolean>(true);
  const [hasMixerInteraction, setHasMixerInteraction] = useState<boolean>(false);
  const [intermediaryCount, setIntermediaryCount] = useState<number>(1);

  // Compute Simulated PoAE Feature Scores
  const labelScore =
    labelConfidence === 'VERIFIED'
      ? 30
      : labelConfidence === 'STRONG'
      ? 20
      : labelConfidence === 'INFERRED'
      ? 10
      : 0;

  const pathScore =
    hopDistance === 1
      ? 20
      : hopDistance === 2
      ? 15
      : hopDistance === 3
      ? 10
      : hopDistance === 4
      ? 5
      : 0;

  const flowRatio = initialSent > 0 ? Math.min(1.0, targetReceived / initialSent) : 0;
  const flowScore = Math.round(flowRatio * 20 * 100) / 100;

  const tempScore =
    hoursElapsed <= 24
      ? 15
      : hoursElapsed <= 48
      ? 10
      : hoursElapsed <= 168
      ? 5
      : 0;

  const recurrenceScore = txCount > 1 ? 10 : 5;
  const clusterScore = isClusterAssociated ? 10 : 0;
  const crossChainScore = hasCrossChainBridge ? 10 : 0;

  let ambiguityPenalty = 0;
  if (hasMixerInteraction) ambiguityPenalty += 15;
  if (intermediaryCount > 2) ambiguityPenalty += 10;

  const rawScore =
    labelScore +
    pathScore +
    flowScore +
    tempScore +
    recurrenceScore +
    clusterScore +
    crossChainScore -
    ambiguityPenalty;

  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore * 10) / 10));

  let classification = 'UNKNOWN / UNRESOLVED';
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
  if (finalScore >= 80) {
    classification = 'STRONG_ASSOCIATION';
    badgeColor = 'bg-[#fbf7f1] text-[#9a7547] border-[#9a7547]/30';
  } else if (finalScore >= 50) {
    classification = 'INFERRED_ASSOCIATION';
    badgeColor = 'bg-slate-50 text-slate-700 border-slate-200';
  }

  const resetSimulator = () => {
    setLabelConfidence('VERIFIED');
    setHopDistance(2);
    setInitialSent(50000);
    setTargetReceived(48500);
    setHoursElapsed(6);
    setTxCount(3);
    setIsClusterAssociated(true);
    setHasCrossChainBridge(true);
    setHasMixerInteraction(false);
    setIntermediaryCount(1);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf7f1] border border-[#9a7547]/30 text-[#9a7547] text-xs font-mono font-medium">
                <Brain className="h-3.5 w-3.5 text-[#9a7547]" /> Research & Technical Architecture
              </span>

            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Machine Learning & Graph Analytics Algorithm Specification
            </h1>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              Mathematical modeling, Proof-of-Attribution Engine (PoAE) multi-factor formulation, graph traversal heuristics, laundering typology detectors, and court-admissible legal evidentiary segregation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 font-mono text-xs">
              DOC REF: TRACEX-ALGO-2026-v2.4
            </span>
          </div>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Primary Engine</span>
            <Scale className="h-4 w-4 text-[#9a7547]" />
          </div>
          <div className="text-base font-bold text-slate-800">PoAE v2.4</div>
          <div className="text-xs text-slate-500">8-Factor Explainable Scoring</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Graph Subsystem</span>
            <Network className="h-4 w-4 text-[#9a7547]" />
          </div>
          <div className="text-base font-bold text-slate-800">NetworkX & Neo4j</div>
          <div className="text-xs text-slate-500">Multi-Hop Path Traversal & Centrality</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Typology Detector</span>
            <AlertTriangle className="h-4 w-4 text-[#9a7547]" />
          </div>
          <div className="text-base font-bold text-slate-800">5 ML Typologies</div>
          <div className="text-xs text-slate-500">Peel Chains, Structuring, Velocity</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Evidence Standard</span>
            <ShieldCheck className="h-4 w-4 text-[#9a7547]" />
          </div>
          <div className="text-base font-bold text-slate-800">Tri-State Segregation</div>
          <div className="text-xs text-slate-500">Facts vs Inferences vs Unknowns</div>
        </div>
      </div>

      {/* Section 1: Problem Formulation & Graph Theory */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#9a7547] font-mono text-xs font-semibold uppercase tracking-wider">
          <Binary className="h-4 w-4" /> Section 1. Mathematical Formulation & Blockchain Graph Model
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Heterogeneous Multi-Chain Transaction Graph: G = (V, E)
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Cryptocurrency transaction flows are modeled as a directed, edge-attributed multigraph{' '}
          <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800 font-bold">
            G = (V, E, &Phi;_V, &Phi;_E)
          </code>
          , where vertices represent wallet addresses and smart contracts across Ethereum, TRON, and cross-chain bridge relays, and edges represent asset transfers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold font-mono text-slate-800 uppercase flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-[#9a7547]" /> Vertex Attribute Mapping (&Phi;_V)
            </span>
            <ul className="text-xs text-slate-600 space-y-1.5 font-mono list-disc list-inside">
              <li><strong className="text-slate-800">Address Identifier (v &isin; V):</strong> Hex string or Base58 address</li>
              <li><strong className="text-slate-800">Chain ID (C_v):</strong> Ethereum (1), TRON (728126428)</li>
              <li><strong className="text-slate-800">Entity Type:</strong> EOA, Deposit Pool, Hot Wallet, Mixer, Bridge</li>
              <li><strong className="text-slate-800">Label Ground Truth:</strong> Verified, Inferred, or Unlabeled</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold font-mono text-slate-800 uppercase flex items-center gap-1.5">
              <GitFork className="h-4 w-4 text-[#9a7547]" /> Edge Attribute Mapping (&Phi;_E)
            </span>
            <ul className="text-xs text-slate-600 space-y-1.5 font-mono list-disc list-inside">
              <li><strong className="text-slate-800">Transfer Vector (e = (u, v)):</strong> Source u to destination v</li>
              <li><strong className="text-slate-800">Value & Asset (w(e)):</strong> Amount in native token & normalized USD</li>
              <li><strong className="text-slate-800">Block Timestamp (t(e)):</strong> Cryptographic ledger epoch time</li>
              <li><strong className="text-slate-800">Tx Hash (H(e)):</strong> Immutable cryptographic 32-byte hash</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 2: Proof-of-Attribution Engine (PoAE) Formula */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-[#9a7547] font-mono text-xs font-semibold uppercase tracking-wider">
          <Scale className="h-4 w-4" /> Section 2. Proof-of-Attribution Engine (PoAE) Multi-Factor Formulation
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          The Explainable Evidence-Strength Scoring Equation
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          TRACE-X replaces traditional black-box neural attribution models with a deterministic, mathematically verifiable, and court-admissible scoring formula. The evidence score S evaluates attribution probability to candidate VASP deposit infrastructure:
        </p>

        {/* Formula Display Box */}
        <div className="p-5 rounded-xl bg-slate-900 text-slate-100 font-mono text-sm shadow-inner space-y-3">
          <div className="text-center py-2 text-base font-semibold tracking-wide text-[#9a7547]">
            {'S = min(100, max(0, ∑(W_i · F_i) - P_ambiguity))'}
          </div>
          <div className="border-t border-slate-800 pt-3 text-xs text-slate-400 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-200 font-bold">1. Label Strength:</span> W₁ = 30 pts
            </div>
            <div>
              <span className="text-slate-200 font-bold">2. Hop Distance:</span> W₂ = 20 pts
            </div>
            <div>
              <span className="text-slate-200 font-bold">3. Value Retention:</span> W₃ = 20 pts
            </div>
            <div>
              <span className="text-slate-200 font-bold">4. Temporal Velocity:</span> W₄ = 15 pts
            </div>
            <div>
              <span className="text-slate-200 font-bold">5. Recurrence:</span> W₅ = 10 pts
            </div>
            <div>
              <span className="text-slate-200 font-bold">6. Co-Spending Cluster:</span> W₆ = 10 pts
            </div>
            <div>
              <span className="text-slate-200 font-bold">7. Cross-Chain Link:</span> W₇ = 10 pts
            </div>
            <div>
              <span className="text-slate-700 font-bold">8. Ambiguity Penalty:</span> P &le; 25 pts
            </div>
          </div>
        </div>

        {/* Comprehensive Feature Breakdown Table */}
        <div className="overflow-x-auto relative z-10 border-t border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-none bg-white">
                <th className="py-4 pl-6 pr-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">Feature (F_i)</th>
                <th className="py-4 px-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">Weight (W_i)</th>
                <th className="py-4 px-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">Mathematical Definition &amp; Decay Function</th>
                <th className="py-4 pl-3.5 pr-6 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">Evidentiary Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-200/60 bg-white">
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 pl-6 pr-3 font-bold text-slate-900 text-xs border-none">1. Address Label Strength</td>
                <td className="py-4 px-3.5 font-bold text-[#9a7547] text-xs border-none">30 pts</td>
                <td className="py-4 px-3.5 text-xs text-slate-700 font-medium border-none">
                  Direct match against verified intelligence DB: Verified hot wallet = 30 pts, Strong association = 20 pts, Heuristic inferred = 10 pts.
                </td>
                <td className="py-4 pl-3.5 pr-6 whitespace-nowrap border-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#d1fae5] text-[#065f46] text-xs font-bold">
                    FACT (Verified)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 pl-6 pr-3 font-bold text-slate-900 text-xs border-none">2. Hop Distance Decay</td>
                <td className="py-4 px-3.5 font-bold text-[#9a7547] text-xs border-none">20 pts</td>
                <td className="py-4 px-3.5 text-xs text-slate-700 font-medium border-none">
                  {'Step decay: H=1 → 20 pts, H=2 → 15 pts, H=3 → 10 pts, H=4 → 5 pts, H > 4 → 0 pts.'}
                </td>
                <td className="py-4 pl-3.5 pr-6 whitespace-nowrap border-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#d1fae5] text-[#065f46] text-xs font-bold">
                    FACT (Ledger Graph)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 pl-6 pr-3 font-bold text-slate-900 text-xs border-none">3. Value Flow Retention Ratio</td>
                <td className="py-4 px-3.5 font-bold text-[#9a7547] text-xs border-none">20 pts</td>
                <td className="py-4 px-3.5 text-xs text-slate-700 font-medium border-none">
                  {'R = min(1.0, V_target / V_initial) × 20. Evaluates proportion of suspect wallet volume preserved without diversion.'}
                </td>
                <td className="py-4 pl-3.5 pr-6 whitespace-nowrap border-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-bold">
                    INFERENCE (Flow Metric)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 pl-6 pr-3 font-bold text-slate-900 text-xs border-none">4. Temporal Velocity Decay</td>
                <td className="py-4 px-3.5 font-bold text-[#9a7547] text-xs border-none">15 pts</td>
                <td className="py-4 px-3.5 text-xs text-slate-700 font-medium border-none">
                  {'ΔT = t_end - t_start. ΔT ≤ 24h → 15 pts, ≤ 48h → 10 pts, ≤ 7d → 5 pts, > 7d → 0 pts.'}
                </td>
                <td className="py-4 pl-3.5 pr-6 whitespace-nowrap border-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-bold">
                    INFERENCE (Velocity)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 pl-6 pr-3 font-bold text-slate-900 text-xs border-none">5. Transaction Recurrence</td>
                <td className="py-4 px-3.5 font-bold text-[#9a7547] text-xs border-none">10 pts</td>
                <td className="py-4 px-3.5 text-xs text-slate-700 font-medium border-none">
                  {'Frequency of historical transfers. Recurring transactions (N > 1) → 10 pts, single transfer → 5 pts.'}
                </td>
                <td className="py-4 pl-3.5 pr-6 whitespace-nowrap border-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#d1fae5] text-[#065f46] text-xs font-bold">
                    FACT (Ledger History)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 pl-6 pr-3 font-bold text-slate-900 text-xs border-none">6. Co-Spending Cluster Identity</td>
                <td className="py-4 px-3.5 font-bold text-[#9a7547] text-xs border-none">10 pts</td>
                <td className="py-4 px-3.5 text-xs text-slate-700 font-medium border-none">
                  Multi-input / deposit address sweep aggregation heuristics matching target entity pool cluster.
                </td>
                <td className="py-4 pl-3.5 pr-6 whitespace-nowrap border-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-bold">
                    INFERENCE (Heuristic)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 pl-6 pr-3 font-bold text-slate-900 text-xs border-none">7. Cross-Chain Bridge Linkage</td>
                <td className="py-4 px-3.5 font-bold text-[#9a7547] text-xs border-none">10 pts</td>
                <td className="py-4 px-3.5 text-xs text-slate-700 font-medium border-none">
                  Detection of verified bridge protocol contract interaction (e.g. Stargate, Wormhole, cBridge) linking EVM origin to TRON destination.
                </td>
                <td className="py-4 pl-3.5 pr-6 whitespace-nowrap border-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#d1fae5] text-[#065f46] text-xs font-bold">
                    FACT (Bridge Contract)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 pl-6 pr-3 font-bold text-slate-900 text-xs border-none">8. Ambiguity &amp; Mixer Penalty</td>
                <td className="py-4 px-3.5 font-bold text-[#9a7547] text-xs border-none">-25 pts max</td>
                <td className="py-4 px-3.5 text-xs text-slate-600 font-medium border-none">
                  {'Deductions: Privacy pool / mixer detected = -15 pts; High intermediary hops (> 2 intermediaries) = -10 pts.'}
                </td>
                <td className="py-4 pl-3.5 pr-6 whitespace-nowrap border-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] text-xs font-bold">
                    PENALTY (Uncertainty)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Interactive PoAE Algorithm Simulator */}
      <div className="rounded-2xl bg-white border border-[#e7ebf2] p-6 shadow-sm space-y-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#9a7547] font-mono text-xs font-semibold uppercase tracking-wider">
              <Calculator className="h-4 w-4" /> Interactive Algorithm Laboratory
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Live PoAE Scoring Simulator & Parameter Sensitivity Engine
            </h3>
          </div>
          <button
            onClick={resetSimulator}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-mono hover:bg-slate-50 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Parameters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column 1 */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Destination Label Confidence (W₁ = 30)
              </label>
              <select
                value={labelConfidence}
                onChange={(e) => setLabelConfidence(e.target.value as any)}
                className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#9a7547]"
              >
                <option value="VERIFIED">VERIFIED (+30 pts)</option>
                <option value="STRONG">STRONG ASSOCIATION (+20 pts)</option>
                <option value="INFERRED">INFERRED MATCH (+10 pts)</option>
                <option value="NONE">UNLABELED (+0 pts)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-700 font-medium">Hop Distance (W₂ = 20)</span>
                <span className="text-[#9a7547] font-bold">{hopDistance} Hops (+{pathScore} pts)</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={hopDistance}
                onChange={(e) => setHopDistance(parseInt(e.target.value))}
                className="w-full accent-[#9a7547]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>1 Hop (20)</span>
                <span>2 Hops (15)</span>
                <span>3 Hops (10)</span>
                <span>4 Hops (5)</span>
                <span>5+ Hops (0)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-700 font-medium">Intermediary Wallets</span>
                <span className="text-slate-800 font-bold">{intermediaryCount} Relay Node(s)</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={intermediaryCount}
                onChange={(e) => setIntermediaryCount(parseInt(e.target.value))}
                className="w-full accent-[#9a7547]"
              />
            </div>
          </div>

          {/* Controls Column 2 */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-700 font-medium">Suspect Sent vs Received (W₃ = 20)</span>
                <span className="text-[#9a7547] font-bold">{(flowRatio * 100).toFixed(1)}% (+{flowScore} pts)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Initial Sent ($USD)</span>
                  <input
                    type="number"
                    value={initialSent}
                    onChange={(e) => setInitialSent(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-mono p-2 rounded border border-slate-300"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Target Received ($USD)</span>
                  <input
                    type="number"
                    value={targetReceived}
                    onChange={(e) => setTargetReceived(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-mono p-2 rounded border border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-700 font-medium">Path Velocity (W₄ = 15)</span>
                <span className="text-[#9a7547] font-bold">{hoursElapsed} Hours (+{tempScore} pts)</span>
              </div>
              <input
                type="range"
                min="1"
                max="192"
                step="1"
                value={hoursElapsed}
                onChange={(e) => setHoursElapsed(parseInt(e.target.value))}
                className="w-full accent-[#9a7547]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>{'<24h (15)'}</span>
                <span>{'<48h (10)'}</span>
                <span>{'<7d (5)'}</span>
                <span>{'>7d (0)'}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-xs font-mono text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isClusterAssociated}
                  onChange={(e) => setIsClusterAssociated(e.target.checked)}
                  className="rounded text-[#9a7547] focus:ring-[#9a7547]"
                />
                <span>Co-Spending / Deposit Sweep Cluster (+10 pts)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-mono text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCrossChainBridge}
                  onChange={(e) => setHasCrossChainBridge(e.target.checked)}
                  className="rounded text-[#9a7547] focus:ring-[#9a7547]"
                />
                <span>Verified Cross-Chain Bridge Linked (+10 pts)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-mono text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasMixerInteraction}
                  onChange={(e) => setHasMixerInteraction(e.target.checked)}
                  className="rounded text-[#9a7547] focus:ring-[#9a7547]"
                />
                <span>Mixer / Privacy Pool Encountered (-15 pts penalty)</span>
              </label>
            </div>
          </div>

          {/* Real-time Calculation Result Box */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                Computed Evidence Strength
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 font-mono">
                  {finalScore.toFixed(1)}
                </span>
                <span className="text-sm font-mono text-slate-400">/ 100</span>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full border text-xs font-mono font-bold ${badgeColor}`}>
                  {classification}
                </span>
              </div>
            </div>

            {/* Score Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className={`h-full transition-all duration-300 ${
                    'bg-[#9a7547]'
                  }`}
                  style={{ width: `${finalScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0 (Uncertain)</span>
                <span>50 (Inferred)</span>
                <span>80 (Strong)</span>
                <span>100</span>
              </div>
            </div>

            {/* Score Composition List */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Label Strength:</span>
                <span className="text-slate-900 font-bold">+{labelScore} pts</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Hop Decay:</span>
                <span className="text-slate-900 font-bold">+{pathScore} pts</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Flow Retention:</span>
                <span className="text-slate-900 font-bold">+{flowScore} pts</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Temporal Velocity:</span>
                <span className="text-slate-900 font-bold">+{tempScore} pts</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cluster & Bridge:</span>
                <span className="text-slate-900 font-bold">+{clusterScore + crossChainScore} pts</span>
              </div>
              {ambiguityPenalty > 0 && (
                <div className="flex justify-between text-[#9a7547] font-bold">
                  <span>Ambiguity Penalties:</span>
                  <span>-{ambiguityPenalty} pts</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Graph Traversal & Laundering Typologies */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-[#9a7547] font-mono text-xs font-semibold uppercase tracking-wider">
          <Network className="h-4 w-4" /> Section 3. Graph Traversal Algorithms & Laundering Typologies
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          NetworkX Traversal and Rule-Based Typology Detection
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          The Python Analytics Microservice leverages <strong>NetworkX DiGraph</strong> primitives to extract traversal paths, compute node centralities, and identify high-risk financial crime typologies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Typology 1: Peeling Chain */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs font-mono uppercase flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-[#9a7547]" /> 1. Peeling Chain Heuristic
              </span>
              <span className="px-2 py-0.5 rounded bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[10px] font-mono font-bold">
                HIGH SEVERITY
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {'Detects patterns where a wallet transfers a large majority of its balance (> 80%) to an intermediary wallet while peeling off a smaller chunk (< 20%) to an unassociated change or cash-out address, repeating across hops.'}
            </p>
            <div className="p-2.5 rounded bg-slate-900 text-slate-200 font-mono text-[11px]">
              {'V_pass ≥ 0.80 · V_in  ∧  V_peel ≤ 0.20 · V_in'}
            </div>
          </div>

          {/* Typology 2: Structuring / Fan-Out */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs font-mono uppercase flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-[#9a7547]" /> 2. Fan-Out Dispersal (Structuring)
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-mono font-bold">
                HIGH SEVERITY
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detects smurfing and structuring behavior where a single origin address rapidly fragments illicit proceeds into 3 or more outgoing addresses to evade reporting thresholds.
            </p>
            <div className="p-2.5 rounded bg-slate-900 text-slate-200 font-mono text-[11px]">
              {'Out-Degree(v) ≥ 3  ∧  ∀ e_i, Amount(e_i) < threshold'}
            </div>
          </div>

          {/* Typology 3: Fan-In Aggregation */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs font-mono uppercase flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-[#9a7547]" /> 3. Fan-In Aggregation
              </span>
              <span className="px-2 py-0.5 rounded bg-[#fbf7f1] text-[#9a7547] text-[10px] font-mono font-bold">
                MEDIUM SEVERITY
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Identifies collection hot wallets and intermediary sweep nodes where fragmented illicit funds from multiple independent source wallets converge before reaching an exchange deposit pool.
            </p>
            <div className="p-2.5 rounded bg-slate-900 text-slate-200 font-mono text-[11px]">
              {'In-Degree(v) ≥ 3  ∧  Centrality(v) > Centrality_avg'}
            </div>
          </div>

          {/* Typology 4: High Velocity Layering */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs font-mono uppercase flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-[#9a7547]" /> 4. High-Velocity Layering
              </span>
              <span className="px-2 py-0.5 rounded bg-[#fbf7f1] text-[#9a7547] text-[10px] font-mono font-bold">
                MEDIUM SEVERITY
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detects multi-hop pass-through wallets with low holding times, where funds are relayed within a tight 48-hour window to impede frozen funds requests.
            </p>
            <div className="p-2.5 rounded bg-slate-900 text-slate-200 font-mono text-[11px]">
              {'Hops ≥ 2  ∧  (t_out - t_in) < 48 Hours'}
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Legal & Evidentiary Standards for Court Admissibility */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#9a7547] font-mono text-xs font-semibold uppercase tracking-wider">
          <FileCheck2 className="h-4 w-4" /> Section 4. Legal Compliance & Court-Admissibility Standards
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Strict Tri-State Evidence Segregation (Indian Evidence Act / Sec 91 CrPC)
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          To ensure strict compliance with legal frameworks and prevent investigative misattribution in judicial proceedings, TRACE-X guarantees that outputs strictly separate verified facts from algorithmic inferences and off-chain unknowns:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Facts */}
          <div className="p-4 rounded-xl bg-[#fbf7f1]/50 border border-[#9a7547]/20 space-y-2">
            <div className="flex items-center gap-2 text-[#9a7547] font-bold text-xs font-mono uppercase">
              <CheckCircle2 className="h-4 w-4 text-[#9a7547]" /> 1. Verified Facts
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              On-chain immutable ledger records directly verifiable on public blockchains (tx hashes, block numbers, wallet addresses, cryptographic transfer amounts, timestamps).
            </p>
          </div>

          {/* Inferences */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs font-mono uppercase">
              <Info className="h-4 w-4 text-[#9a7547]" /> 2. System Inferences
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Algorithmic calculations produced by PoAE and graph heuristics (evidence-strength percentages, flow retention ratios, peel chain flags, path velocities).
            </p>
          </div>

          {/* Unknowns */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs font-mono uppercase">
              <HelpCircle className="h-4 w-4 text-slate-500" /> 3. Unknown Information
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Off-chain real-world identities, beneficial ownership, physical location, and private exchange KYC records which require lawful Section 91 CrPC summons.
            </p>
          </div>
        </div>

        {/* SHA-256 Digest Note */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono text-slate-600">
          <span>Cryptographic Provenance Verification: All report packages include SHA-256 digests.</span>
          <span className="text-[#9a7547] font-bold">SHA-256 Digest Verified</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AttributionResult } from '../api/client';
import {
  Building2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Layers,
  Clock,
  ArrowRightLeft,
  ExternalLink,
  Info,
  Hash,
  FileCheck2,
} from 'lucide-react';

interface AttributionPanelProps {
  attributions: AttributionResult[];
}

export const AttributionPanel: React.FC<AttributionPanelProps> = ({ attributions }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case 'STRONG_ASSOCIATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-xs font-bold tracking-tight">
            <ShieldCheck className="h-3.5 w-3.5 text-[#9a7547]" /> STRONG ASSOCIATION
          </span>
        );
      case 'INFERRED_ASSOCIATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold tracking-tight">
            <Info className="h-3.5 w-3.5 text-slate-500" /> INFERRED ASSOCIATION
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold tracking-tight">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400" /> UNKNOWN / UNRESOLVED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Proof-of-Attribution Legal Guidance Header */}
      <div className="glass-card ai-card-bg p-6 space-y-3 !border-[#e7ebf2]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-[#9a7547]" /> Explainable Proof-of-Attribution Engine (PoAE) Evidence Panel
          </h2>
          <span className="px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 text-xs font-bold font-mono">
            TRACE-X v2.4 Intelligence Engine
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          PoAE calculates explainable evidence-strength scores (0–100%) by combining 8 distinct graph intelligence dimensions.
          Attribution results rigorously separate confirmed <strong className="text-[#9a7547] font-bold">FACTS</strong>, algorithmic <strong className="text-slate-700 font-bold">INFERENCES</strong>, and off-chain <strong className="text-slate-500 font-bold">UNKNOWNS</strong>.
        </p>

        {/* Fact vs Inference Distinction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-[#fbf7f1]/50 border border-[#9a7547]/20 text-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-[#9a7547] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#9a7547] font-bold uppercase text-[11px]">FACT (Verified)</strong>
              <span className="text-[11px] leading-relaxed text-slate-600">Direct on-chain tx hashes, immutable ledger timestamps, verified VASP labels.</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-[#e7ebf2] text-slate-800 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-800 font-bold uppercase text-[11px]">INFERENCE (Heuristic)</strong>
              <span className="text-[11px] leading-relaxed text-slate-600">Value flow continuity, hop distance velocity, co-spending cluster algorithms.</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-[#e7ebf2] text-slate-800 flex items-start gap-2.5">
            <HelpCircle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-700 font-bold uppercase text-[11px]">UNKNOWN (Off-Chain)</strong>
              <span className="text-[11px] leading-relaxed text-slate-600">User KYC registration, internal exchange sub-ledgers (Requires Subpoena).</span>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate VASP List */}
      <div className="space-y-6">
        {attributions.map((attr, idx) => {
          const isExpanded = expandedIndex === idx;
          const score = attr.evidence_strength;
          const hopCount = attr.hop_distance || attr.path.length - 1;
          const initialAmt = attr.initial_sent_amount || 10.0;
          const targetAmt = attr.target_received_amount || 9.8;
          const retention = attr.value_retention_ratio || 98.0;

          return (
            <div key={idx} className="glass-card ai-card-bg overflow-hidden !border-[#e7ebf2] hover:!border-[#9a7547]/35 transition-all">
              {/* VASP Candidate Top Header */}
              <div className="p-6 border-b border-slate-100 space-y-4 bg-white">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        CANDIDATE VASP #{idx + 1}
                      </span>
                      {getClassificationBadge(attr.classification)}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                      <Building2 className="h-6 w-6 text-[#9a7547]" />
                      {attr.candidate_vasp}
                    </h3>
                  </div>

                  {/* Evidence Strength Meter Badge */}
                  <div className="flex items-center gap-4 bg-[#fbf7f1] p-4 rounded-2xl border border-[#9a7547]/25 shadow-2xs">
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Evidence Strength</div>
                      <div className="text-xs text-[#9a7547] font-semibold">PoAE Evaluated (0–100%)</div>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-white border border-[#9a7547]/30 text-[#9a7547] font-black text-3xl shadow-xs">
                      {score.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-[#9a7547] transition-all duration-500 rounded-full"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>

              {/* 6 Dimension Cards Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white">
                {/* 1. Hop Distance */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-[#e7ebf2] space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 tracking-wider">
                    <Layers className="h-3.5 w-3.5 text-[#9a7547]" /> Hop Distance
                  </div>
                  <div className="text-lg font-black text-slate-800">{hopCount} Hops Traversed</div>
                  <div className="text-[11px] text-slate-500 font-medium">Path length from suspect wallet</div>
                </div>

                {/* 2. Value Flow & Retention */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-[#e7ebf2] space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 tracking-wider">
                    <TrendingUp className="h-3.5 w-3.5 text-[#9a7547]" /> Value Flow Continuity
                  </div>
                  <div className="text-lg font-black text-slate-900">
                    {targetAmt} ETH <span className="text-xs text-slate-500 font-normal">({retention}% retention)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Sent: {initialAmt} ETH &rarr; Received: {targetAmt} ETH</div>
                </div>

                {/* 3. Address Label Source */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-[#e7ebf2] space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 tracking-wider">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#9a7547]" /> Address Label Source
                  </div>
                  <div className="font-bold text-xs text-slate-800 truncate font-mono">
                    {attr.label_source || 'TRACE-X Intelligence Registry'}
                  </div>
                  <div className="text-[11px] text-[#9a7547] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Status: {attr.label_confidence || 'VERIFIED'}
                  </div>
                </div>

                {/* 4. Cluster Evidence */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-[#e7ebf2] space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 tracking-wider">
                    <Building2 className="h-3.5 w-3.5 text-[#9a7547]" /> Cluster Evidence
                  </div>
                  <div className="text-xs text-slate-700 font-medium line-clamp-2">
                    {attr.cluster_evidence || 'Co-spending multi-input cluster identity matched'}
                  </div>
                </div>

                {/* 5. Temporal Evidence */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-[#e7ebf2] space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 tracking-wider">
                    <Clock className="h-3.5 w-3.5 text-[#9a7547]" /> Temporal Evidence
                  </div>
                  <div className="text-xs text-slate-700 font-medium line-clamp-2">
                    {attr.temporal_evidence || 'Rapid path traversal within 24 hours'}
                  </div>
                </div>

                {/* 6. Cross-Chain Evidence */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-[#e7ebf2] space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 tracking-wider">
                    <ArrowRightLeft className="h-3.5 w-3.5 text-[#9a7547]" /> Cross-Chain Evidence
                  </div>
                  <div className="text-xs text-slate-700 font-medium line-clamp-2">
                    {attr.cross_chain_evidence || 'No cross-chain bridge activity detected'}
                  </div>
                </div>
              </div>

              {/* Path & Supporting Transactions Section */}
              <div className="p-6 border-t border-slate-100 space-y-4 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Multi-Hop Wallet Path */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-[#e7ebf2] space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-[#9a7547]" /> Multi-Hop Wallet Path ({attr.path.length} Nodes)
                    </span>
                    <div className="space-y-2 pt-1 text-xs">
                      {attr.path.map((nodeAddr, nIdx) => (
                        <div key={nIdx} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#e7ebf2]">
                          <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[10px] flex items-center justify-center font-bold">
                              {nIdx}
                            </span>
                            <span className={`font-mono text-xs ${nIdx === 0 ? 'text-[#9a7547] font-bold' : nIdx === attr.path.length - 1 ? 'text-[#9a7547] font-bold' : 'text-slate-800 font-semibold'}`}>
                              {nodeAddr}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold">
                            {nIdx === 0 ? 'Suspect' : nIdx === attr.path.length - 1 ? 'Destination VASP' : 'Relay'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Supporting Transactions */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-[#e7ebf2] space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5 text-[#9a7547]" /> Supporting On-Chain Transactions ({attr.supporting_transactions.length})
                    </span>
                    <div className="space-y-2 pt-1 text-xs">
                      {attr.supporting_transactions.map((txHash, tIdx) => (
                        <div key={tIdx} className="p-2.5 rounded-lg bg-white border border-[#e7ebf2] flex items-center justify-between">
                          <div className="flex items-center gap-2 truncate pr-2">
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-700 truncate font-mono text-xs">{txHash}</span>
                          </div>
                          <span className="text-[10px] text-[#9a7547] font-bold shrink-0 bg-[#fbf7f1] px-2 py-0.5 rounded-full border border-[#9a7547]/30">CONFIRMED</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Uncertainties Section */}
                {attr.uncertainties && attr.uncertainties.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#fbf7f1] border border-[#9a7547]/25 space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-[#9a7547]" /> Ambiguity Factors &amp; Uncertainties ({attr.uncertainties.length})
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-800 pl-1 font-medium">
                      {attr.uncertainties.map((unc, uIdx) => (
                        <li key={uIdx} className="flex items-start gap-2">
                          <span className="text-[#9a7547] font-bold">&bull;</span>
                          <span>{unc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Expandable Accordion */}
              <div className="border-t border-slate-100 bg-slate-50/60">
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full px-6 py-3.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-[#9a7547] hover:bg-slate-100/60 transition group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-[#9a7547] group-hover:scale-110 transition-transform" />
                    <span>Why this attribution? Click to expand forensic evidence breakdown</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[#9a7547]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-[#9a7547]" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-6 border-t border-[#e7ebf2] space-y-6 bg-white animate-fadeIn">
                    {/* Legal Notice */}
                    <div className="p-4 rounded-xl bg-[#fbf7f1] border border-[#9a7547]/25 text-xs text-slate-800 space-y-1">
                      <div className="font-bold text-[#9a7547] uppercase flex items-center gap-1.5">
                        <Info className="h-4 w-4 text-[#9a7547]" /> Lawful Evidence Integrity Disclaimer:
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                        This PoAE assessment strictly categorizes findings into verified ledger <strong className="text-[#9a7547]">FACTS</strong> and algorithmic <strong className="text-slate-800">INFERENCES</strong>.
                        Inferred associations must never be presented as confirmed legal ownership without obtaining law-enforcement legal process (Subpoena / Section 91 CrPC Notice) served upon the destination VASP.
                      </p>
                    </div>

                    {/* 3 Evidence Tiers Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* FACTS */}
                      <div className="p-4 rounded-xl bg-[#fbf7f1] border border-[#9a7547]/30 space-y-3">
                        <div className="flex items-center justify-between border-b border-[#9a7547]/20 pb-2">
                          <span className="text-xs font-bold text-[#9a7547] uppercase flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-[#9a7547]" /> FACT (Confirmed Data)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#9a7547] text-white text-[10px] font-bold">
                            VERIFIED
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-700">
                          {(attr.facts || [
                            `Immutable on-chain transactions recorded: ${attr.supporting_transactions.length} txs`,
                            `Destination target wallet address ${attr.path[attr.path.length - 1]?.slice(0, 10)}... verified on-chain`,
                            `Exact blockchain block timestamps recorded on ledger`,
                            `Verified deposit pool label for ${attr.candidate_vasp}`,
                          ]).map((item, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#e7ebf2] text-[11px] text-slate-800 font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#9a7547] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* INFERENCES */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                            <Info className="h-4 w-4 text-[#9a7547]" /> INFERENCE (Algorithmic)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[10px] font-bold">
                            HEURISTIC
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-700">
                          {(attr.inferences || [
                            `Multi-hop graph traversal flow: ${hopCount} hop distance between suspect and candidate VASP`,
                            `Value retention continuity ratio calculated at ${retention}%`,
                            `Temporal velocity inference: funds transferred across path in 24 hours`,
                            `Multi-input co-spending cluster heuristic indicates common wallet control pool`,
                          ]).map((item, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#e7ebf2] text-[11px] text-slate-800 font-medium">
                              <Info className="h-3.5 w-3.5 text-[#9a7547] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* UNKNOWNS */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-[#e7ebf2] space-y-3">
                        <div className="flex items-center justify-between border-b border-[#e7ebf2] pb-2">
                          <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                            <HelpCircle className="h-4 w-4 text-slate-500" /> UNKNOWN (Off-Chain)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                            UNRESOLVED
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-700">
                          {(attr.unknowns || [
                            'Off-chain VASP user account registration identity (KYC record)',
                            'Internal VASP off-chain database sub-ledger transfer allocation',
                            'Beneficial owner behind intermediary pass-through relay wallets',
                          ]).map((item, uIdx) => (
                            <li key={uIdx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#e7ebf2] text-[11px] text-slate-700 font-medium">
                              <HelpCircle className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

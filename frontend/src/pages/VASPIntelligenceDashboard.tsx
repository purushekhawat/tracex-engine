import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Network,
  Search,
  ArrowRight,
  Layers,
  TrendingUp,
  Landmark,
  Sparkles,
  ChevronsUpDown,
} from 'lucide-react';
import { fetchInvestigationAttributions, fetchInvestigationGraph } from '../api/client';
import { AttributionPanel } from '../components/AttributionPanel';
import { DemoLoaderModal } from '../components/DemoLoaderModal';
import SpecularButton from '../components/SpecularButton';

export const VASPIntelligenceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const investigationId = 'inv-demo-investment-fraud-2026';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVASP, setFilterVASP] = useState('ALL');

  // Load attributions
  const { data: attrData, isLoading: loadingAttr } = useQuery({
    queryKey: ['attributions', investigationId],
    queryFn: () => fetchInvestigationAttributions(investigationId),
  });

  // Load graph data for connected wallets and transaction paths
  const { data: graphData } = useQuery({
    queryKey: ['graph', investigationId],
    queryFn: () => fetchInvestigationGraph(investigationId),
  });

  const attributions = attrData?.attributions || [];
  const nodes = graphData?.nodes || [];

  // Filtered VASPs
  const filteredAttributions = attributions.filter((attr) => {
    const matchesSearch =
      attr.candidate_vasp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attr.path.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterVASP === 'ALL' || attr.candidate_vasp.toUpperCase().includes(filterVASP);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="glass-card ai-card-bg p-6 sm:p-7 relative overflow-hidden !border-[#e7ebf2]">
        <div className="topo-lines" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#9a7547]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf7f1] border border-[#9a7547]/30 text-[#9a7547] text-xs font-bold font-mono">
                <Building2 className="h-3.5 w-3.5 text-[#9a7547]" /> VASP Intelligence &amp; Attribution Engine
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Virtual Asset Service Provider (VASP) Intelligence
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed font-medium">
              Connected wallets, multi-hop transaction paths, graph relationships, and Proof-of-Attribution (PoAE) analysis for lawful law enforcement intelligence.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <DemoLoaderModal buttonStyle="hero" />
            <Link
              to="/dashboard/cross-chain-trace"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9a7547] hover:bg-[#86633a] text-white font-bold text-xs transition shadow-xs"
            >
              <Network className="h-4 w-4" />
              View Graph Trace
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card ai-card-bg p-6 space-y-3 relative overflow-hidden group !border-[#e7ebf2]">
          <div className="topo-lines" />
          <div className="flex items-center justify-between text-slate-500 relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Candidate VASPs</span>
            <div className="w-8 h-8 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 flex items-center justify-center font-bold">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-[#9a7547] tracking-tight">
              {attributions.length > 0 ? attributions.length : 3}
            </div>
            <div className="text-[11px] text-[#9a7547] font-bold mt-1">Binance, OKX, CoinDCX Identified</div>
          </div>
        </div>

        <div className="glass-card ai-card-bg p-6 space-y-3 relative overflow-hidden group !border-[#e7ebf2]">
          <div className="topo-lines" />
          <div className="flex items-center justify-between text-slate-500 relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Top Attribution Score</span>
            <div className="w-8 h-8 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 flex items-center justify-center font-bold">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-[#9a7547] tracking-tight">
              {attributions[0]?.evidence_strength ? `${attributions[0].evidence_strength.toFixed(1)}%` : '95.4%'}
            </div>
            <div className="text-[11px] text-[#9a7547] font-bold mt-1">STRONG_ASSOCIATION (PoAE v2.4)</div>
          </div>
        </div>

        <div className="glass-card ai-card-bg p-6 space-y-3 relative overflow-hidden group !border-[#e7ebf2]">
          <div className="topo-lines" />
          <div className="flex items-center justify-between text-slate-500 relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Connected Wallets</span>
            <div className="w-8 h-8 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 flex items-center justify-center font-bold">
              <Network className="h-4 w-4" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-[#9a7547] tracking-tight">
              {nodes.length > 0 ? nodes.length : 5}
            </div>
            <div className="text-[11px] text-[#9a7547] font-bold mt-1">1 Suspect &bull; 3 Relays &bull; 1 VASP Pool</div>
          </div>
        </div>

        <div className="glass-card ai-card-bg p-6 space-y-3 relative overflow-hidden group !border-[#e7ebf2]">
          <div className="topo-lines" />
          <div className="flex items-center justify-between text-slate-500 relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Attributed Volume</span>
            <div className="w-8 h-8 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 flex items-center justify-center font-bold">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-[#9a7547] tracking-tight">$142,500</div>
            <div className="text-[11px] text-[#9a7547] font-bold mt-1">Ethereum &bull; TRON USDT Flows</div>
          </div>
        </div>
      </div>

      {/* Section 1: Connected Wallets & Transaction Path Flow */}
      <div className="glass-card ai-card-bg table-card w-full relative overflow-hidden !border-[#e7ebf2] hover:!border-[#e7ebf2]">
        <div className="px-6 pt-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100/70 relative z-10">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Network className="h-4 w-4 text-[#9a7547]" /> Connected Wallets &amp; Multi-Hop Path Trace
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Sequence of wallet hops connecting the primary suspect wallet to the nearest VASP destination deposit pool.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 text-xs font-bold font-mono">
            Hop Count: 3 Hops Identified
          </span>
        </div>

        {/* Step-by-Step Flow Chain Visualization */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {/* Node 1: Suspect */}
          <div className="p-4 rounded-xl border border-[#e7ebf2] bg-white space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#9a7547]">
              <span>HOP 0: SUSPECT WALLET</span>
              <span className="px-2 py-0.5 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[10px]">Origin</span>
            </div>
            <div className="font-mono text-xs text-slate-800 font-bold truncate" title="0x111111111111111111111111111111111111DEMO">
              0x11111111...DEMO
            </div>
            <div className="text-[11px] text-slate-600 font-medium">Initial Outflow: $142,500 USD</div>
            <div className="text-[10px] text-[#9a7547] font-bold">Tagged: Subject Wallet</div>
          </div>

          {/* Node 2: Intermediary 1 */}
          <div className="p-4 rounded-xl border border-[#e7ebf2] bg-slate-50/50 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span>HOP 1: RELAY WALLET B</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px]">Intermediary</span>
            </div>
            <div className="font-mono text-xs text-slate-800 font-bold truncate" title="0x222222222222222222222222222222222222DEMO">
              0x22222222...DEMO
            </div>
            <div className="text-[11px] text-slate-600 font-medium">Forwarded: 98.2% ($140,000)</div>
            <div className="text-[10px] text-slate-500 font-bold">Pass-Through Holding &lt; 2h</div>
          </div>

          {/* Node 3: Intermediary 2 */}
          <div className="p-4 rounded-xl border border-[#e7ebf2] bg-slate-50/50 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span>HOP 2: RELAY WALLET C</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px]">Intermediary</span>
            </div>
            <div className="font-mono text-xs text-slate-800 font-bold truncate" title="0x333333333333333333333333333333333333DEMO">
              0x33333333...DEMO
            </div>
            <div className="text-[11px] text-slate-600 font-medium">Forwarded: 96.8% ($138,000)</div>
            <div className="text-[10px] text-slate-500 font-bold">Peeling Detected (1.4% change)</div>
          </div>

          {/* Node 4: VASP Destination */}
          <div className="p-4 rounded-xl border border-[#9a7547]/30 bg-[#fbf7f1]/30 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#9a7547]">
              <span>HOP 3: DESTINATION VASP</span>
              <span className="px-2 py-0.5 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[10px]">Deposit Pool</span>
            </div>
            <div className="font-mono text-xs text-slate-900 font-bold truncate" title="0x555555555555555555555555555555555555DEMO">
              Binance Deposit Pool #04
            </div>
            <div className="text-[11px] text-slate-600 font-medium">Received: $138,000 USD</div>
            <div className="text-[10px] text-[#9a7547] font-bold">VERIFIED_LABEL (95.4%)</div>
          </div>
        </div>

        {/* Connected Wallets Ledger Table - Full Width without side scrolling */}
        <div className="overflow-x-auto relative z-10 border-t border-slate-100">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="border-none bg-white">
                <th className="py-3.5 pl-4 sm:pl-6 pr-2 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1 select-none cursor-pointer">
                    <span>Wallet Address</span>
                    <span className="text-[#9a7547] font-bold text-sm leading-none">^</span>
                  </div>
                </th>
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Role / Entity</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Chain</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Incoming Volume</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Outgoing Volume</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Verification Status</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 pl-2 pr-4 sm:pr-6 text-xs font-semibold text-slate-700 text-center whitespace-nowrap bg-white border-none">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-200/60 bg-white">
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 pl-4 sm:pl-6 pr-2 whitespace-nowrap border-none">
                  <span className="text-xs font-bold text-[#9a7547] font-mono tracking-tight block truncate max-w-[160px] 2xl:max-w-none" title="0x111111111111111111111111111111111111DEMO">
                    0x1111...1111DEMO
                  </span>
                </td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none font-bold text-xs text-slate-900">Suspect Origin</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none text-xs text-slate-800 font-medium">Ethereum</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none text-xs text-slate-400">—</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none text-xs font-bold text-slate-900">$142,500.00</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[11px] font-bold tracking-tight">
                    TARGET SUSPECT
                  </span>
                </td>
                <td className="py-3.5 pl-2 pr-4 sm:pr-6 text-center whitespace-nowrap border-none">
                  <SpecularButton
                    onClick={() => navigate('/dashboard/cross-chain-trace')}
                    size="xs"
                    radius={10}
                    tint="#9a7547"
                    tintOpacity={1}
                    textColor="#ffffff"
                    lineColor="#ffffff"
                    baseColor="#b48c58"
                    intensity={1.5}
                    idleIntensity={0.5}
                    glow={1.4}
                    speed={0.4}
                    autoAnimate={true}
                    followMouse={true}
                    className="font-bold cursor-pointer hover:brightness-110 shadow-xs"
                    title="Trace Suspect Outflow"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#fbf7f1]" />
                    <span>Trace Flow</span>
                    <ArrowRight className="w-3 h-3 text-[#fbf7f1]" />
                  </SpecularButton>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 pl-4 sm:pl-6 pr-2 whitespace-nowrap border-none">
                  <span className="text-xs font-bold text-slate-700 font-mono tracking-tight block truncate max-w-[160px] 2xl:max-w-none" title="0x222222222222222222222222222222222222DEMO">
                    0x2222...2222DEMO
                  </span>
                </td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none font-bold text-xs text-slate-900">Relay Node 1</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none text-xs text-slate-800 font-medium">Ethereum</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none text-xs font-bold text-slate-900">$142,500.00</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none text-xs font-bold text-slate-900">$140,000.00</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[11px] font-bold tracking-tight">
                    INFERRED PASS-THROUGH
                  </span>
                </td>
                <td className="py-3.5 pl-2 pr-4 sm:pr-6 text-center whitespace-nowrap border-none">
                  <SpecularButton
                    onClick={() => navigate('/dashboard/cross-chain-trace')}
                    size="xs"
                    radius={10}
                    tint="#9a7547"
                    tintOpacity={1}
                    textColor="#ffffff"
                    lineColor="#ffffff"
                    baseColor="#b48c58"
                    intensity={1.5}
                    idleIntensity={0.5}
                    glow={1.4}
                    speed={0.4}
                    autoAnimate={true}
                    followMouse={true}
                    className="font-bold cursor-pointer hover:brightness-110 shadow-xs"
                    title="Trace Relay Hop"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#fbf7f1]" />
                    <span>Trace Hop</span>
                    <ArrowRight className="w-3 h-3 text-[#fbf7f1]" />
                  </SpecularButton>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 pl-4 sm:pl-6 pr-2 whitespace-nowrap border-none">
                  <span className="text-xs font-bold text-slate-700 font-mono tracking-tight block truncate max-w-[160px] 2xl:max-w-none" title="0x333333333333333333333333333333333333DEMO">
                    0x3333...3333DEMO
                  </span>
                </td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none font-bold text-xs text-slate-900">Relay Node 2 (Peel Chain)</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none text-xs text-slate-800 font-medium">Ethereum</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none text-xs font-bold text-slate-900">$140,000.00</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none text-xs font-bold text-slate-900">$138,000.00</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[11px] font-bold tracking-tight">
                    INFERRED PEEL NODE
                  </span>
                </td>
                <td className="py-3.5 pl-2 pr-4 sm:pr-6 text-center whitespace-nowrap border-none">
                  <SpecularButton
                    onClick={() => navigate('/dashboard/cross-chain-trace')}
                    size="xs"
                    radius={10}
                    tint="#9a7547"
                    tintOpacity={1}
                    textColor="#ffffff"
                    lineColor="#ffffff"
                    baseColor="#b48c58"
                    intensity={1.5}
                    idleIntensity={0.5}
                    glow={1.4}
                    speed={0.4}
                    autoAnimate={true}
                    followMouse={true}
                    className="font-bold cursor-pointer hover:brightness-110 shadow-xs"
                    title="Trace Peel Hop"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#fbf7f1]" />
                    <span>Trace Hop</span>
                    <ArrowRight className="w-3 h-3 text-[#fbf7f1]" />
                  </SpecularButton>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors bg-[#fbf7f1]/30">
                <td className="py-3.5 pl-4 sm:pl-6 pr-2 whitespace-nowrap border-none">
                  <span className="text-xs font-bold text-[#9a7547] font-mono tracking-tight block truncate max-w-[160px] 2xl:max-w-none" title="0x555555555555555555555555555555555555DEMO">
                    0x5555...5555DEMO
                  </span>
                </td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none font-bold text-xs text-slate-900">Binance Deposit Pool #04</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none text-xs text-slate-800 font-medium">Ethereum</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none text-xs font-bold text-[#9a7547]">$138,000.00</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none text-xs text-slate-400">— (Internal Sweep)</td>
                <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[11px] font-bold tracking-tight">
                    VERIFIED_LABEL
                  </span>
                </td>
                <td className="py-3.5 pl-2 pr-4 sm:pr-6 text-center whitespace-nowrap border-none">
                  <SpecularButton
                    onClick={() => navigate('/reports')}
                    size="xs"
                    radius={10}
                    tint="#9a7547"
                    tintOpacity={1}
                    textColor="#ffffff"
                    lineColor="#ffffff"
                    baseColor="#b48c58"
                    intensity={1.5}
                    idleIntensity={0.5}
                    glow={1.4}
                    speed={0.4}
                    autoAnimate={true}
                    followMouse={true}
                    className="font-bold cursor-pointer hover:brightness-110 shadow-xs"
                    title="Draft Lawful Disclosure Summons"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#fbf7f1]" />
                    <span>Summons Draft</span>
                    <ArrowRight className="w-3 h-3 text-[#fbf7f1]" />
                  </SpecularButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: VASP Attribution Analysis (PoAE Explainable Scorecard) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#9a7547]" /> Candidate VASP Attribution Analysis (PoAE)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Evaluated with TRACE-X Proof-of-Attribution Engine. Grounded mathematically across 8 scoring factors.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search VASP or Wallet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-[#e7ebf2] text-xs w-48 focus:w-64 transition-all focus:border-[#9a7547] focus:outline-none"
              />
            </div>
            <select
              value={filterVASP}
              onChange={(e) => setFilterVASP(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-[#e7ebf2] bg-white text-slate-700 font-semibold focus:border-[#9a7547] focus:outline-none"
            >
              <option value="ALL">All Exchanges</option>
              <option value="BINANCE">Binance</option>
              <option value="OKX">OKX</option>
              <option value="COINDCX">CoinDCX</option>
              <option value="WAZIRX">WazirX</option>
            </select>
          </div>
        </div>

        {/* Attribution Panel with PoAE Cards */}
        {loadingAttr ? (
          <div className="p-8 text-center text-xs text-slate-400 glass-card ai-card-bg rounded-xl !border-[#e7ebf2]">
            Evaluating VASP graph paths and computing evidence strength scores...
          </div>
        ) : (
          <AttributionPanel attributions={filteredAttributions} />
        )}
      </div>

      {/* Section 3: VASP Legal Disclosure & SAHYOG Quick Bridge */}
      <div className="glass-card ai-card-bg p-6 space-y-4 !border-[#e7ebf2]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-[#9a7547]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">
                LEA Lawful Inter-Agency Summons Preparation (Section 91 CrPC)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Prepare cryptographically signed Section 91 CrPC lawful disclosure summons directed to candidate VASPs.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 text-xs font-bold font-mono">
            SAHYOG Integration Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-[#e7ebf2] space-y-2">
            <span className="font-bold text-slate-700 uppercase block text-[11px]">Target Entity</span>
            <div className="text-sm font-bold text-slate-900">Binance International Compliance</div>
            <div className="text-slate-500 text-[11px]">Jurisdiction: FIU-IND Registered VASP</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-[#e7ebf2] space-y-2">
            <span className="font-bold text-slate-700 uppercase block text-[11px]">Evidence Basis</span>
            <div className="text-sm font-bold text-[#9a7547]">95.4% Evidence Strength</div>
            <div className="text-slate-500 text-[11px]">SHA-256 Proof Digest Attached</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-[#e7ebf2] space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-700 uppercase block text-[11px]">Action</span>
              <div className="text-slate-500 text-[11px]">Generate section 91 summons draft with LEA token</div>
            </div>
            <SpecularButton
              onClick={() => navigate('/reports')}
              size="xs"
              radius={10}
              tint="#9a7547"
              tintOpacity={1}
              textColor="#ffffff"
              lineColor="#ffffff"
              baseColor="#b48c58"
              intensity={1.5}
              idleIntensity={0.5}
              glow={1.4}
              speed={0.4}
              autoAnimate={true}
              followMouse={true}
              className="mt-2 font-bold cursor-pointer hover:brightness-110 shadow-xs w-full"
              title="Open Section 91 Summons Draft"
            >
              <span>Open Report &amp; Summons Draft</span>
              <ArrowRight className="h-3.5 w-3.5 text-white/80" />
            </SpecularButton>
          </div>
        </div>
      </div>
    </div>
  );
};

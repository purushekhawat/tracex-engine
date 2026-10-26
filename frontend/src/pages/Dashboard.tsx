import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Network,
  Building2,
  ArrowUpRight,
  AlertTriangle,
  ArrowRight,
  Brain,
  Activity,
  Flame,
  Clock,
  Sparkles,
  ChevronsUpDown,
  FileText,
  Shield,
} from 'lucide-react';
import { DemoLoaderModal } from '../components/DemoLoaderModal';
import SpecularButton from '../components/SpecularButton';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const casesToDisplay = [
    {
      id: 'inv-demo-investment-fraud-2026',
      case_number: 'CASE-2026-DEMO-001',
      title: 'Operation DarkFlow - Cross-Chain Laundering',
      subject_name: 'Vikram Sethi (Victim File #99001)',
      wallet: '0x111111111111111111111111111111111111DEMO',
      chain: 'Ethereum',
      status: 'Investigating',
      priority: 'CRITICAL',
      flagged_volume: 142500,
      risk_score: '88.5%',
      attributed_vasp: 'Binance International',
      vasp_score: '95.4 / 100',
      typology: 'Peeling Chain & High Velocity',
    },
    {
      id: 'inv-demo-cross-chain-2026',
      case_number: 'CASE-2026-DEMO-002',
      title: 'Operation RansomShield - Cross-Chain Evasion',
      subject_name: 'Sunita Devi (Victim File #99002)',
      wallet: '0x222222222222222222222222222222222222DEMO',
      chain: 'Ethereum → TRON',
      status: 'Lien Placed',
      priority: 'CRITICAL',
      flagged_volume: 310000,
      risk_score: '92.0%',
      attributed_vasp: 'OKX TRON Hot Wallet',
      vasp_score: '91.2 / 100',
      typology: 'Stargate Bridge Relay & Pass-Through',
    },
    {
      id: 'inv-demo-003',
      case_number: 'CASE-2026-003',
      title: 'High-Volume Layering Pass-Through',
      subject_name: 'Karan Malhotra (Victim File #99003)',
      wallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      chain: 'Ethereum',
      status: 'Under Review',
      priority: 'HIGH',
      flagged_volume: 85000,
      risk_score: '74.0%',
      attributed_vasp: 'CoinDCX India',
      vasp_score: '82.5 / 100',
      typology: 'Structuring / Fan-Out Smurfing',
    },
    {
      id: 'inv-demo-004',
      case_number: 'CASE-2026-004',
      title: 'Multi-Hop Offshore Mixer Inflow',
      subject_name: 'Anish Verma (Victim File #99004)',
      wallet: '0x3a4b9982cd11093e098dfb751b7401b5f6d89999',
      chain: 'TRON',
      status: 'Investigating',
      priority: 'HIGH',
      flagged_volume: 220000,
      risk_score: '84.2%',
      attributed_vasp: 'WazirX India',
      vasp_score: '86.0 / 100',
      typology: 'Mixer Inflow & Token Swap',
    },
    {
      id: 'inv-demo-005',
      case_number: 'CASE-2026-005',
      title: 'Telegram Impersonation Token Sweep',
      subject_name: 'Priya Sharma (Victim File #99005)',
      wallet: '0x8f2c1144882a1100998dfb751b7401b5f6d88888',
      chain: 'Ethereum',
      status: 'Reported',
      priority: 'MEDIUM',
      flagged_volume: 95000,
      risk_score: '69.0%',
      attributed_vasp: 'Kraken Global Pool',
      vasp_score: '78.4 / 100',
      typology: 'Direct Inflow Clustering',
    },
  ];

  const handleSelectAll = () => {
    if (selectedRows.length === casesToDisplay.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(casesToDisplay.map((c) => c.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome / Command Center Banner */}
      <div className="glass-card ai-card-bg p-6 sm:p-7 relative overflow-hidden !border-[#e7ebf2]">
        <div className="topo-lines" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#9a7547]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Cryptocurrency Forensic & VASP Attribution Engine
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed font-medium">
              Real-time multi-hop traversal of suspect cryptocurrency wallets, explainable Proof-of-Attribution (PoAE), automated inter-agency legal summons drafting, and court-admissible forensic audit trail.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <DemoLoaderModal buttonStyle="hero" />
            <Link
              to="/dashboard/cross-chain-trace"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9a7547] hover:bg-[#86633a] text-white font-bold text-xs transition shadow-xs"
            >
              <Network className="h-4 w-4" />
              Launch Cross-Chain Trace
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 AI Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Cases */}
        <div className="glass-card ai-card-bg p-6 space-y-3 relative overflow-hidden group !border-[#e7ebf2]">
          <div className="topo-lines" />
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#9a7547]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Active LEA Cases</span>
            <div className="w-8 h-8 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-[#9a7547] tracking-tight">
              1,428
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#9a7547] inline" /> Verified Multi-Hop Ingestion
            </p>
          </div>
        </div>

        {/* Card 2: Flagged Loss / Volume */}
        <div className="glass-card ai-card-bg p-6 space-y-3 relative overflow-hidden group !border-[#e7ebf2]">
          <div className="topo-lines" />
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#9a7547]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Flagged Volume</span>
            <div className="w-8 h-8 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-[#9a7547] tracking-tight">
              $4,520,000
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-[#9a7547] inline" /> High-Risk Peel Layering
            </p>
          </div>
        </div>

        {/* Card 3: Active Threat Flags */}
        <div className="glass-card ai-card-bg p-6 space-y-3 relative overflow-hidden group !border-[#e7ebf2]">
          <div className="topo-lines" />
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#9a7547]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Active Typology Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-[#9a7547] tracking-tight">14</div>
            <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#9a7547] inline" /> Interception Priority
            </p>
          </div>
        </div>

        {/* Card 4: Top PoAE Evidence Score */}
        <div className="glass-card ai-card-bg p-6 space-y-3 relative overflow-hidden group !border-[#e7ebf2]">
          <div className="topo-lines" />
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#9a7547]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">PoAE Evidence Score</span>
            <div className="w-8 h-8 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-black text-[#9a7547] tracking-tight">95.4%</div>
            <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#9a7547] inline" /> Binance Hot Wallet Attributed
            </p>
          </div>
        </div>
      </div>

      {/* 3 Major Module Fast Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: VASP Intelligence */}
        <Link
          to="/dashboard/vasp-intelligence"
          className="glass-card ai-card-bg p-6 !border-[#e7ebf2] hover:!border-[#9a7547]/40 transition group space-y-2.5 block"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-[#9a7547] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#9a7547] transition">
            VASP Intelligence Dashboard
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Connected wallets, transaction paths, graph relationships and Proof-of-Attribution (PoAE) analysis.
          </p>
          <div className="pt-1 text-[11px] text-[#9a7547] font-bold">
            &bull; 8 VASP Pools Identified &bull; 95.4% Max Score
          </div>
        </Link>

        {/* Card 2: Cross-Chain Trace Graph */}
        <Link
          to="/dashboard/cross-chain-trace"
          className="glass-card ai-card-bg p-6 !border-[#e7ebf2] hover:!border-[#9a7547]/40 transition group space-y-2.5 block"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Network className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-[#9a7547] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#9a7547] transition">
            Cross-Chain Trace Graph
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Interactive visualization of fund flows, wallet clusters, and cross-chain bridge movements.
          </p>
          <div className="pt-1 text-[11px] text-[#9a7547] font-bold">
            &bull; Cytoscape Visualizer &bull; ETH &rarr; TRON Stargate
          </div>
        </Link>

        {/* Card 3: ML Algorithm Research Documentation */}
        <Link
          to="/research/ml-algorithm"
          className="glass-card ai-card-bg p-6 !border-[#e7ebf2] hover:!border-[#9a7547]/40 transition group space-y-2.5 block"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Brain className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-[#9a7547] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Document <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#9a7547] transition">
            ML Algorithm Research Document
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            PoAE 8-factor formula, NetworkX traversal algorithms, laundering typologies, and court admissibility.
          </p>
          <div className="pt-1 text-[11px] text-[#9a7547] font-bold">
            &bull; Interactive PoAE Simulator &bull; Formula Specs
          </div>
        </Link>
      </div>

      {/* FULL-WIDTH Law Enforcement Case Registry & Suspicious Wallets Table */}
      <div className="glass-card ai-card-bg table-card w-full relative overflow-hidden !border-[#e7ebf2] hover:!border-[#e7ebf2]">
        {/* Table Header Section Title */}
        <div className="px-6 pt-5 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10 border-b border-slate-100/70">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#9a7547]" />
              Law Enforcement Case Registry &amp; Suspicious Wallets
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Live Case Ingestion Queue • Multi-Hop Attribution &amp; Interception Feed
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 text-xs font-bold">
            {casesToDisplay.length} Cases Active
          </span>
        </div>

        {/* Table Canvas - Full Width without side scrolling */}
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="border-none bg-white">
                {/* Checkbox Header */}
                <th className="py-3.5 pl-4 sm:pl-6 pr-2 w-12 text-center bg-white border-none">
                  <div
                    onClick={handleSelectAll}
                    className={`w-4 h-4 rounded-full border-2 mx-auto cursor-pointer transition-colors ${
                      selectedRows.length === casesToDisplay.length
                        ? 'border-[#9a7547] bg-[#9a7547]'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  />
                </th>

                {/* Case # */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1 select-none cursor-pointer">
                    <span>Case #</span>
                    <span className="text-[#9a7547] font-bold text-sm leading-none">^</span>
                  </div>
                </th>

                {/* Subject File */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Victim / Subject File</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Suspect Wallet Address */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Suspect Wallet</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Blockchain */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Chain</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Flagged Volume */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Volume (USD)</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Attributed VASP */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Attributed VASP</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* PoAE Score */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>PoAE Score</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Status */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Status</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Action */}
                <th className="py-3.5 pl-2 pr-4 sm:pr-6 text-xs font-semibold text-slate-700 text-center whitespace-nowrap bg-white border-none">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-slate-200/60 bg-white">
              {casesToDisplay.map((c) => {
                const isSelected = selectedRows.includes(c.id);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors last:border-b-0">
                    {/* Selector Circle */}
                    <td className="py-3.5 pl-4 sm:pl-6 pr-2 text-center border-none">
                      <div
                        onClick={() => toggleSelectRow(c.id)}
                        className={`w-4 h-4 rounded-full border-2 mx-auto cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-[#9a7547] bg-[#9a7547]'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      />
                    </td>

                    {/* Case # in Golden Theme */}
                    <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                      <span className="text-sm font-bold text-[#9a7547] tracking-tight">
                        {c.case_number}
                      </span>
                    </td>

                    {/* Subject / Victim File */}
                    <td className="py-3.5 px-2.5 sm:px-3 border-none">
                      <span className="font-bold text-sm text-slate-900 tracking-tight block truncate max-w-[160px] 2xl:max-w-none" title={c.subject_name}>
                        {c.subject_name}
                      </span>
                    </td>

                    {/* Suspect Wallet */}
                    <td className="py-3.5 px-2.5 sm:px-3 border-none">
                      <span className="text-xs font-bold text-slate-700 font-mono tracking-tight block truncate max-w-[130px] 2xl:max-w-none" title={c.wallet}>
                        {c.wallet.slice(0, 10)}...{c.wallet.slice(-4)}
                      </span>
                    </td>

                    {/* Chain */}
                    <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                      <span className="text-xs font-bold text-slate-800">
                        {c.chain}
                      </span>
                    </td>

                    {/* Volume (USD) */}
                    <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                      <span className="text-xs font-bold text-slate-800">
                        ${c.flagged_volume.toLocaleString()}
                      </span>
                    </td>

                    {/* Attributed VASP */}
                    <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                      <span className="text-xs font-bold text-[#9a7547]">
                        {c.attributed_vasp}
                      </span>
                    </td>

                    {/* PoAE Score */}
                    <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {c.vasp_score}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                      {c.status === 'Investigating' ? (
                        <span className="inline-block px-3 py-0.5 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-xs font-bold tracking-tight">
                          Investigating
                        </span>
                      ) : c.status === 'Lien Placed' ? (
                        <span className="inline-block px-3 py-0.5 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-xs font-bold leading-tight text-center tracking-tight">
                          Lien Placed
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold tracking-tight">
                          {c.status}
                        </span>
                      )}
                    </td>

                    {/* Action Column: Specular Button */}
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
                        title={`Inspect Trace for ${c.case_number}`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#fbf7f1]" />
                        <span>Trace Flow</span>
                        <ArrowRight className="w-3 h-3 text-[#fbf7f1]" />
                      </SpecularButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time Alerts Feed Section */}
      <div className="glass-card ai-card-bg p-6 space-y-4 !border-[#e7ebf2]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2">
            <Flame className="h-4 w-4 text-[#9a7547]" /> Live Threat Intelligence &amp; Bridge Feed
          </h2>
          <span className="h-2 w-2 rounded-full bg-[#9a7547] animate-pulse" title="Live stream active" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              type: 'CROSS_CHAIN_BRIDGE',
              severity: 'CRITICAL',
              time: '2 mins ago',
              desc: 'Ethereum EVM origin bridged 44.2 ETH to TRON USDT via Stargate Protocol.',
              badge: 'bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 font-mono',
            },
            {
              type: 'PEELING_CHAIN',
              severity: 'HIGH',
              time: '14 mins ago',
              desc: 'Sequential 3-hop peel chain detected forwarding $138,000 to Binance deposit pool.',
              badge: 'bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 font-mono',
            },
            {
              type: 'VASP_ATTRIBUTION',
              severity: 'CONFIRMED',
              time: '28 mins ago',
              desc: 'Proof-of-Attribution Engine calculated 95.4% evidence strength for Binance deposit pool.',
              badge: 'bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 font-mono',
            },
            {
              type: 'HIGH_VELOCITY',
              severity: 'MEDIUM',
              time: '1 hour ago',
              desc: 'Funds traversed 3 hops across 2 chains in under 135 minutes.',
              badge: 'bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 font-mono',
            },
          ].map((r, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#e7ebf2] bg-white space-y-1.5 hover:border-[#9a7547]/40 transition shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{r.type}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${r.badge}`}>
                  {r.severity}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{r.desc}</p>
              <div className="flex items-center justify-between pt-1.5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {r.time}
                </span>
                <Link to="/dashboard/cross-chain-trace" className="text-[#9a7547] font-bold hover:underline inline-flex items-center gap-1">
                  Inspect Trace &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

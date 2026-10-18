import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Network,
  Building2,
  ArrowUpRight,
  FolderGit2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Brain,
  Activity,
  Flame,
  Clock,
} from 'lucide-react';
import { DemoBadge } from '../components/DemoBadge';
import { DemoLoaderModal } from '../components/DemoLoaderModal';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome / Command Center Banner */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-medium">
                <ShieldAlert className="h-3.5 w-3.5 text-blue-600" /> Investigation Command Center
              </span>
              <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-medium">
                SIH 26182
              </span>
              <DemoBadge />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Investigation Command Center
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Real-time overview of suspicious wallets, VASP attribution, alerts and investigation status across heterogeneous blockchains.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DemoLoaderModal buttonStyle="hero" />
            <Link
              to="/dashboard/cross-chain-trace"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 transition shadow-sm"
            >
              <Network className="h-4 w-4" />
              Launch Cross-Chain Trace
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Major Module Fast Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: VASP Intelligence */}
        <Link
          to="/dashboard/vasp-intelligence"
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
            VASP Intelligence Dashboard
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2">
            Connected wallets, transaction paths, graph relationships and Proof-of-Attribution (PoAE) analysis.
          </p>
          <div className="pt-1 text-[11px] font-mono text-emerald-600 font-medium">
            &bull; 8 VASP Pools Identified &bull; 95.4% Max Score
          </div>
        </Link>

        {/* Card 2: Cross-Chain Trace Graph */}
        <Link
          to="/dashboard/cross-chain-trace"
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-purple-400 hover:shadow-md transition group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="h-9 w-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <Network className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono text-purple-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Explore <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition">
            Cross-Chain Trace Graph
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2">
            Interactive visualization of fund flows, wallet clusters, and cross-chain bridge movements.
          </p>
          <div className="pt-1 text-[11px] font-mono text-purple-600 font-medium">
            &bull; Cytoscape Visualizer &bull; ETH &rarr; TRON Stargate
          </div>
        </Link>

        {/* Card 3: ML Algorithm Research Documentation */}
        <Link
          to="/research/ml-algorithm"
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <Brain className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono text-emerald-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Document <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition">
            ML Algorithm Research Document
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2">
            PoAE 8-factor formula, NetworkX traversal algorithms, laundering typologies, and court admissibility.
          </p>
          <div className="pt-1 text-[11px] font-mono text-emerald-600 font-medium">
            &bull; Interactive PoAE Simulator &bull; Formula Specs
          </div>
        </Link>
      </div>

      {/* 5 Core Dashboard Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Widget 1: Active Cases */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase">Active Cases</span>
            <FolderGit2 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">4</div>
          <div className="text-[10px] text-emerald-600 font-mono">2 Critical Priority</div>
        </div>

        {/* Widget 2: Active Investigations */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase">Investigations</span>
            <Activity className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">12</div>
          <div className="text-[10px] text-cyan-600 font-mono">Multi-hop pipeline active</div>
        </div>

        {/* Widget 3: VASP Attributions */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase">VASP Attributions</span>
            <Building2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">8</div>
          <div className="text-[10px] text-emerald-600 font-mono">89.6% Avg Confidence</div>
        </div>

        {/* Widget 4: High-Risk Indicators */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase">High Risk Flags</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">15</div>
          <div className="text-[10px] text-rose-500 font-mono">Peel Chains & Velocity</div>
        </div>

        {/* Widget 5: Cross-Chain Events */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase">Cross-Chain Links</span>
            <Layers className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">6</div>
          <div className="text-[10px] text-purple-600 font-mono">ETH ↔ TRON Stargate</div>
        </div>
      </div>

      {/* Main Section: Suspicious Wallets Overview & Real-Time Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Suspicious Wallets & Investigation Status */}
        <div className="lg:col-span-2 rounded-xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase font-mono flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" /> Real-Time Suspicious Wallets Overview
            </h2>
            <Link to="/cases" className="text-xs text-blue-600 hover:underline font-mono">
              View All Cases &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'inv-demo-investment-fraud-2026',
                case_number: 'CASE-2026-DEMO-001',
                title: 'Operation DarkFlow - Cross-Chain Laundering',
                wallet: '0x111111111111111111111111111111111111DEMO',
                chain: 'Ethereum',
                status: 'COMPLETED',
                priority: 'CRITICAL',
                risk_score: '88.5 / 100',
                attributed_vasp: 'Binance International',
                vasp_score: '95.4 / 100',
                typology: 'Peeling Chain & High Velocity',
              },
              {
                id: 'inv-demo-cross-chain-2026',
                case_number: 'CASE-2026-DEMO-002',
                title: 'Operation RansomShield - Cross-Chain Evasion',
                wallet: '0x111111111111111111111111111111111111DEMO',
                chain: 'Ethereum → TRON',
                status: 'COMPLETED',
                priority: 'CRITICAL',
                risk_score: '92.0 / 100',
                attributed_vasp: 'OKX TRON Hot Wallet',
                vasp_score: '91.2 / 100',
                typology: 'Stargate Bridge Relay & Pass-Through',
              },
              {
                id: 'inv-demo-003',
                case_number: 'CASE-2026-003',
                title: 'High-Volume Layering Pass-Through',
                wallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
                chain: 'Ethereum',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                risk_score: '74.0 / 100',
                attributed_vasp: 'CoinDCX India',
                vasp_score: '82.5 / 100',
                typology: 'Structuring / Fan-Out Smurfing',
              },
            ].map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">{w.case_number}</span>
                    <span className="text-xs font-semibold text-slate-800">{w.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-mono font-bold">
                      {w.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono">
                      {w.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1 text-slate-500 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Suspect Wallet</span>
                    <span className="text-rose-600 font-semibold truncate block" title={w.wallet}>
                      {w.wallet.slice(0, 10)}...{w.wallet.slice(-4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Chain</span>
                    <span className="text-slate-800 font-medium">{w.chain}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Attributed VASP</span>
                    <span className="text-emerald-600 font-bold">{w.attributed_vasp}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">PoAE Score</span>
                    <span className="text-blue-600 font-bold">{w.vasp_score}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-slate-500">
                    Typology: <span className="text-slate-700 font-medium">{w.typology}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/dashboard/vasp-intelligence"
                      className="text-xs font-mono text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      VASP Intel &rarr;
                    </Link>
                    <Link
                      to="/dashboard/cross-chain-trace"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white font-sans text-xs hover:bg-blue-500 transition font-medium"
                    >
                      View Graph <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Real-Time Alerts Feed */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase font-mono flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-500" /> Investigation Alerts Feed
            </h2>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Live stream active" />
          </div>

          <div className="space-y-3">
            {[
              {
                type: 'CROSS_CHAIN_BRIDGE',
                severity: 'CRITICAL',
                time: '2 mins ago',
                desc: 'Ethereum EVM origin bridged 44.2 ETH to TRON USDT via Stargate Protocol.',
                badge: 'bg-purple-50 text-purple-700 border-purple-200',
              },
              {
                type: 'PEELING_CHAIN',
                severity: 'HIGH',
                time: '14 mins ago',
                desc: 'Sequential 3-hop peel chain detected forwarding $138,000 to Binance deposit pool.',
                badge: 'bg-rose-50 text-rose-700 border-rose-200',
              },
              {
                type: 'VASP_ATTRIBUTION',
                severity: 'CONFIRMED',
                time: '28 mins ago',
                desc: 'Proof-of-Attribution Engine calculated 95.4% evidence strength for Binance deposit pool.',
                badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              },
              {
                type: 'HIGH_VELOCITY',
                severity: 'MEDIUM',
                time: '1 hour ago',
                desc: 'Funds traversed 3 hops across 2 chains in under 135 minutes.',
                badge: 'bg-amber-50 text-amber-700 border-amber-200',
              },
            ].map((r, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-800">{r.type}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase border font-bold ${r.badge}`}>
                    {r.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">{r.desc}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {r.time}
                  </span>
                  <Link to="/dashboard/cross-chain-trace" className="text-blue-600 hover:underline">
                    Inspect &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

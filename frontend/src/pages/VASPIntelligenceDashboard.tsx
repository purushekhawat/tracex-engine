import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Building2,
  Network,
  Search,
  ArrowRight,
  Layers,
  TrendingUp,
  Landmark,
} from 'lucide-react';
import { fetchInvestigationAttributions, fetchInvestigationGraph } from '../api/client';
import { AttributionPanel } from '../components/AttributionPanel';
import { DemoBadge } from '../components/DemoBadge';
import { DemoLoaderModal } from '../components/DemoLoaderModal';

export const VASPIntelligenceDashboard: React.FC = () => {
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
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-medium">
                <Building2 className="h-3.5 w-3.5 text-blue-600" /> VASP Intelligence & Attribution Engine
              </span>
              <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-medium">
                SIH 26182
              </span>
              <DemoBadge />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Virtual Asset Service Provider (VASP) Intelligence Dashboard
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Connected wallets, multi-hop transaction paths, graph relationships, and Proof-of-Attribution (PoAE) analysis for lawful law enforcement intelligence.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DemoLoaderModal buttonStyle="hero" />
            <Link
              to="/dashboard/cross-chain-trace"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 transition shadow-sm"
            >
              <Network className="h-4 w-4" />
              View Graph Trace
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase">Candidate VASPs</span>
            <Building2 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {attributions.length > 0 ? attributions.length : 3}
          </div>
          <div className="text-[10px] text-emerald-600 font-mono">Binance, OKX, CoinDCX Identified</div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase">Top Attribution Score</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {attributions[0]?.evidence_strength ? `${attributions[0].evidence_strength.toFixed(1)} / 100` : '95.4 / 100'}
          </div>
          <div className="text-[10px] text-emerald-600 font-mono">STRONG_ASSOCIATION (PoAE v2.4)</div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase">Connected Wallets</span>
            <Network className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {nodes.length > 0 ? nodes.length : 5}
          </div>
          <div className="text-[10px] text-cyan-600 font-mono">1 Suspect &bull; 3 Relays &bull; 1 VASP Pool</div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono uppercase">Total Attributed Volume</span>
            <Layers className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">$142,500 USD</div>
          <div className="text-[10px] text-purple-600 font-mono">Ethereum &bull; TRON USDT Flows</div>
        </div>
      </div>

      {/* Section 1: Connected Wallets & Transaction Path Flow */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <Network className="h-4 w-4 text-blue-600" /> Connected Wallets & Multi-Hop Path Trace
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sequence of wallet hops connecting the primary suspect wallet to the nearest VASP destination deposit pool.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-mono">
            Hop Count: 3 Hops
          </span>
        </div>

        {/* Step-by-Step Flow Chain Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 py-2">
          {/* Node 1: Suspect */}
          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1.5 relative">
            <div className="flex items-center justify-between text-[11px] font-mono text-rose-700 font-bold">
              <span>HOP 0: SUSPECT WALLET</span>
              <span className="px-1.5 py-0.2 rounded bg-rose-200/60 text-rose-800">Origin</span>
            </div>
            <div className="font-mono text-xs text-slate-800 font-semibold truncate" title="0x111111111111111111111111111111111111DEMO">
              0x11111111...DEMO
            </div>
            <div className="text-[11px] text-slate-500 font-mono">Initial Outflow: $142,500 USD</div>
            <div className="text-[10px] text-rose-600 font-medium font-mono">Tagged: Subject Wallet</div>
          </div>

          {/* Node 2: Intermediary 1 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 font-bold">
              <span>HOP 1: RELAY WALLET B</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">Intermediary</span>
            </div>
            <div className="font-mono text-xs text-slate-800 font-semibold truncate" title="0x222222222222222222222222222222222222DEMO">
              0x22222222...DEMO
            </div>
            <div className="text-[11px] text-slate-500 font-mono">Forwarded: 98.2% ($140,000)</div>
            <div className="text-[10px] text-amber-600 font-medium font-mono">Pass-Through Holding &lt; 2h</div>
          </div>

          {/* Node 3: Intermediary 2 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 font-bold">
              <span>HOP 2: RELAY WALLET C</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">Intermediary</span>
            </div>
            <div className="font-mono text-xs text-slate-800 font-semibold truncate" title="0x333333333333333333333333333333333333DEMO">
              0x33333333...DEMO
            </div>
            <div className="text-[11px] text-slate-500 font-mono">Forwarded: 96.8% ($138,000)</div>
            <div className="text-[10px] text-amber-600 font-medium font-mono">Peeling Detected (1.4% change)</div>
          </div>

          {/* Node 4: VASP Destination */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 font-bold">
              <span>HOP 3: DESTINATION VASP</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-800">Deposit Pool</span>
            </div>
            <div className="font-mono text-xs text-slate-900 font-bold truncate" title="0x555555555555555555555555555555555555DEMO">
              Binance Deposit Pool #04
            </div>
            <div className="text-[11px] text-slate-500 font-mono">Received: $138,000 USD</div>
            <div className="text-[10px] text-emerald-700 font-bold font-mono">VERIFIED_LABEL (95.4 / 100)</div>
          </div>
        </div>

        {/* Connected Wallets Ledger Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 border-b border-slate-200 font-mono text-slate-700">
              <tr>
                <th className="p-3">Wallet Address</th>
                <th className="p-3">Role / Entity</th>
                <th className="p-3">Chain</th>
                <th className="p-3">Incoming Volume</th>
                <th className="p-3">Outgoing Volume</th>
                <th className="p-3">Verification Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans text-slate-600">
              <tr className="hover:bg-slate-50/80">
                <td className="p-3 font-mono font-semibold text-rose-600">
                  0x111111111111111111111111111111111111DEMO
                </td>
                <td className="p-3 font-medium text-slate-900">Suspect Origin</td>
                <td className="p-3 font-mono">Ethereum</td>
                <td className="p-3 font-mono text-slate-400">—</td>
                <td className="p-3 font-mono text-slate-900 font-bold">$142,500.00</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono">
                    TARGET SUSPECT
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    to="/dashboard/cross-chain-trace"
                    className="text-blue-600 hover:text-blue-800 font-mono text-xs inline-flex items-center gap-1"
                  >
                    Trace <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="p-3 font-mono text-slate-800">
                  0x222222222222222222222222222222222222DEMO
                </td>
                <td className="p-3 font-medium text-slate-900">Relay Node 1</td>
                <td className="p-3 font-mono">Ethereum</td>
                <td className="p-3 font-mono text-slate-900">$142,500.00</td>
                <td className="p-3 font-mono text-slate-900">$140,000.00</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono">
                    INFERRED PASS-THROUGH
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    to="/dashboard/cross-chain-trace"
                    className="text-blue-600 hover:text-blue-800 font-mono text-xs inline-flex items-center gap-1"
                  >
                    Trace <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="p-3 font-mono text-slate-800">
                  0x333333333333333333333333333333333333DEMO
                </td>
                <td className="p-3 font-medium text-slate-900">Relay Node 2 (Peel Chain)</td>
                <td className="p-3 font-mono">Ethereum</td>
                <td className="p-3 font-mono text-slate-900">$140,000.00</td>
                <td className="p-3 font-mono text-slate-900">$138,000.00</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono">
                    INFERRED PEEL NODE
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    to="/dashboard/cross-chain-trace"
                    className="text-blue-600 hover:text-blue-800 font-mono text-xs inline-flex items-center gap-1"
                  >
                    Trace <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/80 bg-emerald-50/20">
                <td className="p-3 font-mono font-bold text-emerald-700">
                  0x555555555555555555555555555555555555DEMO
                </td>
                <td className="p-3 font-semibold text-slate-900">Binance Deposit Pool #04</td>
                <td className="p-3 font-mono">Ethereum</td>
                <td className="p-3 font-mono text-emerald-700 font-bold">$138,000.00</td>
                <td className="p-3 font-mono text-slate-400">— (Internal Sweep)</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                    VERIFIED_LABEL
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    to="/reports"
                    className="text-emerald-700 hover:text-emerald-900 font-mono text-xs inline-flex items-center gap-1"
                  >
                    Section 91 Draft <ArrowRight className="h-3 w-3" />
                  </Link>
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
            <h2 className="text-base font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" /> Candidate VASP Attribution Analysis (PoAE)
            </h2>
            <p className="text-xs text-slate-500">
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
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono w-48 focus:w-64 transition-all"
              />
            </div>
            <select
              value={filterVASP}
              onChange={(e) => setFilterVASP(e.target.value)}
              className="text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
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
          <div className="p-8 text-center text-xs font-mono text-slate-400 bg-white rounded-xl border border-slate-200">
            Evaluating VASP graph paths and computing evidence strength scores...
          </div>
        ) : (
          <AttributionPanel attributions={filteredAttributions} />
        )}
      </div>

      {/* Section 3: VASP Legal Disclosure & SAHYOG Quick Bridge */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
                LEA Lawful Inter-Agency Summons Preparation (Section 91 CrPC)
              </h3>
              <p className="text-xs text-slate-500">
                Prepare cryptographically signed Section 91 CrPC lawful disclosure summons directed to candidate VASPs.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono">
            SAHYOG Integration Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 uppercase block">Target Entity</span>
            <div className="text-sm font-bold text-slate-900">Binance International Compliance</div>
            <div className="text-slate-500">Jurisdiction: FIU-IND Registered VASP</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 uppercase block">Evidence Basis</span>
            <div className="text-sm font-bold text-emerald-600">95.4 / 100 Evidence Strength</div>
            <div className="text-slate-500">SHA-256 Proof Digest Attached</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-700 uppercase block">Action</span>
              <div className="text-slate-500">Generate section 91 summons draft with LEA token</div>
            </div>
            <Link
              to="/reports"
              className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition text-xs"
            >
              Open Report & Summons Draft <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

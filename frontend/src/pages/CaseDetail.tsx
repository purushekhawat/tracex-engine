import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Network, Building2, ArrowUpRight, DollarSign, User, Tag } from 'lucide-react';
import { DemoBadge } from '../components/DemoBadge';

export const CaseDetail: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Case Header */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-600">#CASE-2026-001</span>
              <span className="px-2.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 text-xs font-mono">
                HIGH PRIORITY
              </span>
              <DemoBadge />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Operation DarkFlow - Cross-Chain Laundering
            </h1>
            <p className="text-xs text-slate-500">
              Synthetic investigation tracking ransomware payload dispersal through multi-hop peel chains to VASP deposit infrastructure.
            </p>
          </div>
          <Link
            to={`/investigations/i1111111-1111-1111-1111-111111111111/graph`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 transition shadow-lg shadow-blue-500/20 shrink-0"
          >
            <Network className="h-4 w-4" />
            Launch Interactive Graph Visualizer
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
              <User className="h-3 w-3" /> Lead Investigator
            </div>
            <div className="font-semibold text-slate-700">Inspector Sharma (Badge: LEA-8849)</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" /> Target Suspect Wallet
            </div>
            <div className="font-mono font-semibold text-rose-500 truncate">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
              <Network className="h-3 w-3" /> Blockchain Network
            </div>
            <div className="font-semibold text-blue-600">Ethereum Mainnet (Chain ID: 1)</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Total Value Analyzed
            </div>
            <div className="font-semibold text-emerald-600">$32,000.00 USD (10.0 ETH)</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Top VASP Candidates & Case Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Top VASP Candidates */}
        <div className="lg:col-span-2 rounded-xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase font-mono flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="h-4 w-4 text-emerald-500" /> Top Matched VASP Candidates (PoAE Engine Output)
          </h2>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  Binance International
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-mono">
                    STRONG_ASSOCIATION
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Verified Exchange Hot Deposit Wallet: 0x28C6c06298d514Db089934071355E5743bf21d60</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600 font-mono">89.6%</div>
                <div className="text-[10px] text-slate-400 font-mono">Evidence Score</div>
              </div>
            </div>

            <div className="p-3 rounded bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-700 font-mono">Confidence Basis Reasons:</div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-500 text-[11px]">
                <li>Direct verified deposit hot wallet label found for destination 0x28C6c062...</li>
                <li>High value flow continuity (98.0% of suspect funds reached destination)</li>
                <li>3-hop traversal path completed within 24 hours</li>
                <li>Recurring transaction history (3 transfers detected)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Quick Links & Case Tags */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase font-mono flex items-center gap-2 border-b border-slate-100 pb-3">
            <Tag className="h-4 w-4 text-cyan-500" /> Case Details &amp; Tags
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Tags</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {['ransomware', 'peel-chain', 'vasp-attribution', 'ethereum'].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-600 font-mono text-[10px]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to={`/investigations/i1111111-1111-1111-1111-111111111111/graph`}
                className="w-full py-2 px-3 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center justify-between transition"
              >
                <span>Transaction Flow Graph</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                to={`/investigations/i1111111-1111-1111-1111-111111111111/attribution`}
                className="w-full py-2 px-3 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center justify-between transition"
              >
                <span>Proof of Attribution Scorecard</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                to={`/investigations/i1111111-1111-1111-1111-111111111111/risk`}
                className="w-full py-2 px-3 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center justify-between transition"
              >
                <span>Risk &amp; Typology Flags</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                to={`/reports`}
                className="w-full py-2 px-3 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center justify-between transition"
              >
                <span>Generate Legal Forensic Report</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

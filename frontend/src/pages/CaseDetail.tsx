import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Network, Building2, ArrowUpRight, DollarSign, User, Tag, ArrowRight } from 'lucide-react';
import SpecularButton from '../components/SpecularButton';

export const CaseDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Case Header */}
      <div className="glass-card ai-card-bg p-6 sm:p-7 relative overflow-hidden !border-[#e7ebf2] space-y-4">
        <div className="topo-lines" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#9a7547] bg-[#fbf7f1] border border-[#9a7547]/30 px-3 py-1 rounded-full font-mono">
                #CASE-2026-001
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-xs font-bold">
                HIGH PRIORITY
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
              Operation DarkFlow - Cross-Chain Laundering
            </h1>
            <p className="text-xs text-slate-500 font-medium max-w-2xl">
              Synthetic investigation tracking ransomware payload dispersal through multi-hop peel chains to VASP deposit infrastructure.
            </p>
          </div>
          <SpecularButton
            onClick={() => navigate('/investigations/i1111111-1111-1111-1111-111111111111/graph')}
            size="sm"
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
            className="font-bold cursor-pointer hover:brightness-110 shadow-xs shrink-0"
            title="Launch Interactive Graph Visualizer"
          >
            <Network className="h-4 w-4" />
            <span>Launch Graph Visualizer</span>
            <ArrowRight className="h-3.5 w-3.5 text-white/80" />
          </SpecularButton>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs relative z-10">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <User className="h-3 w-3" /> Lead Investigator
            </div>
            <div className="font-bold text-slate-800">Inspector Sharma (LEA-8849)</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" /> Target Suspect Wallet
            </div>
            <div className="font-mono font-bold text-[#9a7547] truncate">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <Network className="h-3 w-3" /> Blockchain Network
            </div>
            <div className="font-bold text-[#9a7547]">Ethereum Mainnet (Chain ID: 1)</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Total Value Analyzed
            </div>
            <div className="font-bold text-slate-900">$32,000.00 USD (10.0 ETH)</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Top VASP Candidates & Case Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Top VASP Candidates */}
        <div className="lg:col-span-2 glass-card ai-card-bg p-6 space-y-4 !border-[#e7ebf2]">
          <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="h-4 w-4 text-[#9a7547]" /> Top Matched VASP Candidates (PoAE Engine Output)
          </h2>

          <div className="p-5 rounded-xl bg-white border border-[#e7ebf2] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  Binance International
                  <span className="px-2.5 py-0.5 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[10px] font-bold">
                    STRONG_ASSOCIATION
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Verified Exchange Hot Deposit Wallet: 0x28C6c06298d514Db089934071355E5743bf21d60</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-[#9a7547]">89.6%</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Evidence Score</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fbf7f1] border border-[#9a7547]/20 text-xs text-slate-700 space-y-1.5">
              <div className="font-bold text-[#9a7547] text-[11px] uppercase">Confidence Basis Reasons:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs font-medium">
                <li>Direct verified deposit hot wallet label found for destination 0x28C6c062...</li>
                <li>High value flow continuity (98.0% of suspect funds reached destination)</li>
                <li>3-hop traversal path completed within 24 hours</li>
                <li>Recurring transaction history (3 transfers detected)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Quick Links & Case Tags */}
        <div className="glass-card ai-card-bg p-6 space-y-4 !border-[#e7ebf2]">
          <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2 border-b border-slate-100 pb-3">
            <Tag className="h-4 w-4 text-[#9a7547]" /> Case Details &amp; Tags
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tags</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {['ransomware', 'peel-chain', 'vasp-attribution', 'ethereum'].map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-[#fbf7f1] border border-[#9a7547]/25 text-[#9a7547] text-[11px] font-bold">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to={`/investigations/i1111111-1111-1111-1111-111111111111/graph`}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-[#fbf7f1] text-slate-700 hover:text-[#9a7547] text-xs font-bold flex items-center justify-between transition border border-[#e7ebf2]"
              >
                <span>Transaction Flow Graph</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                to={`/investigations/i1111111-1111-1111-1111-111111111111/attribution`}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-[#fbf7f1] text-slate-700 hover:text-[#9a7547] text-xs font-bold flex items-center justify-between transition border border-[#e7ebf2]"
              >
                <span>Proof of Attribution Scorecard</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                to={`/investigations/i1111111-1111-1111-1111-111111111111/risk`}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-[#fbf7f1] text-slate-700 hover:text-[#9a7547] text-xs font-bold flex items-center justify-between transition border border-[#e7ebf2]"
              >
                <span>Risk &amp; Typology Flags</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link
                to={`/reports`}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-xs font-bold flex items-center justify-between transition hover:bg-[#9a7547] hover:text-white"
              >
                <span>Generate Legal Forensic Report</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

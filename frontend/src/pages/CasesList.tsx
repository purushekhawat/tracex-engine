import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, ArrowUpRight, Search, Plus } from 'lucide-react';
import { DemoBadge } from '../components/DemoBadge';
import { StartInvestigationModal } from '../components/StartInvestigationModal';

export const CasesList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <StartInvestigationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <FolderGit2 className="h-6 w-6 text-blue-500" />
              Law Enforcement Case Registry
            </h1>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Active illicit cryptocurrency transaction investigation case files.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition shadow-lg shadow-blue-500/20"
        >
          <Plus className="h-4 w-4" />
          Create New Case &amp; Start Analysis
        </button>
      </div>

      {/* Case Table List */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search cases by case number, suspect wallet, or title..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
              <tr>
                <th className="p-3.5">Case Number</th>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Suspect Address</th>
                <th className="p-3.5">Chain</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Top VASP Match</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {[
                {
                  id: 'c1111111-1111-1111-1111-111111111111',
                  case_number: 'CASE-2026-001',
                  title: 'Operation DarkFlow - Cross-Chain Laundering',
                  suspect: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
                  chain: 'Ethereum',
                  priority: 'HIGH',
                  vasp: 'Binance International',
                  status: 'IN_PROGRESS',
                },
                {
                  id: 'c2222222-2222-2222-2222-222222222222',
                  case_number: 'CASE-2026-002',
                  title: 'Operation RansomShield - TRON USDT Dispersal',
                  suspect: 'TLsV52sRDL79HXGGm9yzwKibbP4zDCDbvU',
                  chain: 'TRON',
                  priority: 'CRITICAL',
                  vasp: 'WazirX India',
                  status: 'IN_PROGRESS',
                },
              ].map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-blue-600">{c.case_number}</td>
                  <td className="p-3.5 font-sans font-medium text-slate-700">{c.title}</td>
                  <td className="p-3.5 text-slate-600">{c.suspect.slice(0, 10)}...</td>
                  <td className="p-3.5 text-blue-500">{c.chain}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 text-[10px]">
                      {c.priority}
                    </span>
                  </td>
                  <td className="p-3.5 text-emerald-600 font-sans">{c.vasp}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px]">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-sans">
                    <Link
                      to={`/cases/${c.id}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 font-semibold"
                    >
                      Open Case <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

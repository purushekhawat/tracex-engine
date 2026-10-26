import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  ArrowRight,
  Search,
  Plus,
  ChevronsUpDown,
  Sparkles,
} from 'lucide-react';
import { DemoBadge } from '../components/DemoBadge';
import { StartInvestigationModal } from '../components/StartInvestigationModal';
import SpecularButton from '../components/SpecularButton';

export const CasesList: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const mockCases = [
    {
      id: 'c1111111-1111-1111-1111-111111111111',
      case_number: 'CASE-2026-001',
      title: 'Operation DarkFlow - Cross-Chain Laundering',
      suspect: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      victim: 'Vikram Sethi (NCRP-99001)',
      chain: 'Ethereum',
      priority: 'CRITICAL',
      vasp: 'Binance International',
      loss_amount: 150000,
      status: 'Investigating',
    },
    {
      id: 'c2222222-2222-2222-2222-222222222222',
      case_number: 'CASE-2026-002',
      title: 'Operation RansomShield - TRON USDT Dispersal',
      suspect: 'TLsV52sRDL79HXGGm9yzwKibbP4zDCDbvU',
      victim: 'Sunita Devi (NCRP-99002)',
      chain: 'TRON',
      priority: 'CRITICAL',
      vasp: 'OKX TRON Hot Wallet',
      loss_amount: 450000,
      status: 'Lien Placed',
    },
    {
      id: 'c3333333-3333-3333-3333-333333333333',
      case_number: 'CASE-2026-003',
      title: 'Investment Scam - Rapid Pass-Through',
      suspect: '0x3a4b9982cd11093e098dfb751b7401b5f6d89999',
      victim: 'Karan Malhotra (NCRP-99003)',
      chain: 'Ethereum',
      priority: 'HIGH',
      vasp: 'CoinDCX India',
      loss_amount: 85000,
      status: 'Under Review',
    },
    {
      id: 'c4444444-4444-4444-4444-444444444444',
      case_number: 'CASE-2026-004',
      title: 'UPI Phishing - Multi-Hop Peel Node Routing',
      suspect: '0x8f2c1144882a1100998dfb751b7401b5f6d88888',
      victim: 'Anish Verma (NCRP-99004)',
      chain: 'Ethereum',
      priority: 'HIGH',
      vasp: 'WazirX India',
      loss_amount: 220000,
      status: 'Investigating',
    },
    {
      id: 'c5555555-5555-5555-5555-555555555555',
      case_number: 'CASE-2026-005',
      title: 'Offshore P2P Token Exfiltration',
      suspect: '0x28C6c06298d514Db089934071355E5743bf21d60',
      victim: 'Priya Sharma (NCRP-99005)',
      chain: 'TRON',
      priority: 'MEDIUM',
      vasp: 'Kraken Global',
      loss_amount: 95000,
      status: 'Reported',
    },
  ];

  const filteredCases = mockCases.filter(
    (c) =>
      c.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.suspect.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vasp.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedRows.length === filteredCases.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredCases.map((c) => c.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <StartInvestigationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7ebf2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FolderGit2 className="h-6 w-6 text-[#9a7547]" />
              Law Enforcement Case Registry
            </h1>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Active illicit cryptocurrency transaction investigation case files &amp; multi-agency coordination logs.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9a7547] hover:bg-[#86633a] text-xs font-bold text-white transition shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create New Case &amp; Start Analysis
        </button>
      </div>

      {/* Case Table List */}
      <div className="glass-card ai-card-bg table-card w-full relative overflow-hidden !border-[#e7ebf2] hover:!border-[#e7ebf2]">
        {/* Table Search & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search cases by case number, suspect wallet, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50/70 border border-[#e7ebf2] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9a7547] focus:ring-1 focus:ring-[#9a7547]/20 font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 text-xs font-bold">
              {filteredCases.length} Cases Listed
            </span>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="border-none bg-white">
                {/* Selector */}
                <th className="py-3.5 pl-4 sm:pl-6 pr-2 w-12 text-center bg-white border-none">
                  <div
                    onClick={handleSelectAll}
                    className={`w-4 h-4 rounded-full border-2 mx-auto cursor-pointer transition-colors ${
                      selectedRows.length === filteredCases.length && filteredCases.length > 0
                        ? 'border-[#9a7547] bg-[#9a7547]'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  />
                </th>

                {/* Case Number */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1 select-none cursor-pointer">
                    <span>Case #</span>
                    <span className="text-[#9a7547] font-bold text-sm leading-none">^</span>
                  </div>
                </th>

                {/* Title */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Title / Operation</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Suspect Address */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Suspect Address</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Chain */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Chain</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Loss Amount */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Loss Amount</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>

                {/* Top VASP Match */}
                <th className="py-3.5 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">
                  <div className="flex items-center gap-1.5 select-none cursor-pointer">
                    <span>Top VASP Match</span>
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
              {filteredCases.map((c) => {
                const isSelected = selectedRows.includes(c.id);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors last:border-b-0">
                    {/* Checkbox */}
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

                    {/* Case Number in Golden Theme */}
                    <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                      <span className="text-sm font-bold text-[#9a7547] tracking-tight">
                        {c.case_number}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-2.5 sm:px-3 border-none">
                      <span className="font-bold text-sm text-slate-900 tracking-tight block truncate max-w-[200px] 2xl:max-w-none" title={c.title}>
                        {c.title}
                      </span>
                    </td>

                    {/* Suspect Address */}
                    <td className="py-3.5 px-2.5 sm:px-3 border-none">
                      <span className="text-xs font-bold text-slate-700 font-mono tracking-tight block truncate max-w-[130px] 2xl:max-w-none" title={c.suspect}>
                        {c.suspect.slice(0, 10)}...{c.suspect.slice(-4)}
                      </span>
                    </td>

                    {/* Chain */}
                    <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                      <span className="text-xs font-bold text-slate-800">
                        {c.chain}
                      </span>
                    </td>

                    {/* Loss Amount */}
                    <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                      <span className="text-xs font-bold text-slate-800">
                        ₹{c.loss_amount.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* VASP */}
                    <td className="py-3.5 px-2.5 sm:px-3 whitespace-nowrap border-none">
                      <span className="text-xs font-bold text-[#9a7547]">
                        {c.vasp}
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
                        onClick={() => navigate(`/cases/${c.id}`)}
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
                        title={`Open Case Dossier ${c.case_number}`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#fbf7f1]" />
                        <span>Open Case</span>
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
    </div>
  );
};

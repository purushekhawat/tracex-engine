import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Play, ShieldAlert, X, RefreshCw, CheckCircle2 } from 'lucide-react';
import { startInvestigation, fetchInvestigationProgress, InvestigationProgress } from '../api/client';

interface StartInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCaseId?: string;
}

export const StartInvestigationModal: React.FC<StartInvestigationModalProps> = ({
  isOpen,
  onClose,
  defaultCaseId = 'c1111111-1111-1111-1111-111111111111',
}) => {
  const [suspectWallet, setSuspectWallet] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [blockchain, setBlockchain] = useState('ethereum');
  const [maxHops, setMaxHops] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeInvId, setActiveInvId] = useState<string | null>(null);
  const [progress, setProgress] = useState<InvestigationProgress | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: any = null;
    if (activeInvId) {
      interval = setInterval(async () => {
        try {
          const prog = await fetchInvestigationProgress(activeInvId);
          setProgress(prog);
          if (prog.status === 'COMPLETED') {
            clearInterval(interval);
            setTimeout(() => {
              onClose();
              navigate(`/investigations/${activeInvId}/graph`);
            }, 1000);
          }
        } catch (e) {
          console.error(e);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [activeInvId, navigate, onClose]);

  if (!isOpen) return null;

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectWallet.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await startInvestigation({
        case_id: defaultCaseId,
        wallet_address: suspectWallet.trim(),
        blockchain,
        max_hops: maxHops,
      });
      setActiveInvId(res.investigation_id);
    } catch (err: any) {
      alert(`Failed to start investigation: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  const presetChips = [
    { label: 'Demo EVM Wallet (Binance Flow)', wallet: '0x111111111111111111111111111111111111DEMO', chain: 'ethereum' },
    { label: 'Demo Cross-Chain (TRON OKX Flow)', wallet: '0x555555555555555555555555555555555555DEMO', chain: 'ethereum' },
    { label: 'Sample Ethereum Ransomware Wallet', wallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', chain: 'ethereum' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 p-6 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
              MULTI-HOP GRAPH INGESTION
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Network className="h-5 w-5 text-blue-600" /> Start New Multi-Hop Investigation
          </h2>
          <p className="text-xs text-slate-500">
            Enter suspect wallet address, select target blockchain, and specify traversal hop depth.
          </p>
        </div>

        {!activeInvId ? (
          <form onSubmit={handleStart} className="space-y-4">
            {/* Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-500 uppercase">Preset Sample Addresses</label>
              <div className="flex flex-wrap gap-1.5">
                {presetChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSuspectWallet(chip.wallet);
                      setBlockchain(chip.chain);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 text-blue-600 font-mono text-[10px] text-left transition"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Suspect Wallet Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-700 font-semibold uppercase flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-500" /> Suspect Wallet Address
              </label>
              <input
                type="text"
                value={suspectWallet}
                onChange={(e) => setSuspectWallet(e.target.value)}
                placeholder="0x... or T..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-3.5 py-2 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none"
                required
              />
            </div>

            {/* Blockchain & Hop Depth */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-500 uppercase">Target Blockchain</label>
                <select
                  value={blockchain}
                  onChange={(e) => setBlockchain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none"
                >
                  <option value="ethereum">Ethereum (EVM)</option>
                  <option value="tron">TRON (TRC-20)</option>
                  <option value="bitcoin">Bitcoin (BTC)</option>
                  <option value="polygon">Polygon (MATIC)</option>
                  <option value="solana">Solana (SOL)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-500 uppercase">Max Depth Hops ({maxHops})</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={maxHops}
                  onChange={(e) => setMaxHops(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-3"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Ingesting...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" /> Start Analysis
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Live Progress View */
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-600 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" /> Pipeline Status: {progress?.status || 'RUNNING'}
              </span>
              <span className="text-xs font-mono text-emerald-600 font-bold">
                {progress?.progress_percent ? progress.progress_percent.toFixed(0) : 10}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
                style={{ width: `${progress?.progress_percent || 15}%` }}
              />
            </div>

            <div className="p-3 rounded bg-white border border-slate-200 text-xs font-mono text-slate-700 space-y-1">
              <div>Hop Level: <span className="text-blue-600 font-bold">{progress?.current_hop || 1} / {progress?.max_hops || maxHops}</span></div>
              <div>Message: <span className="text-slate-500">{progress?.message || 'Processing multi-hop graph nodes...'}</span></div>
            </div>

            {progress?.status === 'COMPLETED' && (
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-600 font-bold animate-pulse pt-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Ingestion Completed! Redirecting to Cytoscape Visualizer...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

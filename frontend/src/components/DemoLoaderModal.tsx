import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, Layers, ArrowRight, X, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { loadDemoInvestmentFraud, loadDemoCrossChain } from '../api/client';
import { DemoBadge } from './DemoBadge';

interface DemoLoaderProps {
  buttonStyle?: 'header' | 'hero' | 'compact';
}

export const DemoLoaderModal: React.FC<DemoLoaderProps> = ({ buttonStyle = 'header' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLoadScenario = async (type: 'INVESTMENT_FRAUD' | 'CROSS_CHAIN') => {
    try {
      setLoadingScenario(type);
      const res = type === 'INVESTMENT_FRAUD' ? await loadDemoInvestmentFraud() : await loadDemoCrossChain();
      setIsOpen(false);
      setActiveNotification(`Loaded ${res.scenario} Synthetic Investigation (${res.investigation_id.slice(0, 12)}...)`);
      setTimeout(() => setActiveNotification(null), 4000);
      navigate(`/investigations/${res.investigation_id}/graph`);
    } catch (err: any) {
      alert(`Error loading demo scenario: ${err.message}`);
    } finally {
      setLoadingScenario(null);
    }
  };

  return (
    <>
      {/* Toast Banner */}
      {activeNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#9a7547]/30 text-[#9a7547] text-xs font-mono shadow-2xl animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-[#9a7547]" />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Button Render Variants */}
      {buttonStyle === 'header' && (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#fbf7f1] border border-[#9a7547]/30 text-[#9a7547] text-xs font-mono font-semibold hover:bg-[#fbf7f1] transition shadow-sm"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Load Demo Investigation</span>
        </button>
      )}

      {buttonStyle === 'hero' && (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#9a7547] text-white font-bold text-xs hover:bg-[#83633c] transition shadow-sm"
        >
          <Sparkles className="h-4 w-4" />
          <span>Load Demo Investigation</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      )}

      {buttonStyle === 'compact' && (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-xs font-mono font-medium hover:bg-[#fbf7f1] transition"
        >
          <Play className="h-3 w-3 fill-current" />
          <span>Demo Data</span>
        </button>
      )}

      {/* Controlled Demonstration Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-xs font-mono font-bold">
                  PHASE 17 DEMO MODE
                </span>
                <DemoBadge label="DETERMINISTIC SYNTHETIC DATASETS" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-[#9a7547]" /> Controlled Demonstration Mode
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select a pre-configured synthetic scenario to execute deterministic multi-hop attribution and cross-chain tracking for investigation testing and evaluation.
              </p>
            </div>

            {/* Scenario Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Scenario 1: Investment Fraud */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 hover:border-[#9a7547]/50 p-5 space-y-3 transition flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#9a7547]">SCENARIO 1</span>
                    <span className="px-2 py-0.5 rounded bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[10px] font-mono">
                      Single Chain (ETH)
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Investment Fraud Case</h3>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Multi-hop fund routing tracing stolen ETH across 3 intermediary peel wallets into Binance International deposit hot wallet.
                  </p>

                  <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-700 space-y-1">
                    <div className="text-slate-400">Flow Path:</div>
                    <div className="text-[#9a7547]">Wallet A &rarr; Wallet B &rarr; Wallet C &rarr; Binance Hot Wallet</div>
                    <div className="text-[#9a7547]">PoAE Score: 95.4 / 100 (STRONG)</div>
                  </div>
                </div>

                <button
                  disabled={loadingScenario !== null}
                  onClick={() => handleLoadScenario('INVESTMENT_FRAUD')}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#9a7547] hover:bg-[#9a7547] text-white font-medium text-xs transition disabled:opacity-50"
                >
                  {loadingScenario === 'INVESTMENT_FRAUD' ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Loading Synthetic Dataset...
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" /> Load Investment Fraud Demo
                    </>
                  )}
                </button>
              </div>

              {/* Scenario 2: Cross-Chain Fraud */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 hover:border-[#9a7547]/40 p-5 space-y-3 transition flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#9a7547]">SCENARIO 2</span>
                    <span className="px-2 py-0.5 rounded bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[10px] font-mono">
                      Cross-Chain (ETH ↔ TRON)
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Cross-Chain Evasion Case</h3>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Ethereum ETH converted via Stargate Cross-Chain Bridge into TRON USDT, terminating at OKX TRON Hot Wallet.
                  </p>

                  <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-700 space-y-1">
                    <div className="text-slate-400">Flow Path:</div>
                    <div className="text-[#9a7547]">Wallet A [ETH] &rarr; Stargate Bridge &rarr; TRON &rarr; OKX Hot Wallet</div>
                    <div className="text-[#9a7547]">PoAE Score: 92.8 / 100 (STRONG)</div>
                  </div>
                </div>

                <button
                  disabled={loadingScenario !== null}
                  onClick={() => handleLoadScenario('CROSS_CHAIN')}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#9a7547] hover:bg-[#9a7547] text-white font-medium text-xs transition disabled:opacity-50"
                >
                  {loadingScenario === 'CROSS_CHAIN' ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Loading Synthetic Dataset...
                    </>
                  ) : (
                    <>
                      <Layers className="h-3.5 w-3.5" /> Load Cross-Chain Demo
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#fbf7f1] border border-[#9a7547]/30 text-[11px] text-slate-700 font-mono text-center">
              Notice: All synthetic entities, transactions, and addresses are deterministically labeled as <strong className="text-slate-900 font-bold">DEMO DATA</strong> for reproducible presentations.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

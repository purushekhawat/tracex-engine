import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Network,
  Layers,
  ArrowRightLeft,
  Building2,
  ShieldAlert,
  CheckCircle2,
  GitFork,
  ArrowRight,
} from 'lucide-react';
import {
  fetchInvestigationGraph,
  loadDemoInvestmentFraud,
  loadDemoCrossChain,
} from '../api/client';
import { CytoscapeGraph } from '../components/CytoscapeGraph';
import SpecularButton from '../components/SpecularButton';

export const CrossChainTracePage: React.FC = () => {
  const navigate = useNavigate();
  // Scenario state: 'investment-fraud' (EVM) vs 'cross-chain' (ETH -> TRON)
  const [activeScenario, setActiveScenario] = useState<'investment-fraud' | 'cross-chain'>('cross-chain');
  const [investigationId, setInvestigationId] = useState('inv-demo-cross-chain-2026');
  const [isSwitching, setIsSwitching] = useState(false);

  // Fetch graph data for the active investigation
  const { data: graphData, isLoading: loadingGraph, refetch } = useQuery({
    queryKey: ['graph', investigationId],
    queryFn: () => fetchInvestigationGraph(investigationId),
  });

  const handleSelectScenario = async (scenario: 'investment-fraud' | 'cross-chain') => {
    setIsSwitching(true);
    setActiveScenario(scenario);
    try {
      if (scenario === 'investment-fraud') {
        const res = await loadDemoInvestmentFraud();
        setInvestigationId(res.investigation_id);
      } else {
        const res = await loadDemoCrossChain();
        setInvestigationId(res.investigation_id);
      }
      await refetch();
    } catch (e) {
      console.error('Failed to switch scenario:', e);
      // Fallback IDs
      setInvestigationId(
        scenario === 'investment-fraud'
          ? 'inv-demo-investment-fraud-2026'
          : 'inv-demo-cross-chain-2026'
      );
    } finally {
      setIsSwitching(false);
    }
  };

  // Safe fallback data if backend is still initializing
  const nodes = graphData?.nodes || [
    {
      id: '0x111111111111111111111111111111111111DEMO',
      label: 'Suspect Origin (ETH)',
      type: 'SUSPECT_WALLET',
      is_suspect: true,
      is_vasp: false,
      balance: 142.5,
    },
    {
      id: '0x222222222222222222222222222222222222DEMO',
      label: 'Relay Wallet (ETH)',
      type: 'INTERMEDIARY',
      is_suspect: false,
      is_vasp: false,
      balance: 2.1,
    },
    {
      id: '0xStargateBridgeRouterEVM000000000000000000',
      label: 'Stargate Bridge Protocol',
      type: 'CROSS_CHAIN_BRIDGE',
      is_suspect: false,
      is_vasp: false,
      balance: 500000.0,
    },
    {
      id: 'TRON_Relay_Wallet_PassThrough_9999DEMO',
      label: 'TRON Relay Node',
      type: 'INTERMEDIARY',
      is_suspect: false,
      is_vasp: false,
      balance: 15.0,
    },
    {
      id: 'TRON_OKX_Hot_Wallet_Deposit_Pool_01DEMO',
      label: 'OKX TRON Hot Wallet Pool',
      type: 'VASP_DEPOSIT_POOL',
      is_suspect: false,
      is_vasp: true,
      vasp_name: 'OKX TRON Hot Wallet',
      balance: 1250000.0,
    },
  ];

  const edges = graphData?.edges || [
    {
      id: 'e1',
      source: '0x111111111111111111111111111111111111DEMO',
      target: '0x222222222222222222222222222222222222DEMO',
      tx_hash: '0xaa11bb22cc33dd44ee55ff6600112233445566778899aabbccddeeff00112233',
      type: 'STANDARD_TRANSFER',
      amount: 45.0,
      amount_usd: 142500,
      timestamp: '2026-10-18T02:00:00Z',
    },
    {
      id: 'e2',
      source: '0x222222222222222222222222222222222222DEMO',
      target: '0xStargateBridgeRouterEVM000000000000000000',
      tx_hash: '0xbb22cc33dd44ee55ff6600112233445566778899aabbccddeeff001122334455',
      type: 'CROSS_CHAIN_BRIDGE',
      bridge_name: 'Stargate Finance',
      amount: 44.2,
      amount_usd: 140000,
      timestamp: '2026-10-18T03:15:00Z',
    },
    {
      id: 'e3',
      source: '0xStargateBridgeRouterEVM000000000000000000',
      target: 'TRON_Relay_Wallet_PassThrough_9999DEMO',
      tx_hash: '0xcc33dd44ee55ff6600112233445566778899aabbccddeeff0011223344556677',
      type: 'CROSS_CHAIN_BRIDGE',
      bridge_name: 'Stargate TRON Mint',
      amount: 139500,
      amount_usd: 139500,
      timestamp: '2026-10-18T03:22:00Z',
    },
    {
      id: 'e4',
      source: 'TRON_Relay_Wallet_PassThrough_9999DEMO',
      target: 'TRON_OKX_Hot_Wallet_Deposit_Pool_01DEMO',
      tx_hash: '0xdd44ee55ff6600112233445566778899aabbccddeeff00112233445566778899',
      type: 'STANDARD_TRANSFER',
      amount: 138000,
      amount_usd: 138000,
      timestamp: '2026-10-18T04:10:00Z',
    },
  ];

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
                <Network className="h-3.5 w-3.5 text-[#9a7547]" /> Multi-Chain Graph Intelligence
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Cross-Chain Trace Graph Explorer
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed font-medium">
              Interactive visualization of cryptocurrency fund flows, wallet clusters, and cross-chain bridge movements across Ethereum and TRON networks.
            </p>
          </div>

          {/* Scenario Selector Chips */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[11px]">Preset Scenario:</span>
            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-[#e7ebf2]">
              <button
                onClick={() => handleSelectScenario('cross-chain')}
                disabled={isSwitching}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeScenario === 'cross-chain'
                    ? 'bg-[#9a7547] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                Cross-Chain (ETH &rarr; TRON)
              </button>
              <button
                onClick={() => handleSelectScenario('investment-fraud')}
                disabled={isSwitching}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeScenario === 'investment-fraud'
                    ? 'bg-[#9a7547] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                Investment Fraud (EVM)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Chain Bridge Movement Banner */}
      {activeScenario === 'cross-chain' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf7f1] border border-[#9a7547]/30 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#9a7547] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#9a7547]">
                <span>CROSS-CHAIN BRIDGE EVENT DETECTED:</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[#9a7547] border border-[#9a7547]/30 font-mono text-[10px]">
                  STARGATE PROTOCOL
                </span>
              </div>
              <div className="text-xs text-slate-700 mt-0.5 font-medium">
                Funds bridged from <strong className="text-slate-900 font-bold">Ethereum EVM</strong> into{' '}
                <strong className="text-[#9a7547] font-bold">TRON Network (USDT-TRC20)</strong> and deposited into{' '}
                <strong className="text-slate-900 font-bold">OKX TRON Hot Wallet Pool</strong>.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Bridged Value</span>
              <span className="text-sm font-black text-[#9a7547]">$139,500.00 USD</span>
            </div>
            <SpecularButton
              onClick={() => navigate('/dashboard/vasp-intelligence')}
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
              title="VASP Attribution Analysis"
            >
              <span>VASP Attribution</span>
              <ArrowRight className="h-3.5 w-3.5 text-white/80" />
            </SpecularButton>
          </div>
        </div>
      )}

      {/* Cytoscape.js Interactive Graph Canvas Container */}
      <div className="glass-card ai-card-bg overflow-hidden !border-[#e7ebf2]">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Network className="h-4 w-4 text-[#9a7547]" /> Interactive Graph Canvas
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              ({nodes.length} Nodes &bull; {edges.length} Edges)
            </span>
          </div>

          {/* Quick Legend Chips */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30">
              <span className="h-2 w-2 rounded-full bg-[#9a7547]" /> Suspect Wallet
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
              <span className="h-2 w-2 rounded-full bg-slate-400" /> Intermediary Relay
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30">
              <span className="h-2 w-2 rounded-full bg-[#9a7547]" /> Cross-Chain Bridge
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#9a7547] text-white border border-[#9a7547]">
              <span className="h-2 w-2 rounded-full bg-white" /> VASP Deposit Pool
            </span>
          </div>
        </div>

        {/* The Graph Component */}
        {loadingGraph ? (
          <div className="h-[600px] flex items-center justify-center text-xs text-slate-400 font-medium">
            Rendering multi-hop Cytoscape.js topology...
          </div>
        ) : (
          <CytoscapeGraph
            nodes={nodes}
            edges={edges}
            suspectAddress="0x111111111111111111111111111111111111DEMO"
          />
        )}
      </div>

      {/* Bottom Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Fund Flow Timeline */}
        <div className="glass-card ai-card-bg p-6 space-y-3 !border-[#e7ebf2]">
          <div className="flex items-center justify-between text-slate-800 text-xs font-bold uppercase border-b border-slate-100 pb-2">
            <span>Fund Flow Velocity</span>
            <CheckCircle2 className="h-4 w-4 text-[#9a7547]" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Funds navigated across 3 hops in less than 2 hours and 15 minutes, matching the <strong className="text-slate-900">High-Velocity Layering</strong> laundering typology.
          </p>
          <div className="text-[11px] text-[#9a7547] font-bold">
            Average Hop Duration: ~45 Minutes
          </div>
        </div>

        {/* Card 2: Wallet Clusters */}
        <div className="glass-card ai-card-bg p-6 space-y-3 !border-[#e7ebf2]">
          <div className="flex items-center justify-between text-slate-800 text-xs font-bold uppercase border-b border-slate-100 pb-2">
            <span>Co-Spending Clusters</span>
            <GitFork className="h-4 w-4 text-[#9a7547]" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Deposit address sweep behaviors indicate the terminal destination wallet is part of a high-volume exchange hot wallet cluster.
          </p>
          <div className="text-[11px] text-[#9a7547] font-bold">
            Cluster Confidence: 94.8% Verified
          </div>
        </div>

        {/* Card 3: Forensics & Section 91 Summons */}
        <div className="glass-card ai-card-bg p-6 space-y-3 flex flex-col justify-between !border-[#e7ebf2]">
          <div>
            <div className="flex items-center justify-between text-slate-800 text-xs font-bold uppercase border-b border-slate-100 pb-2">
              <span>Forensic Evidence</span>
              <Building2 className="h-4 w-4 text-[#9a7547]" />
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
              Export court-ready forensic reports and prepare Section 91 CrPC lawful freeze / KYC disclosure notices.
            </p>
          </div>
          <div className="pt-2">
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
              className="w-full font-bold cursor-pointer hover:brightness-110 shadow-xs"
              title="Generate Forensic Package"
            >
              <span>Generate Forensic Package</span>
              <ArrowRight className="h-3.5 w-3.5 text-white/80" />
            </SpecularButton>
          </div>
        </div>
      </div>
    </div>
  );
};

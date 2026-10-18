import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchInvestigationGraph, fetchInvestigationAttributions, fetchInvestigationRisk } from '../api/client';
import { CytoscapeGraph } from '../components/CytoscapeGraph';
import { AttributionPanel } from '../components/AttributionPanel';
import { InvestigationCopilot } from '../components/InvestigationCopilot';
import { ReportViewer } from '../components/ReportViewer';
import { SahyogIntegrationPanel } from '../components/SahyogIntegrationPanel';
import { DemoBadge } from '../components/DemoBadge';
import { Network, ShieldAlert, Building2, AlertTriangle, FileText, CheckCircle2, RefreshCw, Bot, FileCheck, Landmark } from 'lucide-react';

export const InvestigationView: React.FC = () => {
  const { id = 'i1111111-1111-1111-1111-111111111111' } = useParams<{ id: string }>();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.endsWith('/graph')) return 'graph';
    if (location.pathname.endsWith('/evidence')) return 'evidence';
    if (location.pathname.endsWith('/attribution')) return 'attribution';
    if (location.pathname.endsWith('/risk')) return 'risk';
    if (location.pathname.endsWith('/copilot')) return 'copilot';
    if (location.pathname.endsWith('/reports')) return 'reports';
    if (location.pathname.endsWith('/sahyog')) return 'sahyog';
    return 'graph';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  const { data: graphData, isLoading: loadingGraph } = useQuery({
    queryKey: ['graph', id],
    queryFn: () => fetchInvestigationGraph(id),
  });

  const { data: attrData, isLoading: loadingAttr } = useQuery({
    queryKey: ['attributions', id],
    queryFn: () => fetchInvestigationAttributions(id),
  });

  const { data: riskData, isLoading: loadingRisk } = useQuery({
    queryKey: ['risk', id],
    queryFn: () => fetchInvestigationRisk(id),
  });

  const suspectAddress = graphData?.suspect_address || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

  return (
    <div className="space-y-6">
      {/* Investigation Top Header Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
                INVESTIGATION ID: {id.slice(0, 8)}
              </span>
              <DemoBadge />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              Suspect Wallet: <span className="font-mono text-rose-600">{suspectAddress}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Pipeline Status: COMPLETED
            </span>
          </div>
        </div>

        {/* Workspace Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 overflow-x-auto">
          {[
            { id: 'graph', label: 'Transaction Graph Visualizer', path: `/investigations/${id}/graph`, icon: Network },
            { id: 'attribution', label: 'Proof of Attribution (PoAE)', path: `/investigations/${id}/attribution`, icon: Building2 },
            { id: 'risk', label: 'Risk & Typology Analysis', path: `/investigations/${id}/risk`, icon: AlertTriangle },
            { id: 'copilot', label: 'Investigation Copilot AI', path: `/investigations/${id}/copilot`, icon: Bot },
            { id: 'reports', label: 'Forensic Report Package', path: `/investigations/${id}/reports`, icon: FileCheck },
            { id: 'sahyog', label: 'SAHYOG Integration', path: `/investigations/${id}/sahyog`, icon: Landmark },
            { id: 'evidence', label: 'Evidence & Audit Provenance', path: `/investigations/${id}/evidence`, icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-200/80'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Transaction Graph Visualizer */}
      {activeTab === 'graph' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase font-mono flex items-center gap-2">
              <Network className="h-4 w-4 text-blue-600" /> Interactive Cytoscape.js Multi-Hop Transaction Graph
            </h2>
            {graphData && (
              <span className="text-xs font-mono text-slate-500">
                Nodes: <span className="text-blue-600 font-bold">{graphData.stats.total_nodes}</span> | Edges: <span className="text-cyan-600 font-bold">{graphData.stats.total_edges}</span> | Volume: <span className="text-emerald-600 font-bold">${graphData.stats.total_volume_usd.toLocaleString()}</span>
              </span>
            )}
          </div>

          {loadingGraph ? (
            <div className="h-[520px] rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-mono text-slate-500 animate-pulse">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" /> Rendering Cytoscape.js Graph Canvas...
            </div>
          ) : graphData ? (
            <CytoscapeGraph nodes={graphData.nodes} edges={graphData.edges} suspectAddress={suspectAddress} />
          ) : null}
        </div>
      )}

      {/* Tab 2: Proof of Attribution (PoAE Scorecard & Evidence Panel) */}
      {activeTab === 'attribution' && (
        <div className="space-y-4">
          {loadingAttr ? (
            <div className="p-8 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-500 animate-pulse flex items-center justify-center">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Computing Evidence-Strength Scores...
            </div>
          ) : attrData ? (
            <AttributionPanel attributions={attrData.attributions} />
          ) : null}
        </div>
      )}

      {/* Tab 3: Risk & Typology Analysis */}
      {activeTab === 'risk' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase font-mono flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600" /> Automated Risk & Laundering Typologies
          </h2>

          {loadingRisk ? (
            <div className="p-8 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-500 animate-pulse flex items-center justify-center">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Evaluating Typology Indicators...
            </div>
          ) : riskData ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-white border border-slate-200 p-6 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase">Overall Risk Level</span>
                  <div className="text-2xl font-bold text-rose-600 font-mono mt-0.5">{riskData.risk_level}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold font-mono text-rose-600">{riskData.risk_score} / 100</div>
                  <div className="text-[10px] text-slate-500 font-mono">Risk Index</div>
                </div>
              </div>

              {/* Indicators List */}
              <div className="space-y-3">
                {riskData.risk_indicators.map((ind, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-rose-600">{ind.type}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 text-xs font-mono font-medium">
                        {ind.severity} SEVERITY
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">{ind.description}</p>
                    <div className="text-[10px] font-mono text-slate-500">
                      Evidence Hashes/Nodes: <span className="text-slate-800">{ind.evidence.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legal Limitations Disclaimer */}
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-1 text-xs text-amber-900">
                <div className="font-bold text-amber-800 font-mono uppercase">Operational Analysis Limitations & Legal Disclaimers:</div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800/90">
                  {riskData.limitations.map((lim, lIdx) => (
                    <li key={lIdx}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Tab 4: Investigation Copilot AI */}
      {activeTab === 'copilot' && (
        <div className="space-y-4">
          <InvestigationCopilot investigationId={id} />
        </div>
      )}

      {/* Tab 5: Forensic Report Package */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <ReportViewer investigationId={id} />
        </div>
      )}

      {/* Tab 6: SAHYOG Integration Adapter */}
      {activeTab === 'sahyog' && (
        <div className="space-y-4">
          <SahyogIntegrationPanel investigationId={id} />
        </div>
      )}

      {/* Tab 7: Evidence & Audit Provenance */}
      {activeTab === 'evidence' && (
        <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase font-mono flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="h-4 w-4 text-blue-600" /> Lawful Evidence Chain-of-Custody & Audit Provenance
          </h2>

          <div className="space-y-3">
            {[
              { action: 'INVESTIGATION_SUBMITTED', user: 'Inspector Sharma', time: '2026-10-09 03:45:00 UTC', details: 'Investigation initiated for wallet 0x71C765...' },
              { action: 'GRAPH_INGESTION_COMPLETED', user: 'TRACE-X Core Engine', time: '2026-10-09 03:45:05 UTC', details: 'Ingested 4 nodes and 3 edges across 3 hops' },
              { action: 'POAE_SCORE_COMPUTED', user: 'PoAE Engine v1.0', time: '2026-10-09 03:45:06 UTC', details: 'Attribution evaluated for Binance International (89.6% score)' },
            ].map((log, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-blue-600">{log.action}</span>
                  <div className="text-slate-700 mt-0.5">{log.details}</div>
                </div>
                <div className="text-right font-mono text-[10px] text-slate-500">
                  <div>{log.user}</div>
                  <div>{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

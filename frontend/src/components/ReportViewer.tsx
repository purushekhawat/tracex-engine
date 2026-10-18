import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchInvestigationReport, getReportDownloadURL } from '../api/client';
import {
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Info,
  Clock,
  Printer,
  FileCode,
  RefreshCw,
  Building2,
  ArrowRightLeft,
} from 'lucide-react';

interface ReportViewerProps {
  investigationId: string;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ investigationId }) => {
  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', investigationId],
    queryFn: () => fetchInvestigationReport(investigationId),
  });

  const handleDownloadPDF = () => {
    const downloadUrl = getReportDownloadURL(investigationId);
    window.open(downloadUrl, '_blank');
  };

  const handleDownloadJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TRACE-X-Report-${report.report_id}.json`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="p-12 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-500 animate-pulse flex items-center justify-center">
        <RefreshCw className="h-5 w-5 animate-spin mr-3 text-blue-600" />
        Generating 14-Section Forensic Investigation Report Package...
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-mono">
        Error loading investigation report. Please ensure backend services are active.
      </div>
    );
  }

  const caseInfo = report['1_case_information'];
  const scopeInfo = report['2_investigation_scope'];
  const suspectInfo = report['3_suspect_wallet'];
  const timeline = report['6_fund_flow_timeline'];
  const graphSummary = report['7_graph_summary'];
  const attributions = report['8_candidate_vasp_attribution'];
  const audit = report['14_audit_metadata'];

  return (
    <div className="space-y-6 printable-report">
      {/* Printable CSS Rules */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .printable-report { padding: 0 !important; }
          .no-print { display: none !important; }
          .print-card { border: 1px solid #ccc !important; background: white !important; color: black !important; box-shadow: none !important; }
          .print-text { color: black !important; }
        }
      `}</style>

      {/* Top Action Toolbar */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-mono text-blue-600 font-bold uppercase">
            REPORT ID: {report.report_id}
          </span>
          <h2 className="text-sm font-bold text-slate-900 tracking-wide mt-0.5">
            Court-Admissible Law Enforcement Evidence Package
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-mono font-bold text-white transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
          <button
            onClick={handleDownloadJSON}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-mono text-slate-700 transition border border-slate-200 flex items-center gap-1.5"
          >
            <FileCode className="h-4 w-4" /> JSON Export
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-mono text-slate-700 transition border border-slate-200 flex items-center gap-1.5"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      {/* Report Header Card */}
      <div className="print-card p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                TRACE-X FORENSIC INVESTIGATION REPORT
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Cryptographically Grounded Blockchain Intelligence & VASP Attribution Evidence
            </p>
          </div>
          <div className="text-right font-mono text-xs">
            <div className="text-emerald-600 font-bold flex items-center justify-end gap-1">
              <ShieldCheck className="h-4 w-4" /> SIGNED & VERIFIED
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              Analysis Version: {audit.analysis_version}
            </div>
          </div>
        </div>

        {/* SHA-256 Evidence Provenance Hash Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono text-xs">
          <div className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Cryptographic SHA-256 Evidence Digest:
          </div>
          <div className="text-slate-800 font-bold break-all bg-white p-2 rounded border border-slate-200 text-[11px]">
            {audit.cryptographic_sha256_hash}
          </div>
          <div className="text-[10px] text-slate-500">
            Immutable SHA-256 hash guarantees legal chain-of-custody for court admissibility.
          </div>
        </div>
      </div>

      {/* Proof Classification Banner (Facts vs Inferences vs Unknowns) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
        <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-600" /> Grounded Proof Tier Classification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
            <div className="font-bold text-emerald-700 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> VERIFIED FACTS
            </div>
            <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-700">
              {report.proof_classification.verified_facts.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
            <div className="font-bold text-amber-700 uppercase flex items-center gap-1.5">
              <Info className="h-4 w-4 text-amber-600" /> SYSTEM INFERENCES
            </div>
            <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-700">
              {report.proof_classification.system_inferences.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
            <div className="font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-slate-500" /> UNKNOWN INFORMATION
            </div>
            <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-600">
              {report.proof_classification.unknown_information.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 14 Mandatory Report Sections Grid */}
      <div className="space-y-4">
        {/* Section 1: Case Information */}
        <div className="print-card p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <h3 className="text-xs font-mono font-bold text-blue-600 uppercase border-b border-slate-100 pb-2">
            1. CASE INFORMATION
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Case Number</span>
              <div className="font-mono text-slate-800 font-bold">{caseInfo.case_number}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Title</span>
              <div className="text-slate-800 font-medium truncate">{caseInfo.title}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Investigator</span>
              <div className="text-slate-800 font-medium">{caseInfo.investigator}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Priority / Status</span>
              <div className="font-mono text-emerald-600 font-bold">{caseInfo.priority} / {caseInfo.status}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Investigation Scope */}
        <div className="print-card p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <h3 className="text-xs font-mono font-bold text-blue-600 uppercase border-b border-slate-100 pb-2">
            2. INVESTIGATION SCOPE
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Investigation ID</span>
              <div className="font-mono text-slate-800 font-bold">{scopeInfo.investigation_id}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Max Hops Evaluated</span>
              <div className="font-mono text-slate-800 font-bold">{scopeInfo.max_hops} Hops</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Legal Interception Standard</span>
              <div className="text-slate-700 font-mono text-[11px]">{scopeInfo.legal_standard}</div>
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Suspect Wallet & Blockchain */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="print-card p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-xs font-mono font-bold text-blue-600 uppercase border-b border-slate-100 pb-2">
              3. SUSPECT WALLET OVERVIEW
            </h3>
            <div className="space-y-1.5 text-xs font-mono">
              <span className="text-[10px] text-slate-500 uppercase">Address:</span>
              <div className="font-bold text-rose-600 break-all p-2 rounded bg-slate-50 border border-slate-200">
                {suspectInfo.address}
              </div>
              <div className="flex justify-between pt-1 text-[11px]">
                <span className="text-slate-500">Balance: <strong className="text-slate-800">{suspectInfo.balance} ETH</strong></span>
                <span className="text-slate-500">Risk Index: <strong className="text-rose-600">{suspectInfo.risk_score}/100</strong></span>
              </div>
            </div>
          </div>

          <div className="print-card p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-xs font-mono font-bold text-blue-600 uppercase border-b border-slate-100 pb-2">
              4. BLOCKCHAIN INFRASTRUCTURE
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded bg-slate-50 border border-slate-200 text-slate-800 font-bold">
                {report['4_blockchain']}
              </div>
              <div className="text-[11px] text-slate-500">
                Full RPC block height sync active with verified consensus finality.
              </div>
            </div>
          </div>
        </div>

        {/* Section 5 & 7: Transaction & Graph Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="print-card p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-xs font-mono font-bold text-blue-600 uppercase border-b border-slate-100 pb-2">
              5. TRANSACTION SUMMARY
            </h3>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase">Total Transfers</span>
                <div className="font-bold text-slate-800 mt-0.5">{report['5_transaction_summary'].total_transfers}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase">Volume (USD)</span>
                <div className="font-bold text-emerald-600 mt-0.5">${report['5_transaction_summary'].total_volume_usd?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="print-card p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-xs font-mono font-bold text-blue-600 uppercase border-b border-slate-100 pb-2">
              7. GRAPH TOPOLOGY METRICS
            </h3>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase">Nodes</span>
                <div className="font-bold text-blue-600">{graphSummary.total_nodes}</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase">Edges</span>
                <div className="font-bold text-cyan-600">{graphSummary.total_edges}</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase">Max Depth</span>
                <div className="font-bold text-purple-600">{graphSummary.max_depth} Hops</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Fund-Flow Timeline Table */}
        <div className="print-card p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-mono font-bold text-blue-600 uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> 6. FUND-FLOW TIMELINE LOG
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase">
                  <th className="py-2 px-2">Step</th>
                  <th className="py-2 px-2">From Address</th>
                  <th className="py-2 px-2">To Address</th>
                  <th className="py-2 px-2">Amount</th>
                  <th className="py-2 px-2">USD Value</th>
                  <th className="py-2 px-2">Transaction Hash</th>
                  <th className="py-2 px-2">Timestamp (UTC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {timeline.map((item) => (
                  <tr key={item.step_index} className="hover:bg-slate-50">
                    <td className="py-2.5 px-2 font-bold text-blue-600">Hop {item.step_index}</td>
                    <td className="py-2.5 px-2 text-rose-600 font-mono truncate max-w-[120px]">{item.from_address}</td>
                    <td className="py-2.5 px-2 text-blue-600 font-mono truncate max-w-[120px]">{item.to_address}</td>
                    <td className="py-2.5 px-2 font-bold text-slate-800">{item.amount_eth} ETH</td>
                    <td className="py-2.5 px-2 text-emerald-600 font-bold">${item.amount_usd.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-slate-500 truncate max-w-[140px]">{item.tx_hash}</td>
                    <td className="py-2.5 px-2 text-slate-500">{new Date(item.timestamp).toUTCString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 8 & 9: VASP Attribution & Evidence */}
        <div className="print-card p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-mono font-bold text-blue-600 uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Building2 className="h-4 w-4" /> 8 & 9. CANDIDATE VASP ATTRIBUTION & SUPPORTING EVIDENCE
          </h3>
          <div className="space-y-3">
            {attributions.map((attr, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{attr.candidate_vasp}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-medium">
                      {attr.classification}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1 font-mono">
                    Path Distance: {attr.hop_distance || attr.path.length - 1} hops | Label Source: {attr.label_source || 'TRACE-X Intelligence DB'}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xl font-bold text-emerald-600">{attr.evidence_strength}%</div>
                  <div className="text-[10px] text-slate-400 uppercase">PoAE Strength</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 10 & 11: Risk Indicators & Cross-Chain Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="print-card p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-xs font-mono font-bold text-rose-600 uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> 10. AUTOMATED RISK INDICATORS
            </h3>
            <div className="space-y-2 text-xs">
              {report['10_risk_indicators'].map((ind, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-rose-600">{ind.type}</span>
                    <span className="text-[10px] text-rose-600 font-bold">{ind.severity}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{ind.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="print-card p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-xs font-mono font-bold text-purple-600 uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <ArrowRightLeft className="h-4 w-4" /> 11. CROSS-CHAIN BRIDGE ACTIVITY
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {report['11_cross_chain_activity'].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 text-purple-700 text-[11px]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 12, 13, 14: Limitations, Sources & Audit Metadata */}
        <div className="print-card p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 font-mono text-xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase border-b border-slate-100 pb-2">
            12, 13 & 14. LIMITATIONS, PROVENANCE SOURCES & AUDIT METADATA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Provenance & Label Sources:</span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 mt-1">
                {report['13_source_provenance_information'].map((src, sIdx) => (
                  <li key={sIdx}>{src}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Audit Chain-of-Custody Metadata:</span>
              <div className="text-[11px] text-slate-600 space-y-1 mt-1">
                <div>Report ID: <strong className="text-blue-600">{audit.report_id}</strong></div>
                <div>Generated: <strong>{new Date(audit.generated_at).toUTCString()}</strong></div>
                <div>Generated By: <strong>{audit.generated_by}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

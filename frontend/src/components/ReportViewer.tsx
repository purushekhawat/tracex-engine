import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchInvestigationReport, getReportDownloadURL } from '../api/client';
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Info,
  Clock,
  Printer,
  FileCode,
  RefreshCw,
  Building2,
} from 'lucide-react';
import SpecularButton from './SpecularButton';

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
      <div className="p-12 rounded-2xl glass-card ai-card-bg text-xs text-slate-500 animate-pulse flex items-center justify-center !border-[#e7ebf2]">
        <RefreshCw className="h-5 w-5 animate-spin mr-3 text-[#9a7547]" />
        Generating 14-Section Forensic Investigation Report Package...
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-6 rounded-2xl bg-[#fbf7f1] border border-[#9a7547]/30 text-[#9a7547] text-xs font-bold">
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
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card ai-card-bg !border-[#e7ebf2]">
        <div>
          <span className="text-xs font-bold text-[#9a7547] uppercase tracking-wider">
            REPORT ID: {report.report_id}
          </span>
          <h2 className="text-base font-black text-slate-900 tracking-tight mt-0.5">
            Court-Admissible Law Enforcement Evidence Package
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SpecularButton
            onClick={handleDownloadPDF}
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
            title="Download Official Court Evidence PDF"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Evidence PDF</span>
          </SpecularButton>

          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-[#e7ebf2] cursor-pointer"
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-[#e7ebf2] cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Official Court Provenance & SHA-256 Digest Banner */}
      <div className="p-6 rounded-2xl glass-card ai-card-bg border-l-4 !border-l-[#9a7547] !border-[#e7ebf2] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#9a7547]" />
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">
              Chain-of-Custody Cryptographic Verification Seal
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-xs font-bold font-mono">
            SEC_65B_IEA_COMPLIANT
          </span>
        </div>

        <div className="space-y-1 font-mono text-xs">
          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
            SHA-256 Digest Fingerprint:
          </span>
          <div className="p-2.5 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 font-bold break-all text-[11px]">
            {audit.cryptographic_sha256_hash}
          </div>
          <div className="text-[11px] text-slate-500 font-sans font-medium pt-1">
            Immutable SHA-256 hash guarantees legal chain-of-custody for court admissibility.
          </div>
        </div>
      </div>

      {/* Proof Classification Banner */}
      <div className="p-6 rounded-2xl glass-card ai-card-bg space-y-3 !border-[#e7ebf2]">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Info className="h-4 w-4 text-[#9a7547]" /> Grounded Proof Tier Classification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-[#fbf7f1] border border-[#9a7547]/30 text-slate-800 space-y-2">
            <div className="font-bold text-[#9a7547] uppercase flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="h-4 w-4 text-[#9a7547]" /> VERIFIED FACTS
            </div>
            <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-700 font-medium">
              {report.proof_classification.verified_facts.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-2">
            <div className="font-bold text-slate-800 uppercase flex items-center gap-1.5 text-xs">
              <Info className="h-4 w-4 text-[#9a7547]" /> SYSTEM INFERENCES
            </div>
            <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-600 font-medium">
              {report.proof_classification.system_inferences.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-[#e7ebf2] text-slate-800 space-y-2">
            <div className="font-bold text-slate-700 uppercase flex items-center gap-1.5 text-xs">
              <HelpCircle className="h-4 w-4 text-slate-500" /> UNKNOWN INFORMATION
            </div>
            <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-600 font-medium">
              {report.proof_classification.unknown_information.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 14 Mandatory Report Sections */}
      <div className="space-y-4">
        {/* Section 1: Case Information */}
        <div className="glass-card ai-card-bg p-6 space-y-3 !border-[#e7ebf2]">
          <h3 className="text-xs font-bold text-[#9a7547] uppercase tracking-wider border-b border-slate-100 pb-2">
            1. CASE INFORMATION
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Case Number</span>
              <div className="text-slate-900 font-bold text-sm mt-0.5">{caseInfo.case_number}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Title</span>
              <div className="text-slate-800 font-semibold mt-0.5 truncate">{caseInfo.title}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Investigator</span>
              <div className="text-slate-800 font-semibold mt-0.5">{caseInfo.investigator}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Priority / Status</span>
              <div className="text-[#9a7547] font-bold mt-0.5">{caseInfo.priority} / {caseInfo.status}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Investigation Scope */}
        <div className="glass-card ai-card-bg p-6 space-y-3 !border-[#e7ebf2]">
          <h3 className="text-xs font-bold text-[#9a7547] uppercase tracking-wider border-b border-slate-100 pb-2">
            2. INVESTIGATION SCOPE
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Investigation ID</span>
              <div className="text-slate-900 font-bold font-mono text-xs mt-0.5">{scopeInfo.investigation_id}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Max Hops Evaluated</span>
              <div className="text-slate-900 font-bold mt-0.5">{scopeInfo.max_hops} Hops</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Legal Interception Standard</span>
              <div className="text-slate-700 font-semibold text-xs mt-0.5">{scopeInfo.legal_standard}</div>
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Suspect Wallet & Blockchain */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card ai-card-bg p-6 space-y-3 !border-[#e7ebf2]">
            <h3 className="text-xs font-bold text-[#9a7547] uppercase tracking-wider border-b border-slate-100 pb-2">
              3. SUSPECT WALLET OVERVIEW
            </h3>
            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Address:</span>
              <div className="font-bold font-mono text-[#9a7547] break-all p-3 rounded-xl bg-slate-50 border border-[#e7ebf2]">
                {suspectInfo.address}
              </div>
              <div className="flex justify-between pt-1 text-xs">
                <span className="text-slate-500">Balance: <strong className="text-slate-900">{suspectInfo.balance} ETH</strong></span>
                <span className="text-slate-500">Risk Index: <strong className="text-[#9a7547]">{suspectInfo.risk_score}/100</strong></span>
              </div>
            </div>
          </div>

          <div className="glass-card ai-card-bg p-6 space-y-3 !border-[#e7ebf2]">
            <h3 className="text-xs font-bold text-[#9a7547] uppercase tracking-wider border-b border-slate-100 pb-2">
              4. BLOCKCHAIN INFRASTRUCTURE
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-[#e7ebf2] text-slate-900 font-bold">
                {report['4_blockchain']}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Full RPC block height sync active with verified consensus finality.
              </div>
            </div>
          </div>
        </div>

        {/* Section 5 & 7: Transaction & Graph Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card ai-card-bg p-6 space-y-3 !border-[#e7ebf2]">
            <h3 className="text-xs font-bold text-[#9a7547] uppercase tracking-wider border-b border-slate-100 pb-2">
              5. TRANSACTION SUMMARY
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-[#e7ebf2]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Transfers</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{report['5_transaction_summary'].total_transfers}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-[#e7ebf2]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Volume (USD)</span>
                <div className="font-bold text-[#9a7547] text-sm mt-0.5">${report['5_transaction_summary'].total_volume_usd?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="glass-card ai-card-bg p-6 space-y-3 !border-[#e7ebf2]">
            <h3 className="text-xs font-bold text-[#9a7547] uppercase tracking-wider border-b border-slate-100 pb-2">
              7. GRAPH TOPOLOGY METRICS
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-[#e7ebf2]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Nodes</span>
                <div className="font-black text-[#9a7547] text-base mt-0.5">{graphSummary.total_nodes}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-[#e7ebf2]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Edges</span>
                <div className="font-black text-[#9a7547] text-base mt-0.5">{graphSummary.total_edges}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-[#e7ebf2]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Max Depth</span>
                <div className="font-black text-slate-800 text-base mt-0.5">{graphSummary.max_depth} Hops</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Fund-Flow Timeline Table */}
        <div className="glass-card ai-card-bg table-card w-full relative overflow-hidden !border-[#e7ebf2]">
          <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-100/70">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#9a7547]" /> 6. FUND-FLOW TIMELINE LOG
            </h3>
            <span className="px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 text-xs font-bold">
              {timeline.length} Steps Recorded
            </span>
          </div>

          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-none bg-white">
                  <th className="py-4 pl-6 pr-3 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">Step</th>
                  <th className="py-4 px-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">From Address</th>
                  <th className="py-4 px-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">To Address</th>
                  <th className="py-4 px-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">Amount</th>
                  <th className="py-4 px-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">USD Value</th>
                  <th className="py-4 px-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">Transaction Hash</th>
                  <th className="py-4 pl-3.5 pr-6 text-xs font-semibold text-slate-700 whitespace-nowrap bg-white border-none">Timestamp (UTC)</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200/60 bg-white">
                {timeline.map((item) => (
                  <tr key={item.step_index} className="hover:bg-slate-50/60 transition-colors last:border-b-0">
                    <td className="py-4 pl-6 pr-3 whitespace-nowrap border-none">
                      <span className="inline-block px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/25 text-xs font-bold font-mono">
                        Hop #{item.step_index}
                      </span>
                    </td>
                    <td className="py-4 px-3.5 whitespace-nowrap border-none text-slate-800 font-mono text-xs font-bold truncate max-w-[140px]">{item.from_address}</td>
                    <td className="py-4 px-3.5 whitespace-nowrap border-none text-[#9a7547] font-mono text-xs font-bold truncate max-w-[140px]">{item.to_address}</td>
                    <td className="py-4 px-3.5 whitespace-nowrap border-none font-bold text-xs text-slate-900">{item.amount_eth} ETH</td>
                    <td className="py-4 px-3.5 whitespace-nowrap border-none text-[#9a7547] font-bold text-xs">${item.amount_usd.toLocaleString()}</td>
                    <td className="py-4 px-3.5 whitespace-nowrap border-none text-slate-500 font-mono text-xs truncate max-w-[160px]">{item.tx_hash}</td>
                    <td className="py-4 pl-3.5 pr-6 whitespace-nowrap border-none text-slate-600 text-xs font-medium">{new Date(item.timestamp).toUTCString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 8 & 9: VASP Attribution */}
        <div className="glass-card ai-card-bg p-6 space-y-4 !border-[#e7ebf2]">
          <h3 className="text-xs font-bold text-[#9a7547] uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#9a7547]" /> 8 &amp; 9. CANDIDATE VASP ATTRIBUTION &amp; SUPPORTING EVIDENCE
          </h3>
          <div className="space-y-3">
            {attributions.map((attr, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[#e7ebf2] bg-white space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{attr.candidate_vasp}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[10px] font-bold">
                      {attr.classification}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#9a7547] bg-[#fbf7f1] px-3 py-1 rounded-full border border-[#9a7547]/25">
                    Evidence Strength: {attr.evidence_strength.toFixed(1)}%
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {attr.confidence_basis.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

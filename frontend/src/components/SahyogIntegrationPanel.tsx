import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchSahyogStatus,
  createDisclosureDraft,
  createFreezeDraft,
  submitSahyogRequest,
  DisclosureRequestDraft,
  FreezeRequestDraft,
  SahyogSubmitResponse,
} from '../api/client';
import {
  ShieldAlert,
  CheckCircle2,
  FileText,
  Lock,
  Send,
  AlertTriangle,
  Info,
  RefreshCw,
  XCircle,
  Award,
} from 'lucide-react';

interface SahyogIntegrationPanelProps {
  investigationId: string;
}

export const SahyogIntegrationPanel: React.FC<SahyogIntegrationPanelProps> = ({ investigationId }) => {
  const [disclosureDraft, setDisclosureDraft] = useState<DisclosureRequestDraft | null>(null);
  const [freezeDraft, setFreezeDraft] = useState<FreezeRequestDraft | null>(null);
  const [submissionResp, setSubmissionResp] = useState<SahyogSubmitResponse | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [badgeNumber, setBadgeNumber] = useState('');
  const [investigatorName, setInvestigatorName] = useState('');
  const [isConfirmedCheckbox, setIsConfirmedCheckbox] = useState(false);

  const [loadingAction, setLoadingAction] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useQuery({
    queryKey: ['sahyogStatus'],
    queryFn: fetchSahyogStatus,
  });

  const handleGenerateDisclosure = async () => {
    setLoadingAction(true);
    setErrorMessage('');
    try {
      const draft = await createDisclosureDraft(investigationId, 'Binance International');
      setDisclosureDraft(draft);
      setFreezeDraft(null);
      setSubmissionResp(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate disclosure draft.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleGenerateFreeze = async () => {
    setLoadingAction(true);
    setErrorMessage('');
    try {
      const draft = await createFreezeDraft(investigationId, '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 34500.0);
      setFreezeDraft(draft);
      setDisclosureDraft(null);
      setSubmissionResp(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate freeze draft.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleConfirmAndSubmit = async () => {
    if (!isConfirmedCheckbox || !badgeNumber.trim()) {
      setErrorMessage('Investigator badge number and explicit confirmation checkbox are strictly required.');
      return;
    }

    setLoadingAction(true);
    setErrorMessage('');
    try {
      const resp = await submitSahyogRequest({
        investigation_id: investigationId,
        candidate_vasp: disclosureDraft?.target_vasp || 'Binance International',
        evidence_strength: 89.6,
        investigator_confirmed: true,
        investigator_badge: badgeNumber,
      });
      setSubmissionResp(resp);
      setShowConfirmModal(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed.');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* SAHYOG Status Banner */}
      <div className="rounded-2xl bg-white border border-[#e7ebf2] p-6 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-wide">
                  SAHYOG Portal Integration Adapter
                </h2>
                <span className="px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-xs font-mono font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> SAHYOG Integration: Ready / Mock Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Indian Law Enforcement Interoperability Standard &bull; Section 91 CrPC / Requisition Dispatcher
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
          This adapter provides an integration-ready interface for the SAHYOG portal. Production live credentials will be linked upon official provisioning.
          <strong className="text-slate-800 block mt-1">
            Strict Control Enforced: Automatic submission of legal requests is prohibited. Explicit investigator authorization is required for all dispatches.
          </strong>
        </p>
      </div>

      {/* Action Buttons to Generate Drafts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#9a7547]" />
            <h3 className="text-sm font-bold text-slate-900">Prepare Disclosure Request Draft</h3>
          </div>
          <p className="text-xs text-slate-600">
            Generate a Section 91 CrPC Requisition Draft for target candidate VASP (Binance International) from verified on-chain evidence.
          </p>
          <button
            onClick={handleGenerateDisclosure}
            disabled={loadingAction}
            className="w-full py-2.5 rounded-lg bg-[#9a7547] hover:bg-[#83633c] disabled:opacity-50 text-xs font-mono font-bold text-white transition flex items-center justify-center gap-2 shadow-sm"
          >
            {loadingAction ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Generate Section 91 Disclosure Draft
          </button>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#9a7547]" />
            <h3 className="text-sm font-bold text-slate-900">Prepare Restraint / Freeze Draft</h3>
          </div>
          <p className="text-xs text-slate-600">
            Generate an Emergency Freeze Requisition Draft for suspect wallet address (0x71C765...) based on verified laundering flow continuity.
          </p>
          <button
            onClick={handleGenerateFreeze}
            disabled={loadingAction}
            className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-xs font-mono font-bold text-white transition flex items-center justify-center gap-2 shadow-sm"
          >
            {loadingAction ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Generate Restraint Freeze Draft
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#fbf7f1] border border-[#9a7547]/30 text-[#9a7547] text-xs font-mono flex items-center gap-2">
          <XCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Active Disclosure Request Draft Card */}
      {disclosureDraft && (
        <div className="rounded-2xl bg-white border border-[#e7ebf2] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-[#9a7547] font-bold uppercase">
                DRAFT ID: {disclosureDraft.draft_id}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{disclosureDraft.legal_notice_header}</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-xs font-mono font-bold">
              {disclosureDraft.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Target VASP Entity</span>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{disclosureDraft.target_vasp}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Destination Wallet Address</span>
              <div className="font-bold text-[#9a7547] mt-0.5 break-all">{disclosureDraft.destination_address}</div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <span className="text-[10px] text-slate-500 uppercase">Requested Evidence Data Items:</span>
            <ul className="space-y-1 text-slate-700">
              {disclosureDraft.requested_data_items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#9a7547] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action to trigger Confirmation Modal */}
          {!submissionResp && (
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#9a7547] flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Requires Manual Investigator Confirmation
              </span>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 rounded-lg bg-[#9a7547] hover:bg-[#83633c] text-xs font-mono font-bold text-white transition flex items-center gap-1.5 shadow-sm"
              >
                <Send className="h-4 w-4" /> Authorize & Submit to SAHYOG
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Freeze Request Draft Card */}
      {freezeDraft && (
        <div className="rounded-2xl bg-white border border-[#e7ebf2] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-[#9a7547] font-bold uppercase">
                DRAFT ID: {freezeDraft.draft_id}
              </span>
              <h3 className="text-lg font-bold text-slate-900">EMERGENCY RESTRAINT / FREEZE REQUISITION</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-xs font-mono font-bold">
              {freezeDraft.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Target Wallet Address</span>
              <div className="font-bold text-[#9a7547] mt-0.5 break-all">{freezeDraft.target_wallet_address}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase">Estimated Value (USD)</span>
              <div className="font-bold text-[#9a7547] text-sm mt-0.5">${freezeDraft.estimated_value_usd.toLocaleString()}</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
            <span className="text-[10px] text-slate-500 uppercase block">Reason for Restraint:</span>
            <p className="mt-0.5">{freezeDraft.reason_for_freeze}</p>
          </div>

          {!submissionResp && (
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#9a7547] flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Requires Manual Investigator Confirmation
              </span>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-mono font-bold text-white transition flex items-center gap-1.5 shadow-sm"
              >
                <Lock className="h-4 w-4" /> Authorize Emergency Restraint
              </button>
            </div>
          )}
        </div>
      )}

      {/* Submission Acknowledgment Card */}
      {submissionResp && (
        <div className="rounded-2xl bg-[#fbf7f1] border border-[#9a7547]/30 p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#9a7547] font-mono font-bold text-sm">
            <CheckCircle2 className="h-5 w-5" /> SUBMISSION ACKNOWLEDGED BY SAHYOG ADAPTER (MOCK MODE)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono pt-1">
            <div>
              <span className="text-slate-500 text-[10px]">Submission ID:</span>
              <div className="font-bold text-slate-900">{submissionResp.submission_id}</div>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">Legal Notice Reference:</span>
              <div className="font-bold text-[#9a7547]">{submissionResp.notice_reference}</div>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">Acknowledged Time:</span>
              <div className="font-bold text-slate-700">{new Date(submissionResp.acknowledged_at).toUTCString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Investigator Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-2">
                <Award className="h-5 w-5 text-[#9a7547]" /> Law Enforcement Authorization
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-700 transition text-xs font-mono"
              >
                Cancel
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#fbf7f1] border border-[#9a7547]/30 text-xs text-slate-800 space-y-1 font-mono">
              <div className="font-bold text-[#9a7547] uppercase flex items-center gap-1.5">
                <Info className="h-4 w-4" /> Legal Responsibility Notice:
              </div>
              <p className="text-[11px] leading-relaxed">
                You are about to sign and dispatch a legal Section 91 CrPC notice to the SAHYOG adapter.
                Automatic submissions are disabled. You must explicitly verify your authority.
              </p>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-600 text-[10px] uppercase mb-1">Investigator Full Name</label>
                <input
                  type="text"
                  value={investigatorName}
                  onChange={(e) => setInvestigatorName(e.target.value)}
                  placeholder="e.g. Senior Inspector Sharma"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#9a7547]"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-[10px] uppercase mb-1">Agency Badge / Credential ID</label>
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  placeholder="e.g. LEA-INSP-9982"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#9a7547]"
                />
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="confirm-cb"
                  checked={isConfirmedCheckbox}
                  onChange={(e) => setIsConfirmedCheckbox(e.target.checked)}
                  className="mt-0.5 accent-[#9a7547] h-4 w-4"
                />
                <label htmlFor="confirm-cb" className="text-[11px] text-slate-700 leading-tight">
                  I explicitly confirm that I am an authorized Law Enforcement Officer authorizing this Section 91 CrPC requisition based on grounded evidence.
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-mono text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAndSubmit}
                disabled={!isConfirmedCheckbox || !badgeNumber.trim() || loadingAction}
                className="px-4 py-2 rounded-lg bg-[#9a7547] hover:bg-[#83633c] disabled:opacity-50 text-xs font-mono font-bold text-white transition flex items-center gap-1.5 shadow-sm"
              >
                {loadingAction ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Confirm & Dispatch Requisition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { fetchCopilotQuery, CopilotMessage, CopilotCitation } from '../api/client';
import {
  Bot,
  User,
  Send,
  Sparkles,
  BookOpen,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface InvestigationCopilotProps {
  investigationId: string;
}

export const InvestigationCopilot: React.FC<InvestigationCopilotProps> = ({ investigationId }) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      role: 'assistant',
      content:
        'Greetings Inspector. I am the TRACE-X Grounded Investigation Copilot. I can analyze the transaction graph, evidence records, VASP intelligence labels, PoAE scorecards, and risk typologies scoped strictly to this investigation.\n\nSelect a preset query below or type your question.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const presetQueries = [
    'Trace the funds from this wallet.',
    'Which VASP-associated addresses were encountered?',
    'Why did the system assign this evidence-strength score?',
    'Show the shortest supported path.',
    'Summarize this investigation.',
    'What is the suspect’s secret phone number and home address?',
  ];

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMsg: CopilotMessage = { role: 'user', content: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const resp = await fetchCopilotQuery(investigationId, queryText, messages);
      const assistantMsg: CopilotMessage = {
        role: 'assistant',
        content: resp.answer,
        citations: resp.citations,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error retrieving grounded answer: ${err.message || 'Network connection failed.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedAnswer = (content: string, citations?: CopilotCitation[]) => {
    // Replace [REF: ...] markers with custom styled spans
    const refRegex = /(\[REF:[^\]]+\])/g;
    const parts = content.split(refRegex);

    return (
      <div className="space-y-3">
        <div className="whitespace-pre-wrap leading-relaxed text-xs text-slate-200">
          {parts.map((part, idx) => {
            if (part.match(refRegex)) {
              return (
                <span
                  key={idx}
                  className="mx-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/40 text-[10px] font-mono font-bold shadow-sm"
                >
                  <BookOpen className="h-3 w-3 text-[#9a7547]" />
                  {part.replace('[', '').replace(']', '')}
                </span>
              );
            }
            return part;
          })}
        </div>

        {/* Citations Drawer */}
        {citations && citations.length > 0 && (
          <div className="pt-2 border-t border-slate-200 space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-[#9a7547]" /> Grounded Evidence Citations ({citations.length}):
            </span>
            <div className="grid grid-cols-1 gap-1.5 font-mono text-[11px]">
              {citations.map((c, cIdx) => (
                <div key={cIdx} className="p-2 rounded bg-slate-50 border border-slate-200 flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[9px]">
                    {c.type}
                  </span>
                  <div className="truncate">
                    <strong className="text-slate-800">{c.ref}</strong>: <span className="text-slate-600">{c.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col h-[650px] shadow-sm">
      {/* Copilot Header */}
      <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#fbf7f1] border border-[#9a7547]/30 text-[#9a7547]">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide">TRACE-X Investigation Copilot</h3>
              <span className="px-2 py-0.5 rounded bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 text-[10px] font-mono font-medium">
                GROUNDED RAG ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Scoped Session: <span className="text-slate-800">{investigationId.slice(0, 18)}...</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Info className="h-3.5 w-3.5 text-[#9a7547]" /> Grounded Proof Integrity Guaranteed
        </div>
      </div>

      {/* Preset Query Chips */}
      <div className="p-3 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 font-bold">Suggested Prompts:</span>
        {presetQueries.map((pq, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSendQuery(pq)}
            disabled={loading}
            className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#9a7547] hover:border-[#9a7547]/30 hover:bg-[#fbf7f1] transition shrink-0 font-mono text-[11px] flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="h-3 w-3 text-[#9a7547]" />
            {pq}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40 font-sans">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="p-2 rounded-lg bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30 shrink-0 mt-1">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                msg.role === 'user'
                  ? 'bg-[#9a7547] text-white rounded-tr-none shadow-sm font-medium'
                  : msg.content.includes('Insufficient evidence')
                  ? 'bg-[#fbf7f1] border border-[#9a7547]/30 text-slate-800 rounded-tl-none space-y-2'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-3 shadow-xs'
              }`}
            >
              {msg.role === 'user' ? (
                <div>{msg.content}</div>
              ) : msg.content.includes('Insufficient evidence') ? (
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#9a7547]">
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#9a7547]" />
                  <span>Insufficient evidence to establish this.</span>
                </div>
              ) : (
                renderFormattedAnswer(msg.content, msg.citations)
              )}
            </div>

            {msg.role === 'user' && (
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 shrink-0 mt-1">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs font-mono text-slate-500 flex items-center gap-2 animate-pulse shadow-xs">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#9a7547]" /> Retrieving grounded evidence from investigation graph...
            </div>
          </div>
        )}
      </div>

      {/* Input Prompt Footer */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Copilot (e.g. Trace funds, show VASP addresses, explain score...)"
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9a7547] font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="px-5 py-3 rounded-xl bg-[#9a7547] hover:bg-[#83633c] disabled:opacity-50 text-white font-mono text-xs font-bold transition flex items-center gap-2 shadow-sm shrink-0"
          >
            <Send className="h-4 w-4" />
            <span>Ask</span>
          </button>
        </form>
        <div className="text-[10px] text-slate-400 font-mono mt-2 text-center">
          Strict Lawful Non-Custodial Intelligence Assistant &bull; Fabricated / Unsubstantiated claims automatically restricted
        </div>
      </div>
    </div>
  );
};

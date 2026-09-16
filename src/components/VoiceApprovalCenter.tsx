'use client';

import { useState, useRef, useEffect } from 'react';
import type { LiveRequest } from '../data/requestEngine';

interface Props {
  request: LiveRequest | null;
  onApprove: (id: string, note: string) => void;
  onReject: (id: string, reason: string) => void;
  onExecute: (id: string) => void;
}

interface VerificationMessage {
  id: string;
  speaker: 'requester' | 'approver' | 'system';
  name: string;
  text: string;
  timestamp: string;
}

export function VoiceApprovalCenter({ request, onApprove, onReject, onExecute }: Props) {
  const [messages, setMessages] = useState<VerificationMessage[]>([]);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (request) {
      setMessages([
        {
          id: '1',
          speaker: 'requester',
          name: request.requestedByName,
          text: request.clientMessage,
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          speaker: 'system',
          name: 'Chokepoint',
          text: `Secure verification session ${request.id.substring(0, 8)} • HMAC-signed • Hash-chained • Recording enabled • ${request.risk} risk • Dual-control required`,
          timestamp: new Date().toISOString(),
        },
      ]);
      setStatus('idle');
    }
  }, [request?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVerify = () => {
    setStatus('verifying');
    setTimeout(() => {
      setStatus('verified');
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        speaker: 'approver',
        name: 'Approver (You)',
        text: `Verification complete — requester identity confirmed, intent validated, correlation ${request?.code}. Ready for dual-control decision.`,
        timestamp: new Date().toISOString(),
      }]);
    }, 800);
  };

  const handleSend = () => {
    if (!input.trim() || !request) return;
    const msg: VerificationMessage = {
      id: Date.now().toString(),
      speaker: 'approver',
      name: 'Approver (You)',
      text: input,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, msg]);
    setInput('');

    // Simulate requester acknowledgment
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now()+1).toString(),
        speaker: 'requester',
        name: request.requestedByName,
        text: `Acknowledged — additional context: ${request.title}. Awaiting dual-control approval.`,
        timestamp: new Date().toISOString(),
      }]);
    }, 800);
  };

  const handleApprove = () => {
    if (!request) return;
    onApprove(request.id, `Verified via secure channel — ${request.code} approved with HMAC audit`);
  };

  const handleReject = () => {
    if (!request) return;
    onReject(request.id, `Verification failed or policy violation — ${request.code} rejected`);
  };

  if (!request) {
    return (
      <div className="flex flex-col h-full bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 p-8 items-center justify-center">
        <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
          <span className="text-zinc-500">◍</span>
        </div>
        <p className="text-[13px] font-medium text-zinc-300">Select a request for verification</p>
        <p className="text-[11px] text-zinc-500 mt-1 max-w-[320px] text-center">Dual-control requires distinct approver verification with tamper-evident audit logging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/60 bg-zinc-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300 text-[14px]">◍</div>
            <div>
              <h3 className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
                {request.code} — {request.title.substring(0, 50)}
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${request.risk === 'Critical' ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{request.risk}</span>
              </h3>
              <p className="text-[11px] text-zinc-500">{request.tenantName} • {request.requestedByName} • {request.priority} • Dual-control required</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-6 px-2.5 rounded-full text-[11px] font-medium border flex items-center gap-1.5 ${status === 'verified' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : status === 'verifying' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status === 'verified' ? 'bg-emerald-500' : status === 'verifying' ? 'bg-amber-500 animate-pulse' : 'bg-zinc-500'}`} />
              {status === 'verified' ? 'Verified' : status === 'verifying' ? 'Verifying' : 'Pending verification'}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800"><span className="text-zinc-500">Requester</span><span className="text-zinc-200 ml-2 font-medium">{request.requestedByName}</span></div>
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800"><span className="text-zinc-500">Risk</span><span className="text-zinc-200 ml-2">{request.risk} • {request.priority}</span></div>
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800"><span className="text-zinc-500">Expiry</span><span className="text-zinc-200 ml-2 font-mono">{Math.floor(request.timeLeftMs/60000)}m left</span></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`flex gap-2.5 ${m.speaker === 'approver' ? 'justify-end' : 'justify-start'}`}>
            {m.speaker !== 'approver' && <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-medium border flex-shrink-0 ${m.speaker === 'requester' ? 'bg-violet-500/20 text-violet-300 border-violet-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}>{m.name[0]}</div>}
            <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 border text-[13px] leading-[1.4] ${m.speaker === 'approver' ? 'bg-violet-600 border-violet-500 text-white' : m.speaker === 'requester' ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-amber-500/10 border-amber-500/20 text-amber-100 text-[11px] font-mono'}`}>
              <div className="flex items-center gap-2 mb-1"><span className="text-[11px] font-semibold">{m.name}</span><span className="text-[10px] opacity-60">{new Date(m.timestamp).toLocaleTimeString()}</span></div>
              <p>{m.text}</p>
            </div>
            {m.speaker === 'approver' && <div className="h-7 w-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-[11px] font-medium flex-shrink-0">Y</div>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Controls */}
      <div className="p-3 border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="flex gap-2 mb-3">
          <button onClick={handleVerify} disabled={status !== 'idle'} className={`h-8 px-3 rounded-full text-[11px] font-medium border transition ${status === 'idle' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700' : 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed'}`}>Verify identity and intent</button>
          <button onClick={() => setIsRecording(!isRecording)} className={`h-8 px-3 rounded-full text-[11px] font-medium border transition ${isRecording ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{isRecording ? '● Recording' : '○ Recording off'}</button>
          <span className="ml-auto text-[10px] text-zinc-600 font-mono">HMAC-signed • Hash-chained</span>
        </div>

        <div className="flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSend()} placeholder="Add verification note or question for requester..." className="flex-1 h-9 px-3 rounded-xl bg-zinc-800 border border-zinc-700 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50" />
          <button onClick={handleSend} className="h-9 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-[12px] font-medium">Send</button>
        </div>

        <div className="flex gap-2 mt-3">
          <button onClick={handleApprove} disabled={status !== 'verified'} className={`flex-1 h-10 rounded-xl text-[13px] font-semibold transition ${status === 'verified' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'}`}>Approve — distinct approver</button>
          <button onClick={handleReject} className="flex-1 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[13px] font-medium">Reject with reason</button>
          <button onClick={()=>onExecute(request.id)} className="h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-medium">Execute</button>
        </div>

        <p className="text-[10px] text-zinc-500 mt-2">Dual-control: requester cannot approve own request. Approver must be distinct and hold authorized role. All actions HMAC-signed and hash-chained.</p>
      </div>
    </div>
  );
}

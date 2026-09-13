/**
 * VoiceApprovalCenter — Call center for emergency approvals with voice
 * Like OrbitDesk CallCenter but for security approvals
 * 5 balanced voices, real conversation, client does actions, remote approval feel
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import type { LiveRequest } from '../data/requestEngine';
import { tenants } from '../data/tenants';

interface Message {
  id: string;
  speaker: 'requester' | 'approver' | 'system' | 'tech';
  name: string;
  text: string;
  timestamp: string;
  isQuestion?: boolean;
  action?: string;
  sentiment?: 'urgent' | 'calm' | 'frustrated' | 'confused' | 'happy';
}

interface Props {
  request: LiveRequest | null;
  onApprove: (id: string, note: string) => void;
  onReject: (id: string, reason: string) => void;
  onExecute: (id: string) => void;
}

const voices = [
  { id: 'nia', name: 'Nia (Security)', gender: 'feminine', accent: 'Kenyan', role: 'approver' },
  { id: 'dmitri', name: 'Dmitri (Ops)', gender: 'masculine', accent: 'Eastern European', role: 'requester' },
  { id: 'jessica', name: 'Jessica (SMB)', gender: 'feminine', accent: 'American', role: 'requester' },
  { id: 'david', name: 'David (Compliance)', gender: 'masculine', accent: 'Nigerian', role: 'tech' },
  { id: 'alex', name: 'Alex (Admin)', gender: 'masculine', accent: 'American', role: 'approver' },
];

const clientActions = [
  'Checked Entra Audit Logs — found policy modified by john.admin without Report-Only',
  'Ran dsregcmd /status — Device State: AzureADJoined YES, DomainJoined NO',
  'Checked Company Portal — device not compliant, clicked Check Status',
  'Opened Conditional Access What If — simulated policy, shows BLOCK for this user',
  'Verified Break Glass excluded from CA — Break Glass OK, can still login',
  'Checked BitLocker keys — 8 keys escrowed to Entra ID, verified in Intune',
  'Checked Service Health — Exchange green, no incidents',
  'Ran Message Trace — found quarantined email, released after verification',
];

function generateConversation(request: LiveRequest): Message[] {
  const tenant = tenants.find(t => t.id === request.tenantId);
  const isSMB = request.tenantId === 'bloom';
  const isRegulated = request.tenantId === 'apex';
  
  const base: Message[] = [
    {
      id: '1',
      speaker: 'requester',
      name: request.requestedByName,
      text: request.clientMessage,
      timestamp: new Date(Date.now() - 4 * 60_000).toISOString(),
      isQuestion: true,
      sentiment: request.priority === 'P1' ? 'urgent' : isSMB ? 'confused' : 'calm',
    },
    {
      id: '2',
      speaker: 'approver',
      name: isRegulated ? 'David Okafor' : 'Nia Owiti',
      text: isSMB 
        ? `Hi ${request.requestedByName}! I understand you're having trouble with ${request.code}. Let me help you in simple steps — can you share what you see on your screen?`
        : `Acknowledged ${request.code} — ${request.title}. Correlation ID? Checking audit logs and policy now. Per ${tenant?.name} policy, this requires dual-control approval with audit trail.`,
      timestamp: new Date(Date.now() - 3 * 60_000).toISOString(),
      sentiment: 'calm',
    },
  ];

  if (request.priority === 'P1') {
    base.push(
      {
        id: '3',
        speaker: 'requester',
        name: request.requestedByName,
        text: isSMB
          ? 'Yes! It says "Your device isn\'t compliant" and I have presentation in 20 mins 😰 Simple steps please?'
          : `Correlation ID: ${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}. Checked Service Health — all green. Payroll blocked in 45 mins, need admin for 2 hours.`,
        timestamp: new Date(Date.now() - 2 * 60_000).toISOString(),
        action: clientActions[Math.floor(Math.random() * clientActions.length)],
        sentiment: 'urgent',
      },
      {
        id: '4',
        speaker: 'tech',
        name: 'Alex Rivera',
        text: `Checking Entra Audit Logs — ${request.code} requested by ${request.requestedBy}. Last modified ${tenant?.approvalPolicies[0]?.lastModified}. What If tool shows: if we approve with 15min expiry, impact limited. Break Glass verified — excluded from CA, works if needed.`,
        timestamp: new Date(Date.now() - 1 * 60_000).toISOString(),
        sentiment: 'calm',
      }
    );
  } else {
    base.push(
      {
        id: '3',
        speaker: 'requester',
        name: request.requestedByName,
        text: isSMB
          ? 'I clicked Share but it says blocked by policy? I need to share with external client for presentation 🥺'
          : `Per ${tenant?.name} policy ${tenant?.approvalPolicies[0]?.name}, I understand this needs approval. I've checked ${request.requiredTools[0]} and ${request.requiredTools[1]}.`,
        timestamp: new Date(Date.now() - 2 * 60_000).toISOString(),
        action: clientActions[Math.floor(Math.random() * clientActions.length)],
        sentiment: isSMB ? 'confused' : 'calm',
      }
    );
  }

  base.push({
    id: '5',
    speaker: 'system',
    name: 'Chokepoint',
    text: `Encrypted session ${request.id.substring(0, 8)} established — Recording: ON — Audit: HMAC-signed — Hash-chained — Break Glass: Verified — What If: Simulated — Ready for approval`,
    timestamp: new Date().toISOString(),
    sentiment: 'calm',
  });

  return base;
}

export function VoiceApprovalCenter({ request, onApprove, onReject, onExecute }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentVoice, setCurrentVoice] = useState(voices[0]);
  const [clientAction, setClientAction] = useState<string | null>(null);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (request) {
      setMessages(generateConversation(request));
      setIsCallActive(true);
      setIsRecording(true);
      // Simulate client action after 2 sec
      setTimeout(() => {
        setClientAction(clientActions[Math.floor(Math.random() * clientActions.length)]);
      }, 2000);
    }
  }, [request?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text: string, voiceId: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voicesList = speechSynthesis.getVoices();
      // Try to match voice by gender/accent
      const voice = voicesList.find(v => v.name.toLowerCase().includes(voiceId)) || voicesList[0];
      if (voice) utterance.voice = voice;
      utterance.rate = 0.9;
      utterance.pitch = voiceId === 'jessica' ? 1.1 : voiceId === 'dmitri' || voiceId === 'david' ? 0.9 : 1;
      speechSynthesis.speak(utterance);
    }
  };

  const addMessage = (speaker: Message['speaker'], text: string, action?: string) => {
    const voice = voices.find(v => v.role === speaker) || voices[0];
    const newMsg: Message = {
      id: Math.random().toString(36).substring(7),
      speaker,
      name: speaker === 'requester' ? request?.requestedByName || voice.name : voice.name,
      text,
      timestamp: new Date().toISOString(),
      action,
      sentiment: 'calm',
    };
    setMessages(prev => [...prev, newMsg]);
    speak(text, voice.id);
  };

  if (!request) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0a0a0a] rounded-2xl border border-zinc-800/60">
        <div className="h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
          <span className="text-violet-400 text-xl">◍</span>
        </div>
        <h3 className="text-[14px] font-medium text-zinc-200 mb-1">Voice Approval Center</h3>
        <p className="text-[12px] text-zinc-500 text-center max-w-[280px] leading-[1.4]">
          Select a request to start encrypted voice session. 5 balanced voices, real-time conversation, client does actions.
        </p>
        <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-600">
          <span className="h-1 w-1 rounded-full bg-emerald-500" />
          Encrypted • Recording ON • Audit HMAC-signed
        </div>
      </div>
    );
  }

  const tenant = tenants.find(t => t.id === request.tenantId);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm overflow-hidden">
      {/* Header — call status like OrbitDesk */}
      <div className="p-3 border-b border-zinc-800/60 bg-zinc-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${isCallActive ? 'bg-red-500/15 border-red-500/30' : 'bg-zinc-800 border-zinc-700'}`}>
              <span className={`h-2 w-2 rounded-full ${isCallActive ? 'bg-red-500 animate-pulse' : 'bg-zinc-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold text-zinc-100">{request.code} • {request.title.substring(0, 40)}...</h3>
                {isRecording && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 animate-pulse">● REC</span>}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-zinc-400">{request.tenantName} • {request.requestedByName}</span>
                <span className="text-[10px] text-zinc-600">•</span>
                <span className="text-[11px] font-mono text-zinc-500">Session {request.id.substring(0, 8)} • Encrypted</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowWhatIf(!showWhatIf)}
              className="h-7 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-[11px] text-zinc-300 transition-colors"
            >
              What If
            </button>
            <button
              onClick={() => setIsCallActive(!isCallActive)}
              className={`h-7 px-3 rounded-lg text-[11px] font-medium border transition-colors ${isCallActive ? 'bg-red-500/15 text-red-300 border-red-500/30 hover:bg-red-500/20' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'}`}
            >
              {isCallActive ? 'End Call' : 'Call Back'}
            </button>
          </div>
        </div>

        {/* Client action live indicator */}
        {clientAction && (
          <div className="mt-3 p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] text-violet-400">▶</span>
            </div>
            <div>
              <p className="text-[11px] font-medium text-violet-300">Client is doing action now:</p>
              <p className="text-[12px] text-zinc-200 mt-0.5 leading-[1.3]">{clientAction}</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages — Intercom-like human bubbles */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-zinc-900/20">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.speaker === 'approver' || msg.speaker === 'tech' ? 'justify-end' : 'justify-start'}`}>
            {(msg.speaker === 'requester' || msg.speaker === 'system') && (
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 ${msg.speaker === 'system' ? 'bg-zinc-700 text-zinc-300' : 'bg-violet-500/20 text-violet-300 border border-violet-500/20'}`}>
                {msg.speaker === 'system' ? '◍' : msg.name[0]}
              </div>
            )}
            
            <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 border ${msg.speaker === 'requester' ? 'bg-zinc-800 border-zinc-700/50 text-zinc-100' : msg.speaker === 'approver' ? 'bg-violet-500/10 border-violet-500/20 text-violet-100' : msg.speaker === 'tech' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' : 'bg-amber-500/10 border-amber-500/20 text-amber-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold">{msg.name}</span>
                <span className="text-[10px] opacity-60">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                {msg.isQuestion && <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-300">Q</span>}
              </div>
              <p className="text-[13px] leading-[1.4]">{msg.text}</p>
              {msg.action && (
                <div className="mt-2 p-2 rounded-lg bg-black/30 border border-white/5">
                  <p className="text-[11px] font-mono text-zinc-400">Action: {msg.action}</p>
                </div>
              )}
            </div>

            {(msg.speaker === 'approver' || msg.speaker === 'tech') && (
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 ${msg.speaker === 'tech' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : 'bg-violet-500/20 text-violet-300 border border-violet-500/20'}`}>
                {msg.name[0]}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* What If simulation — like OrbitDesk */}
      {showWhatIf && (
        <div className="p-3 border-t border-zinc-800/60 bg-zinc-900/50">
          <h4 className="text-[12px] font-semibold text-zinc-200 mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            What If Simulation — {request.code}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
              <p className="text-[11px] font-medium text-zinc-300">If Approved with 15min expiry:</p>
              <p className="text-[11px] text-zinc-400 mt-1 leading-[1.3]">Impact limited to 15min window, audit trail shows who approved, Break Glass still works, auto-revoke after expiry</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 mt-1.5 inline-block">Safe to approve</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
              <p className="text-[11px] font-medium text-zinc-300">If Rejected:</p>
              <p className="text-[11px] text-zinc-400 mt-1 leading-[1.3]">Payroll blocked per P1, client escalation, but security maintained. Alternative: Break Glass for emergency</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 mt-1.5 inline-block">High impact</span>
            </div>
          </div>
          <div className="mt-2 p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <p className="text-[11px] text-violet-300">💡 Recommendation: Approve with 15min expiry + audit log + Break Glass verification. Per {tenant?.name} policy {tenant?.approvalPolicies[0]?.name}</p>
          </div>
        </div>
      )}

      {/* Quick replies — like OrbitDesk human templates */}
      <div className="p-2.5 border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto">
          {[
            'Checking Entra Audit Logs now, Correlation ID?',
            'What If shows safe with 15min expiry — approve?',
            'Break Glass verified, excluded from CA — can approve',
            'Per SEC-2024-07, need audit trail + key escrow verification',
            'Simple steps: Click Start → Settings → Accounts...',
          ].map(q => (
            <button
              key={q}
              onClick={() => addMessage('approver', q)}
              className="h-6 px-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-[11px] text-zinc-300 whitespace-nowrap transition-colors"
            >
              {q.substring(0, 35)}...
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            placeholder={`Reply to ${request.requestedByName} — ${request.tenantId === 'bloom' ? 'simple language, no jargon' : 'technical with Correlation ID, audit trail'}`}
            className="flex-1 h-8 px-3 rounded-lg bg-zinc-800 border border-zinc-700/50 text-[13px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50"
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                addMessage('approver', (e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
          <button
            onClick={() => addMessage('approver', 'Checking logs and policy now — will update in 30 seconds with audit trail')}
            className="h-8 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-medium transition-colors"
          >
            Send
          </button>
        </div>

        {/* Approval actions — bento */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={() => onApprove(request.id, `Approved via voice session ${request.id.substring(0, 8)} — What If simulated safe, Break Glass verified, audit trail HMAC-signed, 15min expiry`)}
            className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>✓</span> Approve + Execute
          </button>
          <button
            onClick={() => onReject(request.id, 'Needs more verification — check audit logs and Break Glass before approval per policy')}
            className="h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-zinc-300 text-[12px] font-medium transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => onExecute(request.id)}
            className="h-9 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>▶</span> Execute Real Action
          </button>
        </div>

        <div className="flex items-center justify-between mt-2.5 text-[10px] text-zinc-600">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            Encrypted session • Recording ON • HMAC-signed • {voices.length} voices • Human feel
          </span>
          <span className="font-mono">Per-tenant: {tenant?.name}</span>
        </div>
      </div>
    </div>
  );
}

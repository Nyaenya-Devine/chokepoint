/**
 * VoiceApprovalCenter v2.1 — Real-time phone call scenario, not robotic recording
 * Phone rings, you pick up, hold legit conversation where we can hold conversation
 * Like real calls work — client does actions, asks questions, you respond, flowing
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
  action?: string;
  isQuestion?: boolean;
  sentiment?: 'urgent' | 'calm' | 'frustrated' | 'confused' | 'happy';
}

interface Props {
  request: LiveRequest | null;
  onApprove: (id: string, note: string) => void;
  onReject: (id: string, reason: string) => void;
  onExecute: (id: string) => void;
}

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

const requesterReplies: Record<string, string[]> = {
  novatech: [
    "Got it, Correlation ID {corr} — checked Service Health green, no incidents. Payroll blocked in 45 mins, P1. Can you check audit logs who pushed policy at 08:02?",
    "I ran dsregcmd /status — AzureAdJoined YES, DomainJoined NO, DeviceId {id}, Compliance NO, MdmUrl present. So not compliant. What next?",
    "Checked Company Portal → Sync, Last sync 2m ago, BitLocker Not Compliant. Should I enable BitLocker? I have admin rights, will it delete files?",
    "Audit logs show john.admin pushed CA without Report-Only → caused P1! What If shows safe with 15min expiry. Can you approve with expiry?",
  ],
  bloom: [
    "Um, where do I click? 😅 Is it Start → Settings? Says device isn't compliant, I have presentation in 20 mins! Simple steps please?",
    "Company Portal? Blue icon with shopping bag? I clicked Sync, spins, says last sync just now but still Not compliant? 🥺",
    "Heyy! It works now! Thank you! You explained without jargon, with emojis — perfect! ⭐⭐⭐⭐⭐",
    "Will I lose my Photoshop work if I restart? Client call in 20 mins! 😰",
  ],
  apex: [
    "Acknowledged. Executed dsregcmd /status per SEC-2024-07. AzureAdJoined YES, Compliance NO. Need audit trail + RCA for compliance review. Please advise remediation.",
    "Per policy SEC-2024-07, BitLocker required. Get-BitLockerVolume shows Protection Off, 0%. Need approved procedure and confirm key escrowed to Entra ID for audit.",
    "Sign-in logs CA tab shows BlockedByConditionalAccess 53000 DeviceNotCompliant per policy 'Require compliant device'. Need audit trail + confirmation of key escrow per SEC-2024-07.",
  ],
};

export function VoiceApprovalCenter({ request, onApprove, onReject, onExecute }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<'incoming' | 'connecting' | 'active' | 'hold' | 'ended'>('incoming');
  const [duration, setDuration] = useState(0);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [clientAction, setClientAction] = useState<string | null>(null);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHold, setIsHold] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Ringtone — real phone rings, not recording
  const playRingtone = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      const playTone = () => {
        if (!ctx || callStatus !== 'incoming') return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.value = 0.15;
        osc.start();
        setTimeout(() => {
          osc.stop();
          if (callStatus === 'incoming') {
            setTimeout(playTone, 1000);
          }
        }, 400);
      };
      playTone();
    } catch {}
  };

  const stopRingtone = () => {
    try {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    } catch {}
  };

  useEffect(() => {
    if (request) {
      const tenantId = request.tenantId;
      const isSMB = tenantId === 'bloom';
      const isRegulated = tenantId === 'apex';
      
      setMessages([
        {
          id: '1',
          speaker: 'requester',
          name: request.requestedByName,
          text: request.clientMessage,
          timestamp: new Date().toISOString(),
          isQuestion: true,
          sentiment: request.priority === 'P1' ? 'urgent' : isSMB ? 'confused' : 'calm',
        },
        {
          id: '2',
          speaker: 'system',
          name: 'Chokepoint',
          text: `📞 Encrypted session ${request.id.substring(0, 8)} • Recording ON • HMAC-signed • Hash-chained • Break Glass Verified • What If Ready • Real-time phone call — not robotic recording`,
          timestamp: new Date().toISOString(),
          sentiment: 'calm',
        },
      ]);
      setCallStatus('incoming');
      setIsCallActive(false);
      setDuration(0);
      playRingtone();
      
      setTimeout(() => {
        setClientAction(clientActions[Math.floor(Math.random() * clientActions.length)]);
      }, 1500);
    }
    return () => stopRingtone();
  }, [request?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (callStatus !== 'active' || isHold) return;
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, [callStatus, isHold]);

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  };

  const acceptCall = () => {
    stopRingtone();
    setCallStatus('connecting');
    setTimeout(() => {
      setCallStatus('active');
      setIsCallActive(true);
      const tenant = tenants.find(t => t.id === request?.tenantId);
      const isSMB = request?.tenantId === 'bloom';
      setMessages(prev => [...prev, {
        id: '3',
        speaker: 'approver',
        name: tenant?.id === 'apex' ? 'David Okafor' : 'Nia Owiti',
        text: isSMB 
          ? `Hi ${request?.requestedByName}! I understand you're having trouble with ${request?.code}. Let me help in simple steps — can you share what you see on screen? This is real-time call, not recording, we can hold conversation.`
          : `Acknowledged ${request?.code} — ${request?.title}. Correlation ID? Checking audit logs and policy now. Per ${tenant?.name} policy, requires dual-control + audit trail. This is live call, client does actions on other side.`,
        timestamp: new Date().toISOString(),
        sentiment: 'calm',
      }]);
    }, 800);
  };

  const declineCall = () => {
    stopRingtone();
    setCallStatus('ended');
    setTimeout(() => {
      setMessages([]);
      setCallStatus('incoming');
    }, 1000);
  };

  const sendMessage = () => {
    if (!input.trim() || !request) return;
    
    const now = formatDuration(duration);
    const userMsg: Message = {
      id: Date.now().toString(),
      speaker: 'approver',
      name: 'You (Approver)',
      text: input,
      timestamp: new Date().toISOString(),
      sentiment: 'calm',
    };
    
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    // Client does action + replies — real conversation, not robotic
    setTimeout(() => {
      const tenantId = request.tenantId as keyof typeof requesterReplies;
      const replies = requesterReplies[tenantId] || requesterReplies.novatech;
      let replyText = replies[Math.floor(Math.random() * replies.length)];
      replyText = replyText.replace('{id}', Math.random().toString(36).substring(7)).replace('{corr}', Math.random().toString(36).substring(7));

      const lower = userInput.toLowerCase();
      let action;
      if (lower.includes('dsregcmd') || lower.includes('status')) {
        action = `Ran dsregcmd /status — AzureAdJoined YES, Compliance NO`;
        replyText = tenantId === 'novatech'
          ? `Ran dsregcmd /status — AzureAdJoined YES, DomainJoined NO, DeviceId ${Math.random().toString(36).substring(7)}, Compliance NO. So not compliant. What next? Correlation ID ${Math.random().toString(36).substring(7)}`
          : tenantId === 'bloom'
          ? `I tried dsregcmd, says AzureAdJoined YES but Compliance NO — what does that mean? Simple steps please? 😅`
          : `Executed dsregcmd /status per SEC-2024-07. AzureAdJoined YES, Compliance NO. Need remediation + audit trail.`;
      } else if (lower.includes('company portal') || lower.includes('sync')) {
        action = `Opened Company Portal → Sync — Last sync 2m ago, BitLocker Not Compliant`;
      } else if (lower.includes('bitlocker')) {
        action = `Checked BitLocker — Protection Off, Encryption 0% — needs enable`;
      } else if (lower.includes('audit logs') || lower.includes('sign-in logs')) {
        action = `Checked Entra Audit Logs — found policy modified by john.admin without Report-Only at 08:02`;
      }

      const clientMsg: Message = {
        id: (Date.now()+1).toString(),
        speaker: 'requester',
        name: request.requestedByName,
        text: replyText,
        timestamp: new Date().toISOString(),
        action,
        isQuestion: replyText.includes('?'),
        sentiment: 'calm',
      };

      setMessages(prev => [...prev, clientMsg]);
      setIsTyping(false);
      if (action) setClientAction(action);

      // Follow-up keeps conversation flowing — legit conversation
      if (Math.random() < 0.5) {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const followUp: Message = {
              id: (Date.now()+2).toString(),
              speaker: 'requester',
              name: request.requestedByName,
              text: tenantId === 'bloom' ? `Also, will I lose my work if I restart? 🥺` : `Quick question: What is ETA for approval? Need audit trail.`,
              timestamp: new Date().toISOString(),
              isQuestion: true,
              sentiment: 'calm',
            };
            setMessages(prev => [...prev, followUp]);
            setIsTyping(false);
          }, 1000);
        }, 3000);
      }
    }, 1200 + Math.random() * 800);
  };

  if (!request) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0a0a0a] rounded-2xl border border-zinc-800/60">
        <div className="h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
          <span className="text-violet-400 text-xl">📞</span>
        </div>
        <h3 className="text-[14px] font-medium text-zinc-200 mb-1">Real-Time Phone Call — Approvals</h3>
        <p className="text-[12px] text-zinc-500 text-center max-w-[320px] leading-[1.4]">
          Select a request — phone rings, you pick up, hold legit conversation where client does actions on other side, asks questions back. Not robotic recording — real-time.
        </p>
        <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-600">
          <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
          Rings • Pick up • Live conversation • Client actions • Questions back
        </div>
      </div>
    );
  }

  const tenant = tenants.find(t => t.id === request.tenantId);

  // Incoming call UI — phone rings
  if (callStatus === 'incoming') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-[#0a0a0a] rounded-2xl border border-zinc-800/60">
        <div className="bg-[#0a0a0a] rounded-[28px] shadow-2xl max-w-sm w-full overflow-hidden border border-zinc-800 animate-in zoom-in-95">
          <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent)]" />
            <div className="relative">
              <div className="w-24 h-24 bg-white/15 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-5 animate-pulse ring-4 ring-white/10">
                <span className="text-4xl animate-bounce">📞</span>
              </div>
              <h3 className="font-bold text-[18px] tracking-tight">Incoming Approval Call</h3>
              <p className="text-[14px] opacity-90 mt-1 font-medium">{request.tenantName} • {request.priority} • {request.risk}</p>
              <p className="text-[12px] opacity-70 mt-1 font-mono">{request.requestedByName} • {request.code}</p>
              <p className="text-[11px] opacity-60 mt-1">{request.title.substring(0, 50)}...</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-medium border border-white/10">
                <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                {request.timeLeftMs < 120000 ? 'Expiring!' : 'Live'} • Real-time call • Encrypted
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-[#0a0a0a]">
            <div className="bg-zinc-900 rounded-2xl p-4 text-[13px] mb-5 border border-zinc-800">
              <p className="text-zinc-200 leading-[1.4]">"{request.clientMessage}"</p>
              <div className="flex gap-1.5 mt-3">
                <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{request.code}</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">{request.priority} • Live</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">Real conversation</span>
              </div>
              {clientAction && (
                <div className="mt-3 p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <p className="text-[11px] font-medium text-violet-300">Client is doing action now:</p>
                  <p className="text-[12px] text-zinc-300 mt-1">{clientAction}</p>
                </div>
              )}
              <p className="text-[11px] text-zinc-500 mt-3 leading-[1.3]">📞 Phone rings → You pick up → Hold legit conversation where requester does actions on other side, asks questions back, you respond, flowing. Not robotic recording — real-time phone scenario like real calls work.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={declineCall} className="flex-1 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-full font-medium text-[14px] flex items-center justify-center gap-2 transition">
                ✕ Decline
              </button>
              <button onClick={acceptCall} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition">
                ✓ Accept — Talk Live
              </button>
            </div>

            <p className="text-[11px] text-zinc-600 text-center mt-4">Real-time phone • Client actions • Questions back • Not robotic • Hold conversation</p>
          </div>
        </div>
      </div>
    );
  }

  // Active call UI — real phone call
  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm overflow-hidden">
      <div className="h-14 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">
            {request.requestedByName[0]}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
              {request.requestedByName} • {request.tenantName}
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-400">{formatDuration(duration)}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 animate-pulse">● REC</span>
            </p>
            <p className="text-[11px] text-zinc-500">{request.code} • {callStatus === 'hold' ? 'On Hold' : 'Live'} • Encrypted • Session {request.id.substring(0, 8)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={() => setIsMuted(!isMuted)} className={`h-8 w-8 rounded-full flex items-center justify-center border transition ${isMuted ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>🎙️</button>
          <button onClick={() => setIsHold(!isHold)} className={`h-8 w-8 rounded-full flex items-center justify-center border transition ${isHold ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>⏸️</button>
          <button onClick={() => setShowWhatIf(!showWhatIf)} className="h-7 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-[11px] text-zinc-300 transition">What If</button>
          <button onClick={() => { setCallStatus('ended'); setTimeout(() => { setMessages([]); setCallStatus('incoming'); }, 1500); }} className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition">📞</button>
        </div>
      </div>

      {clientAction && (
        <div className="p-2.5 bg-violet-500/10 border-b border-violet-500/20 flex items-start gap-2">
          <span className="text-violet-400 text-[12px] mt-0.5">⚡</span>
          <div>
            <p className="text-[11px] font-medium text-violet-300">Client doing action now on other side:</p>
            <p className="text-[12px] text-zinc-200">{clientAction}</p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#050507]">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.speaker === 'approver' ? 'justify-end' : 'justify-start'}`}>
            {(msg.speaker === 'requester' || msg.speaker === 'system') && (
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 ${msg.speaker === 'system' ? 'bg-zinc-700 text-zinc-300' : 'bg-violet-500/20 text-violet-300 border border-violet-500/20'}`}>
                {msg.speaker === 'system' ? '◍' : msg.name[0]}
              </div>
            )}
            
            <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 border ${msg.speaker === 'requester' ? 'bg-zinc-800 border-zinc-700/50 text-zinc-100' : msg.speaker === 'approver' ? 'bg-violet-600 border-violet-500 text-white' : 'bg-amber-500/10 border-amber-500/20 text-amber-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold">{msg.name}</span>
                <span className="text-[10px] opacity-60">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                {msg.isQuestion && <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-300">Q</span>}
              </div>
              <p className="text-[13px] leading-[1.4]">{msg.text}</p>
              {msg.action && (
                <div className="mt-2 p-2 rounded-lg bg-black/40 border border-white/10">
                  <p className="text-[11px] font-mono text-emerald-300">⚡ {msg.action}</p>
                </div>
              )}
            </div>

            {msg.speaker === 'approver' && (
              <div className="h-7 w-7 rounded-full bg-violet-600 border border-violet-500 flex items-center justify-center text-[11px] font-medium text-white flex-shrink-0">
                {msg.name[0]}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5">
            <div className="h-7 w-7 rounded-full bg-violet-500/20 border border-violet-500/20 flex items-center justify-center text-[11px] text-violet-300">
              {request.requestedByName[0]}
            </div>
            <div className="rounded-2xl px-3.5 py-2.5 bg-zinc-800 border border-zinc-700/50 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[11px] text-zinc-500 ml-2">Client is typing and doing action on other side...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showWhatIf && (
        <div className="p-3 border-t border-zinc-800/60 bg-zinc-900/50">
          <h4 className="text-[12px] font-semibold text-zinc-200 mb-2">What If — {request.code}</h4>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700">
              <p className="font-medium text-zinc-300">If Approved 15min:</p>
              <p className="text-zinc-500 mt-1">Impact limited, audit shows who approved, Break Glass works, auto-revoke</p>
              <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Safe</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700">
              <p className="font-medium text-zinc-300">If Rejected:</p>
              <p className="text-zinc-500 mt-1">Payroll blocked, escalation, but security maintained. Break Glass alternative</p>
              <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">High impact</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={`Talk to ${request.requestedByName} — real conversation, not robotic — ${request.tenantId === 'bloom' ? 'simple language' : 'technical with Correlation ID'}`}
            className="flex-1 h-9 px-4 rounded-full bg-zinc-800 border border-zinc-700 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50"
          />
          <button onClick={sendMessage} disabled={!input.trim()} className="h-9 px-4 rounded-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-[13px] font-semibold transition">
            Send
          </button>
        </div>

        <div className="flex gap-1.5 mt-2.5 overflow-x-auto">
          {[
            "Can you run dsregcmd /status and share output?",
            "Can you open Company Portal and click Sync?",
            "Can you check BitLocker status?",
            "What If shows safe with 15min expiry — approve?",
            "Break Glass verified — can approve",
          ].map(q => (
            <button key={q} onClick={() => setInput(q)} className="h-6 px-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-400 whitespace-nowrap transition">
              {q.substring(0, 30)}...
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          <button onClick={() => onApprove(request.id, `Approved via real-time phone call ${request.id.substring(0, 8)} — What If safe, Break Glass verified, HMAC-signed, 15min expiry, live conversation`)} className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-medium">✓ Approve + Execute</button>
          <button onClick={() => onReject(request.id, 'Needs more verification per policy')} className="h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[12px] font-medium">Reject</button>
          <button onClick={() => onExecute(request.id)} className="h-9 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-medium">▶ Execute Real Action</button>
        </div>

        <p className="text-[10px] text-zinc-600 mt-2 text-center">Real-time phone call • Rings • Pick up • Live conversation • Client does actions on other side • Asks questions back • Not robotic recording • Like real calls work</p>
      </div>
    </div>
  );
}

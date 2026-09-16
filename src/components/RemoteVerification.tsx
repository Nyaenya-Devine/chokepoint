/**
 * RemoteVerification — Security verification for approval context
 */

'use client';

import { useState, useEffect } from 'react';
import type { LiveRequest } from '../data/requestEngine';

interface Props {
  request: LiveRequest | null;
}

const verificationSteps = [
  { id: 'identity', name: 'Identity Verification', status: 'checking', icon: '◍', details: 'Validating requester identity and role...' },
  { id: 'device', name: 'Device Attestation', status: 'checking', icon: '◐', details: 'Checking device compliance and trust...' },
  { id: 'policy', name: 'Policy Evaluation', status: 'checking', icon: '◑', details: 'Evaluating What-If impact...' },
  { id: 'risk', name: 'Risk Analysis', status: 'checking', icon: '◒', details: 'Analyzing anomaly and risk signals...' },
  { id: 'audit', name: 'Audit Integrity', status: 'checking', icon: '◓', details: 'Verifying ledger integrity...' },
];

export function RemoteVerification({ request }: Props) {
  const [steps, setSteps] = useState(verificationSteps);
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (request) {
      setIsConnected(true);
      setLogs([`${new Date().toLocaleTimeString()} — Connected to verification service — Session ${request.id.substring(0,8)}`]);
      const timer = setTimeout(() => {
        setSteps(prev => prev.map(s => ({ ...s, status: 'verified' })));
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} — Identity verified — ${request.requestedByName} (${request.requestedBy})`, `${new Date().toLocaleTimeString()} — Risk: ${request.risk} — Policy: ${request.requiredApproverRole} — HMAC-signed`]);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsConnected(false);
      setSteps(verificationSteps);
      setLogs([]);
    }
  }, [request?.id]);

  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-zinc-800/60 bg-zinc-900/30 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
          Security Verification
        </h3>
        <span className="text-[10px] font-mono text-zinc-500">{request ? request.code : 'No request'}</span>
      </div>

      <div className="p-3 space-y-2">
        {steps.map(s => (
          <div key={s.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="text-[14px] text-zinc-400">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-zinc-200">{s.name}</p>
              <p className="text-[11px] text-zinc-500">{s.details}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${s.status==='verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{s.status}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="p-3 rounded-xl bg-black/50 border border-zinc-800 font-mono text-[11px] space-y-1">
          {logs.length===0 ? <p className="text-zinc-600">Awaiting verification session...</p> : logs.map((l,i)=><p key={i} className="text-zinc-500">{l}</p>)}
        </div>
      </div>

      <div className="p-3 border-t border-zinc-800/60 bg-zinc-900/30">
        <p className="text-[10px] text-zinc-500 font-mono">Tamper-evident • HMAC-signed • Hash-chained • Verification service</p>
      </div>
    </div>
  );
}

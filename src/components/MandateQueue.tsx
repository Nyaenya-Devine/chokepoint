/**
 * MandateQueue — Dual-control mandates requiring four-eyes approval
 * Focused on high-impact operations with risk scoring and distinct approver verification
 */

'use client';

import { useEffect, useState } from 'react';

interface Mandate {
  id: string;
  code: string;
  title: string;
  priority: 'P1' | 'P2' | 'P3';
  risk: number;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  requester: string;
  requesterRole: string;
  approverRequired: string;
  createdAt: number;
  expiresAt: number;
  reason: string;
  hmac: string;
}

const mockMandates: Mandate[] = [
  { id: '1', code: 'PRIV-001', title: 'Escalate operator to admin for incident response', priority: 'P1', risk: 92, status: 'pending', requester: 'operator', requesterRole: 'Operator', approverRequired: 'Admin distinct', createdAt: Date.now() - 2*60*1000, expiresAt: Date.now() + 13*60*1000, reason: 'Incident IR-2024-112: admin privilege required to isolate compromised host', hmac: 'a7f3c9e2b2e1d4f8' },
  { id: '2', code: 'FLEET-004', title: 'Wipe fleet of 50 devices — lost shipment verified', priority: 'P1', risk: 95, status: 'pending', requester: 'operator', requesterRole: 'Operator', approverRequired: 'Admin + Auditor', createdAt: Date.now() - 5*60*1000, expiresAt: Date.now() + 10*60*1000, reason: 'Shipment lost, devices contain PII, emergency procedure verified', hmac: 'c4d8e1a5e9f2a6b3' },
  { id: '3', code: 'AGENT-002', title: 'Grant agent billing write access to production', priority: 'P1', risk: 88, status: 'in_review', requester: 'operator', requesterRole: 'Operator', approverRequired: 'Admin only', createdAt: Date.now() - 8*60*1000, expiresAt: Date.now() + 7*60*1000, reason: 'AI agent requires billing write for automated invoicing — ASI03 risk evaluation required', hmac: 'f1a3c7d9e2b4c8a1' },
  { id: '4', code: 'COMPLIANCE-005', title: 'Disable DLP policy for external sharing', priority: 'P2', risk: 67, status: 'pending', requester: 'operator', requesterRole: 'Operator', approverRequired: 'Auditor required', createdAt: Date.now() - 12*60*1000, expiresAt: Date.now() + 3*60*1000, reason: 'External audit requires sharing — report-only evaluation first per policy', hmac: 'b2e1d4f8a7c3e9f2' },
];

export function MandateQueue({ onSelect }: { onSelect?: (m: Mandate) => void }) {
  const [mandates, setMandates] = useState<Mandate[]>(mockMandates);
  const [filter, setFilter] = useState<'all' | 'pending' | 'P1'>('all');

  useEffect(() => {
    const interval = setInterval(() => setMandates(prev => [...prev]), 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = mandates.filter(m => {
    if (filter === 'pending' && m.status !== 'pending') return false;
    if (filter === 'P1' && m.priority !== 'P1') return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] rounded-[16px] border border-zinc-800 overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-[13px] font-semibold text-zinc-100">Dual-Control Mandates</h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">{mandates.length} total • {mandates.filter(m=>m.status==='pending').length} pending</span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {(['all','pending','P1'] as const).map(f => (
            <button key={f} onClick={()=>setFilter(f)} className={`h-7 px-3 rounded-full text-[11px] font-medium border capitalize ${filter===f ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filtered.map(m => {
          const timeLeft = Math.max(0, m.expiresAt - Date.now());
          const mins = Math.floor(timeLeft/60000);
          return (
            <button key={m.id} onClick={()=>onSelect?.(m)} className="w-full text-left p-3 rounded-[12px] bg-zinc-900 border border-zinc-800 hover:border-amber-500/20 hover:bg-zinc-800 transition">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`h-5 px-1.5 rounded text-[10px] font-bold flex items-center border ${m.priority==='P1' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{m.priority}</span>
                <span className="text-[11px] font-mono font-medium text-zinc-400">{m.code}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono ${m.risk>80 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>Risk {m.risk}</span>
                <span className="ml-auto text-[10px] font-mono text-zinc-500">{mins}m left • {m.status}</span>
              </div>
              <p className="text-[13px] font-medium text-zinc-100 leading-[1.3]">{m.title}</p>
              <p className="text-[11px] text-zinc-500 mt-1 leading-[1.4]">{m.reason}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">{m.requester} ({m.requesterRole}) → {m.approverRequired}</span>
                <span className="text-[10px] font-mono text-zinc-600">HMAC {m.hmac.substring(0,8)}</span>
              </div>
              <p className="text-[10px] text-zinc-600 mt-1">Distinct approver required • 15min expiry • Hash-chained audit</p>
            </button>
          );
        })}
      </div>

      <div className="p-2.5 border-t border-zinc-800 bg-zinc-900">
        <p className="text-[10px] text-zinc-500 font-mono">Dual-control enforcement • Distinct approver • Tamper-evident ledger</p>
      </div>
    </div>
  );
}

export const RequestQueue = MandateQueue;

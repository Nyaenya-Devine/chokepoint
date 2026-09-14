/**
 * MandateQueue — Pure security: dual-control mandates that need 4-eyes approval
 * NOT OrbitDesk endless M365 requests. NOT tenants NovaTech/Bloom/Apex.
 * Focused: high-impact ops, risk score, distinct approver required, 15min expiry
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
  { id: '1', code: 'PRIV-001', title: 'Escalate operator to admin for incident response', priority: 'P1', risk: 92, status: 'pending', requester: 'operator', requesterRole: 'Operator', approverRequired: 'Admin distinct', createdAt: Date.now() - 2*60*1000, expiresAt: Date.now() + 13*60*1000, reason: 'Incident IR-2024-112: need admin to isolate compromised host', hmac: 'a7f3c9e2b2e1d4f8' },
  { id: '2', code: 'FLEET-004', title: 'Wipe fleet of 50 devices — lost shipment verified', priority: 'P1', risk: 95, status: 'pending', requester: 'operator', requesterRole: 'Operator', approverRequired: 'Admin + Auditor', createdAt: Date.now() - 5*60*1000, expiresAt: Date.now() + 10*60*1000, reason: 'Shipment lost, devices contain PII, Break Glass excluded', hmac: 'c4d8e1a5e9f2a6b3' },
  { id: '3', code: 'AGENT-002', title: 'Grant agent billing write access to production', priority: 'P1', risk: 88, status: 'in_review', requester: 'operator', requesterRole: 'Operator', approverRequired: 'Admin only', createdAt: Date.now() - 8*60*1000, expiresAt: Date.now() + 7*60*1000, reason: 'AI agent needs billing write for automated invoicing — ASI03 risk', hmac: 'f1a3c7d9e2b4c8a1' },
  { id: '4', code: 'COMPLIANCE-005', title: 'Disable DLP policy for external sharing', priority: 'P2', risk: 67, status: 'pending', requester: 'operator', requesterRole: 'Operator', approverRequired: 'Auditor required', createdAt: Date.now() - 12*60*1000, expiresAt: Date.now() + 3*60*1000, reason: 'External audit requires sharing — Report-Only first per policy', hmac: 'b2e1d4f8a7c3e9f2' },
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
    <div className="flex flex-col h-full bg-[#0a0a0a] rounded-[16px] border border-white/[0.06] overflow-hidden">
      <div className="p-4 border-b border-white/[0.06] bg-[#101012]/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-[13px] font-semibold tracking-[-0.01em]">Dual-Control Mandates</h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06] font-mono">{mandates.length} total • {mandates.filter(m=>m.status==='pending').length} pending • HMAC-signed</span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {(['all','pending','P1'] as const).map(f => (
            <button key={f} onClick={()=>setFilter(f)} className={`h-7 px-3 rounded-full text-[11px] font-medium border capitalize ${filter===f ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-white/[0.04] text-white/40 border-white/[0.06]'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filtered.map(m => {
          const timeLeft = Math.max(0, m.expiresAt - Date.now());
          const mins = Math.floor(timeLeft/60000);
          return (
            <button key={m.id} onClick={()=>onSelect?.(m)} className="w-full text-left p-3 rounded-[12px] bg-[#08080A] border border-white/[0.06] hover:border-amber-500/20 hover:bg-[#0F0F11] transition text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`h-5 px-1.5 rounded text-[10px] font-bold flex items-center border ${m.priority==='P1' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{m.priority}</span>
                <span className="text-[11px] font-mono font-medium text-white/60">{m.code}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono ${m.risk>80 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>Risk {m.risk}</span>
                <span className="ml-auto text-[10px] font-mono text-white/30">{mins}m left • {m.status}</span>
              </div>
              <p className="text-[13px] font-medium text-[#F5F3EF] leading-[1.3]">{m.title}</p>
              <p className="text-[11px] text-white/40 mt-1 leading-[1.4]">{m.reason}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/30">{m.requester} ({m.requesterRole}) → {m.approverRequired}</span>
                <span className="text-[10px] font-mono text-white/20">HMAC {m.hmac.substring(0,8)}…</span>
              </div>
              <p className="text-[10px] text-white/20 mt-1">Requester cannot approve own • Distinct approver • 15min expiry • Hash-chained</p>
            </button>
          );
        })}
      </div>

      <div className="p-2.5 border-t border-white/[0.06] bg-[#08080A]">
        <p className="text-[10px] text-white/30 font-mono">Pure security: dual-control 4-eyes, not OrbitDesk M365 requests. Proof: authz.test.ts distinct-approver</p>
      </div>
    </div>
  );
}

// Keep old name for compatibility but export new
export const RequestQueue = MandateQueue;

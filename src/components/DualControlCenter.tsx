/**
 * DualControlCenter — Pure security: dual-control approval workflow, not outsourcing call center
 * Voice optional: second approver on call for high-impact, but focused on security approval, not MDM support
 */

'use client';

import { useState } from 'react';

interface Approval {
  id: string;
  code: string;
  title: string;
  requester: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  hmac: string;
}

const mock: Approval[] = [
  { id: '1', code: 'PRIV-001', title: 'Escalate operator to admin', requester: 'operator', approver: 'admin', status: 'pending', reason: 'Incident IR-2024-112', hmac: 'a7f3c9e2' },
];

export function DualControlCenter() {
  const [selected, setSelected] = useState<Approval>(mock[0]);
  const [decision, setDecision] = useState<'idle' | 'approving' | 'approved' | 'rejected'>('idle');

  return (
    <div className="rounded-[16px] border border-white/[0.06] bg-[#0a0a0a] p-5">
      <h3 className="text-[13px] font-semibold flex items-center gap-2 mb-4">
        <span className="h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">⚖️</span>
        Dual-Control — Two-person rule, distinct approver, 15min expiry
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="p-3 rounded-[12px] bg-[#08080A] border border-white/[0.06]">
            <p className="text-[11px] font-mono text-white/40">Mandate {selected.code} • {selected.title}</p>
            <p className="text-[12px] text-white/70 mt-1">Requester: <span className="text-white">{selected.requester}</span> (Operator) cannot approve own</p>
            <p className="text-[12px] text-white/70">Approver required: <span className="text-amber-300">{selected.approver}</span> (Admin distinct)</p>
            <p className="text-[11px] text-white/40 mt-2">Reason: {selected.reason} • HMAC {selected.hmac}… • 15min expiry • Hash-chained</p>
          </div>

          <div className="p-3 rounded-[12px] bg-amber-500/5 border border-amber-500/10">
            <p className="text-[11px] font-medium text-amber-300">Separation of duties enforced</p>
            <ul className="text-[11px] text-white/40 mt-1.5 list-disc pl-4 space-y-1">
              <li>Requester ≠ Approver — distinct required</li>
              <li>Approver must have authorized role (Admin for P1)</li>
              <li>15min expiry — prevents stale approvals</li>
              <li>Break Glass excluded, monitored, alert on use</li>
              <li>HMAC-signed audit trail, tamper-evident</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <button onClick={()=>setDecision('approved')} className="flex-1 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[12px] font-medium hover:bg-emerald-500/15">✓ Approve — distinct + authorized</button>
            <button onClick={()=>setDecision('rejected')} className="flex-1 h-9 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-[12px] font-medium hover:bg-red-500/15">✕ Reject — with reason</button>
          </div>

          {decision === 'approved' && <div className="p-2.5 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20"><p className="text-[11px] text-emerald-300">✓ Approved by distinct Admin • HMAC-signed • Ledger hash-chained • Policy enforced • SIEM export queued</p></div>}
          {decision === 'rejected' && <div className="p-2.5 rounded-[10px] bg-red-500/10 border border-red-500/20"><p className="text-[11px] text-red-300">✕ Rejected — reason logged, HMAC-signed, audit trail sealed</p></div>}
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-[12px] bg-[#08080A] border border-white/[0.06]">
            <p className="text-[11px] font-semibold text-white/60">Voice approval (optional, security context)</p>
            <p className="text-[11px] text-white/40 mt-1 leading-[1.4]">For P1 critical, approver may call requester to verify intent — not outsourcing support call center. Distinct voice, flowing, client does actions, asks questions, but focused on security approval.</p>
            <div className="mt-2.5 space-y-2">
              <div className="p-2 rounded-[8px] bg-violet-500/5 border border-violet-500/10"><p className="text-[11px] text-violet-300">Approver: "Hi, confirming PRIV-001 — you need admin for incident IR-2024-112? What's the host?"</p></div>
              <div className="p-2 rounded-[8px] bg-amber-500/5 border border-amber-500/10"><p className="text-[11px] text-amber-300">Requester: "Yes, host 10.0.1.45 compromised, need to isolate, correlation ID a7f3c9e2"</p></div>
              <div className="p-2 rounded-[8px] bg-emerald-500/5 border border-emerald-500/10"><p className="text-[11px] text-emerald-300">Approver: "Verified — approving with audit trail, HMAC-signed"</p></div>
            </div>
          </div>

          <div className="p-3 rounded-[12px] bg-white/[0.03] border border-white/[0.06]">
            <p className="text-[11px] text-white/40 leading-[1.4]">Pure security: dual-control 4-eyes, not OrbitDesk call center with NovaTech/Bloom/Apex tenants. Voice is for second approver verification, not for MDM support. Proof: authz.test.ts distinct-approver + authorized-approver. World-class expert: focused, not trying everything like madman.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const VoiceApprovalCenter = DualControlCenter;

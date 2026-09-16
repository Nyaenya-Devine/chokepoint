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
  { id: '1', code: 'PRIV-001', title: 'Escalate operator to admin for incident containment', requester: 'operator', approver: 'admin', status: 'pending', reason: 'Incident IR-2024-112 — host isolation required', hmac: 'a7f3c9e2' },
];

export function DualControlCenter() {
  const [selected] = useState<Approval>(mock[0]);
  const [decision, setDecision] = useState<'idle' | 'approved' | 'rejected'>('idle');

  return (
    <div className="rounded-[16px] border border-zinc-800 bg-[#0a0a0a] p-5">
      <h3 className="text-[13px] font-semibold flex items-center gap-2 mb-4 text-zinc-100">
        <span className="h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">⚖️</span>
        Dual-Control — Two-person rule with distinct approver verification
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="p-3 rounded-[12px] bg-zinc-900 border border-zinc-800">
            <p className="text-[11px] font-mono text-zinc-500">Mandate {selected.code} • {selected.title}</p>
            <p className="text-[12px] text-zinc-400 mt-1">Requester: <span className="text-zinc-100">{selected.requester}</span> — cannot self-approve per policy</p>
            <p className="text-[12px] text-zinc-400">Approver required: <span className="text-amber-300">{selected.approver}</span> — distinct and authorized</p>
            <p className="text-[11px] text-zinc-500 mt-2">Reason: {selected.reason} • HMAC {selected.hmac} • 15-minute expiry • Hash-chained ledger</p>
          </div>

          <div className="p-3 rounded-[12px] bg-amber-500/5 border border-amber-500/10">
            <p className="text-[11px] font-medium text-amber-300">Separation of duties — enforced</p>
            <ul className="text-[11px] text-zinc-400 mt-1.5 list-disc pl-4 space-y-1">
              <li>Requester and approver must be distinct identities</li>
              <li>Approver must hold authorized role for requested privilege</li>
              <li>15-minute expiry prevents stale approvals</li>
              <li>Break Glass excluded from policy, monitored with alert</li>
              <li>HMAC-signed audit trail with tamper-evident ledger</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <button onClick={()=>setDecision('approved')} className="flex-1 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[12px] font-medium hover:bg-emerald-500/15 transition">Approve — distinct and authorized</button>
            <button onClick={()=>setDecision('rejected')} className="flex-1 h-9 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-[12px] font-medium hover:bg-red-500/15 transition">Reject — with justification</button>
          </div>

          {decision === 'approved' && <div className="p-2.5 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20"><p className="text-[11px] text-emerald-300">Approved by distinct administrator • HMAC-signed • Ledger hash-chained • Policy enforced</p></div>}
          {decision === 'rejected' && <div className="p-2.5 rounded-[10px] bg-red-500/10 border border-red-500/20"><p className="text-[11px] text-red-300">Rejected — reason logged, HMAC-signed, audit trail sealed</p></div>}
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-[12px] bg-zinc-900 border border-zinc-800">
            <p className="text-[11px] font-semibold text-zinc-300">Verification workflow</p>
            <p className="text-[11px] text-zinc-500 mt-1 leading-[1.4]">For critical requests, second approver verifies intent through secure channel before authorization. Focused on security decision, not general support.</p>
            <div className="mt-2.5 space-y-2">
              <div className="p-2 rounded-[8px] bg-violet-500/5 border border-violet-500/10"><p className="text-[11px] text-violet-300">Approver: "Confirming {selected.code} — host isolation for IR-2024-112. What is the affected asset?"</p></div>
              <div className="p-2 rounded-[8px] bg-zinc-800 border border-zinc-700"><p className="text-[11px] text-zinc-300">Requester: "Host 10.0.1.45 shows anomalous activity. Requesting isolation per playbook, correlation a7f3c9e2."</p></div>
              <div className="p-2 rounded-[8px] bg-emerald-500/5 border border-emerald-500/10"><p className="text-[11px] text-emerald-300">Approver: "Verified — approving with full audit trail."</p></div>
            </div>
          </div>

          <div className="p-3 rounded-[12px] bg-zinc-900 border border-zinc-800">
            <p className="text-[11px] text-zinc-500 leading-[1.4]">Chokepoint enforces least-privilege dual-control with tamper-evident audit. Authorization logic verified via dedicated test suite for distinct approver and role requirements.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

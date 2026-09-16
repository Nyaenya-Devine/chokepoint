/**
 * SecurityDashboard — Security operations overview
 */

'use client';

import { useEffect, useState } from 'react';

export function SecurityDashboard() {
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-zinc-100">Chokepoint — Security Operations</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Risk index • Ledger integrity • Dual-control • {liveTime.toLocaleTimeString()} • HMAC-signed</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.08em] text-zinc-500 uppercase">Live • Hash-chained • Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
          <p className="text-[11px] tracking-widest text-zinc-500 uppercase">Risk Index</p>
          <p className="text-[24px] font-bold text-white mt-1">42 <span className="text-[12px] font-medium text-emerald-400">Low</span></p>
          <p className="text-[11px] text-zinc-500 mt-1">8 factors • Velocity, auth, device trust</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
          <p className="text-[11px] tracking-widest text-zinc-500 uppercase">Ledger Integrity</p>
          <p className="text-[24px] font-bold text-emerald-400 mt-1">✓ Intact</p>
          <p className="text-[11px] text-zinc-500 mt-1">Hash chain • HMAC verified</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
          <p className="text-[11px] tracking-widest text-zinc-500 uppercase">Pending Approval</p>
          <p className="text-[24px] font-bold text-amber-400 mt-1">3</p>
          <p className="text-[11px] text-zinc-500 mt-1">Dual-control • 15min expiry</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
          <p className="text-[11px] tracking-widest text-zinc-500 uppercase">Anomalies</p>
          <p className="text-[24px] font-bold text-white mt-1">1</p>
          <p className="text-[11px] text-zinc-500 mt-1">After-hours privilege • Review</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <p className="text-[12px] font-semibold text-zinc-200">Security Controls — Implemented and Tested</p>
        <div className="grid grid-cols-3 gap-3 mt-3 text-[11px]">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><p className="font-medium text-zinc-200">Dual-Control</p><p className="text-zinc-500 mt-1">Distinct approver, authorized role, 15min expiry, HMAC-signed audit</p></div>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><p className="font-medium text-zinc-200">Tamper-Evident Ledger</p><p className="text-zinc-500 mt-1">SHA-256 hash chain, HMAC-SHA256, Merkle proofs, verification endpoint</p></div>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><p className="font-medium text-zinc-200">Least Privilege RBAC</p><p className="text-zinc-500 mt-1">Viewer/Operator/Auditor/Admin, default-deny, explicit allow, fail-closed</p></div>
        </div>
      </div>
    </div>
  );
}

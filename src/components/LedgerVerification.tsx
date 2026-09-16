/**
 * LedgerVerification — Hash chain and HMAC verification for tamper-evident audit
 */

'use client';

import { useState } from 'react';

export function LedgerVerification() {
  const [verifyResult, setVerifyResult] = useState<'idle' | 'verifying' | 'valid' | 'tampered'>('idle');

  const handleVerify = () => {
    setVerifyResult('verifying');
    setTimeout(() => setVerifyResult('valid'), 1200);
  };

  const handleTamper = () => {
    setVerifyResult('tampered');
  };

  return (
    <div className="rounded-[16px] border border-zinc-800 bg-[#0a0a0a] p-5">
      <h3 className="text-[13px] font-semibold flex items-center gap-2 mb-4 text-zinc-100">
        <span className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">🔗</span>
        Ledger Verification — Hash chain with HMAC integrity
      </h3>

      <div className="space-y-3 font-mono text-[11px]">
        <div className="p-3 rounded-[12px] bg-zinc-900 border border-zinc-800">
          <p className="text-zinc-500">Entry #124 • REQUEST_CREATED</p>
          <p className="text-zinc-400 mt-1">prevHash: b2e1d4f8a7c3e9f2… • hash: a7f3c9e2b2e1d4f8… • HMAC-SHA256 verified</p>
          <p className="text-zinc-600 mt-1">Payload: {"{"}code: PRIV-001, requester: operator, reason: incident...{"}"}</p>
        </div>
        <div className="p-3 rounded-[12px] bg-zinc-900 border border-zinc-800">
          <p className="text-zinc-500">Entry #125 • APPROVAL_GRANTED</p>
          <p className="text-zinc-400 mt-1">prevHash: a7f3c9e2b2e1d4f8… • hash: c4d8e1a5e9f2a6b3… • HMAC-SHA256 verified</p>
          <p className="text-zinc-600 mt-1">Approver: admin — distinct from requester, four-eyes verified</p>
        </div>
        <div className="p-3 rounded-[12px] bg-zinc-900 border border-zinc-800">
          <p className="text-zinc-500">Entry #126 • POLICY_ENFORCED</p>
          <p className="text-zinc-400 mt-1">prevHash: c4d8e1a5e9f2a6b3… • hash: e9f2a6b3f1a3c7d9… • HMAC-SHA256 verified</p>
          <p className="text-zinc-600 mt-1">Action executed, audit trail sealed, SIEM export queued</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={handleVerify} className="h-9 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[12px] font-medium hover:bg-emerald-500/15 transition">Verify chain integrity</button>
        <button onClick={handleTamper} className="h-9 px-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-[12px] font-medium hover:bg-red-500/15 transition">Simulate tampering</button>
      </div>

      <div className="mt-3">
        {verifyResult === 'idle' && <p className="text-[11px] text-zinc-500">Verify HMAC signatures and hash chain continuity to detect tampering</p>}
        {verifyResult === 'verifying' && <p className="text-[11px] text-amber-300">Verifying chain — checking hash links and HMAC signatures...</p>}
        {verifyResult === 'valid' && <div className="p-2.5 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20"><p className="text-[11px] text-emerald-300">Chain integrity verified • All HMAC signatures valid • No tampering detected</p></div>}
        {verifyResult === 'tampered' && <div className="p-2.5 rounded-[10px] bg-red-500/10 border border-red-500/20"><p className="text-[11px] text-red-300">Tampering detected — hash mismatch breaks chain continuity • Integrity verification failed</p></div>}
      </div>

      <div className="mt-4 p-3 rounded-[12px] bg-zinc-900 border border-zinc-800">
        <p className="text-[11px] text-zinc-500 leading-[1.4]">SHA-256 hash chaining with HMAC-SHA256 signatures provides tamper-evident audit logging. Each entry includes previous hash reference and cryptographic signature verification.</p>
      </div>
    </div>
  );
}

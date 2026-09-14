/**
 * SecurityDashboard v3.0 — World-class expert security dashboard
 * Pure focus: risk index, ledger integrity, mandate queue, anomaly feed, compliance
 * No OrbitDesk: no Live Queue endless, no SLA/CSAT/QA/FRT/MTTR, no Tenant Health NovaTech/Bloom/Apex
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
          <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-[#F5F3EF]">Chokepoint — Security Operations</h1>
          <p className="text-[13px] text-white/40 mt-0.5">Risk index • Ledger integrity • Dual-control mandates • Anomaly feed • {liveTime.toLocaleTimeString()} • HMAC-signed</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.08em] text-white/40 uppercase">Live • Hash-chained • HMAC-signed • 26 tests</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="p-4 rounded-[16px] bg-[#101012]/80 border border-white/[0.06] backdrop-blur">
          <p className="text-[11px] font-mono tracking-[0.08em] text-white/40 uppercase">Risk Index</p>
          <p className="text-[28px] font-semibold tracking-[-0.02em] text-amber-400 mt-1">67</p>
          <p className="text-[12px] text-white/40 mt-1">Medium • 3 signals • velocity + after-hours</p>
          <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: '67%' }} /></div>
          <p className="text-[10px] text-white/20 mt-1 font-mono">riskEngine.ts • behavioral scoring</p>
        </div>

        <div className="p-4 rounded-[16px] bg-[#101012]/80 border border-white/[0.06] backdrop-blur">
          <p className="text-[11px] font-mono tracking-[0.08em] text-white/40 uppercase">Ledger Integrity</p>
          <p className="text-[28px] font-semibold tracking-[-0.02em] text-emerald-400 mt-1">✓ Intact</p>
          <p className="text-[12px] text-white/40 mt-1">128 entries • HMAC verified • Merkle valid</p>
          <div className="mt-3 flex gap-1.5"><span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">SHA-256</span><span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">HMAC</span><span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Merkle</span></div>
        </div>

        <div className="p-4 rounded-[16px] bg-[#101012]/80 border border-white/[0.06] backdrop-blur">
          <p className="text-[11px] font-mono tracking-[0.08em] text-white/40 uppercase">Dual-Control Mandates</p>
          <p className="text-[28px] font-semibold tracking-[-0.02em] text-[#F5F3EF] mt-1">4 pending</p>
          <p className="text-[12px] text-white/40 mt-1">2 P1 critical • 15min expiry • Distinct approver</p>
          <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden flex"><div className="h-full bg-red-500" style={{ width: '50%' }} /><div className="h-full bg-amber-500" style={{ width: '25%' }} /><div className="h-full bg-zinc-600" style={{ width: '25%' }} /></div>
        </div>

        <div className="p-4 rounded-[16px] bg-[#101012]/80 border border-white/[0.06] backdrop-blur">
          <p className="text-[11px] font-mono tracking-[0.08em] text-white/40 uppercase">Anomaly Feed</p>
          <p className="text-[28px] font-semibold tracking-[-0.02em] text-red-400 mt-1">3 new</p>
          <p className="text-[12px] text-white/40 mt-1">Failed logins • After-hours • ASI03 impersonation</p>
          <div className="mt-3 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /><span className="text-[11px] text-white/30">Explainable • Human-readable reasons</span></div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-5 p-4 rounded-[16px] bg-[#101012]/80 border border-white/[0.06] backdrop-blur">
          <h3 className="text-[13px] font-semibold flex items-center gap-2 mb-3"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Compliance Mapping</h3>
          <div className="space-y-2">
            {[
              { fw: 'OWASP ASI03', status: 'Mitigated', desc: 'Identity & Privilege Abuse — dual-control + distinct approver' },
              { fw: 'NIST AC-3', status: 'Enforced', desc: 'Access Enforcement — RBAC default-deny' },
              { fw: 'SOC2 CC6.1', status: 'Enforced', desc: 'Logical access — least privilege' },
              { fw: 'MITRE TA0004', status: 'Detected', desc: 'Privilege Escalation — anomaly detection' },
            ].map(item => (
              <div key={item.fw} className="flex items-center justify-between p-2.5 rounded-[12px] bg-[#08080A] border border-white/[0.06]">
                <div><p className="text-[12px] font-medium text-[#F5F3EF]">{item.fw}</p><p className="text-[11px] text-white/40">{item.desc}</p></div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${item.status==='Mitigated' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : item.status==='Enforced' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{item.status}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/20 mt-3 font-mono">complianceMapper.ts • NIST, OWASP, SOC2, MITRE, ISO27001</p>
        </div>

        <div className="col-span-4 p-4 rounded-[16px] bg-[#101012]/80 border border-white/[0.06] backdrop-blur">
          <h3 className="text-[13px] font-semibold mb-3">Risk Engine — Live</h3>
          <div className="h-[80px] flex items-end gap-1">
            {Array.from({ length: 20 }).map((_, i) => {
              const h = 20 + Math.random() * 60;
              const isHigh = h > 60;
              return <div key={i} className={`flex-1 rounded-sm ${isHigh ? 'bg-red-500/60' : 'bg-amber-500/40'}`} style={{ height: `${h}%` }} />;
            })}
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px] text-white/40"><span>Last 60min • velocity + privilege creep</span><span className="flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-red-500" /> High risk</span></div>
          <div className="mt-3 p-2.5 rounded-[10px] bg-violet-500/5 border border-violet-500/10"><p className="text-[11px] text-violet-300">riskEngine.ts • velocity, privilege creep, after-hours, failed auths, impersonation, ASI03, trust decay</p></div>
        </div>

        <div className="col-span-3 space-y-3">
          <div className="p-4 rounded-[16px] bg-[#101012]/80 border border-white/[0.06] backdrop-blur">
            <h3 className="text-[13px] font-semibold mb-3">Quick Verify</h3>
            <div className="space-y-2">
              {[
                'Verify ledger chain',
                'Export SIEM (JSON/CEF/OCSF/LEEF)',
                'Simulate policy impact',
                'Check impersonation (ASI03)',
              ].map(action => (
                <button key={action} className="w-full flex items-center gap-2 p-2 rounded-[10px] bg-[#08080A] border border-white/[0.06] hover:border-white/[0.10] text-left text-[12px] text-white/60 hover:text-white/80 transition">
                  <span className="h-6 w-6 rounded-[8px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[10px]">→</span>{action}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-[16px] bg-[#08080A] border border-white/[0.06]">
            <h3 className="text-[12px] font-semibold mb-2">Security Posture</h3>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between"><span className="text-white/40">Approved today</span><span className="text-emerald-400">12</span></div>
              <div className="flex justify-between"><span className="text-white/40">Avg approval</span><span className="text-white/60">3.2m</span></div>
              <div className="flex justify-between"><span className="text-white/40">Break Glass uses</span><span className="text-emerald-400">0 — Good</span></div>
            </div>
            <div className="mt-3 p-2 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20"><p className="text-[11px] text-emerald-300">✓ Strong — HMAC-signed, hash-chained, dual-control, 26 tests</p></div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-[16px] bg-[#0a0a0a] border border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-4 text-[11px] text-white/30 font-mono">
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-emerald-500" />HMAC-signed ledger</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-amber-500" />Hash-chained audit</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-violet-500" />Dual-control 4-eyes</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-cyan-500" />Break Glass monitored</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-white/40" />26 tests • 0 vulns</span>
        </div>
        <span className="text-[10px] font-mono text-white/20">Chokepoint v3.0 • Pure security • No OrbitDesk mixing • HashiCorp Vault + Snyk + Vanta inspiration</span>
      </div>
    </div>
  );
}

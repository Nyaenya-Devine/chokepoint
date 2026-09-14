/**
 * PolicyCenter — Pure security: ABAC policies, not per-tenant NovaTech/Bloom/Apex
 * Focused: policy simulation, dry-run, What If, compliance mapping
 */

'use client';

import { useState } from 'react';

interface Policy {
  id: string;
  name: string;
  type: 'RBAC' | 'ABAC' | 'Dual-Control' | 'Break Glass' | 'DLP';
  status: 'enforced' | 'report-only' | 'disabled';
  description: string;
  rules: string[];
  compliance: string[];
  tests: number;
}

const policies: Policy[] = [
  { id: 'rbac-01', name: 'RBAC Least Privilege', type: 'RBAC', status: 'enforced', description: 'Viewer / Operator / Auditor / Admin — default-deny, explicit allow, fail-closed', rules: ['Viewer: read-only dashboard', 'Operator: create requests, cannot approve own', 'Auditor: verify ledger, export SIEM', 'Admin: approve critical, full control'], compliance: ['NIST AC-3', 'SOC2 CC6.1', 'OWASP ASI03'], tests: 8 },
  { id: 'dual-01', name: 'Dual-Control 4-Eyes', type: 'Dual-Control', status: 'enforced', description: 'Irreversible actions need distinct authorized approver, 15min expiry, audit trail', rules: ['Requester cannot approve own', 'Distinct approver + authorized role', '15min expiry, HMAC-signed', 'Break Glass excluded, monitored'], compliance: ['SOC2 CC6.2', 'ISO27001 A.9.2', 'NIST AC-5'], tests: 6 },
  { id: 'break-01', name: 'Break Glass Emergency', type: 'Break Glass', status: 'enforced', description: 'Emergency access excluded from approval, monitored, alert on use, vault password', rules: ['Excluded from CA approval flows', 'Alert on use, audit HMAC-signed', 'Password in vault, runbook quarterly', 'Post-incident review required'], compliance: ['SOC2 CC7.2', 'NIST IR-4'], tests: 4 },
  { id: 'dlp-01', name: 'DLP Sensitive Operations', type: 'DLP', status: 'report-only', description: 'Quarantine suspicious requests, anomaly detection, impossible travel, privilege escalation', rules: ['Detect after-hours privilege', 'Detect unknown sources', 'Detect automation & impersonation', 'Quarantine + human review'], compliance: ['OWASP ASI03', 'MITRE TA0004'], tests: 5 },
];

export function PolicyCenter() {
  const [selected, setSelected] = useState<Policy>(policies[0]);
  const [activeTab, setActiveTab] = useState<'rules' | 'compliance' | 'simulate'>('rules');

  return (
    <div className="bg-[#0a0a0a] rounded-[16px] border border-white/[0.06] overflow-hidden flex h-[600px]">
      <div className="w-[300px] border-r border-white/[0.06] bg-[#08080A]/50 flex flex-col">
        <div className="p-4 border-b border-white/[0.06]">
          <h3 className="text-[13px] font-semibold">Security Policies — ABAC + RBAC</h3>
          <p className="text-[11px] text-white/40 mt-1">Pure security, not per-tenant NovaTech/Bloom/Apex</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {policies.map(p => {
            const isSelected = selected.id === p.id;
            return (
              <button key={p.id} onClick={()=>setSelected(p)} className={`w-full text-left p-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition ${isSelected ? 'bg-amber-500/10 border-l-2 border-l-amber-500' : 'border-l-2 border-l-transparent'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono uppercase ${p.type==='RBAC' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : p.type==='Dual-Control' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : p.type==='Break Glass' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>{p.type}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${p.status==='enforced' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{p.status}</span>
                </div>
                <p className="text-[13px] font-medium text-[#F5F3EF]">{p.name}</p>
                <p className="text-[11px] text-white/40 mt-1 leading-[1.3] line-clamp-2">{p.description}</p>
                <p className="text-[10px] text-white/20 mt-1 font-mono">{p.tests} tests • {p.compliance.length} frameworks</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold">{selected.name}</h2>
            <p className="text-[12px] text-white/40 mt-0.5">{selected.description}</p>
          </div>
          <div className="flex gap-1.5">
            {(['rules','compliance','simulate'] as const).map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)} className={`h-7 px-3 rounded-full text-[11px] font-medium border capitalize ${activeTab===tab ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-white/[0.04] text-white/40 border-white/[0.06]'}`}>{tab}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'rules' && (
            <div className="space-y-2.5">
              {selected.rules.map((rule,i) => (
                <div key={i} className="p-3 rounded-[12px] bg-[#08080A] border border-white/[0.06] flex gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[10px] text-emerald-400">✓</span></span>
                  <span className="text-[12px] text-white/70 leading-[1.4]">{rule}</span>
                </div>
              ))}
              <div className="mt-4 p-3 rounded-[12px] bg-amber-500/5 border border-amber-500/10">
                <p className="text-[11px] text-amber-300 font-medium">Proof: {selected.id} — {selected.tests} tests in authz.test.ts / ledger.test.ts</p>
                <p className="text-[11px] text-white/40 mt-1">Policy engine lib/authz — single gate on every action, default-deny, explicit allow, fail-closed</p>
              </div>
            </div>
          )}
          {activeTab === 'compliance' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {selected.compliance.map(c => (
                  <div key={c} className="p-2.5 rounded-[10px] bg-[#08080A] border border-white/[0.06] text-[11px] text-white/60 font-mono">{c}</div>
                ))}
              </div>
              <div className="p-3 rounded-[12px] bg-violet-500/5 border border-violet-500/10">
                <p className="text-[11px] text-violet-300">Compliance mapper: NIST, OWASP ASI03, SOC2, MITRE, ISO27001 — complianceMapper.ts</p>
              </div>
            </div>
          )}
          {activeTab === 'simulate' && (
            <div className="space-y-3">
              <div className="p-3 rounded-[12px] bg-[#08080A] border border-white/[0.06]">
                <p className="text-[12px] font-medium text-[#F5F3EF]">What If — Dry-run before prod</p>
                <p className="text-[11px] text-white/40 mt-1">Simulate policy impact without touching prod ledger. 6 default tests. Clone policy and test.</p>
                <button className="mt-3 h-8 px-4 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] text-white/70 hover:text-white">→ Run simulation (policySimulator.ts + /api/policy-simulate)</button>
              </div>
              <div className="p-3 rounded-[12px] bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-[11px] text-emerald-300">Lesson from OrbitDesk P1: Report-Only first, then enforce. Same here — DLP is report-only before enforced.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Compatibility
export const TenantPolicyCenter = PolicyCenter;

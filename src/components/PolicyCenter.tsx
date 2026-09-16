/**
 * PolicyCenter — Security policy management with simulation and compliance mapping
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
  { id: 'rbac-01', name: 'RBAC Least Privilege', type: 'RBAC', status: 'enforced', description: 'Four roles with default-deny, explicit allow, and fail-closed behavior', rules: ['Viewer: read-only dashboard', 'Operator: create requests, cannot approve own', 'Auditor: verify ledger, export audit', 'Admin: approve critical operations'], compliance: ['NIST AC-3', 'SOC2 CC6.1', 'OWASP ASI03'], tests: 8 },
  { id: 'dual-01', name: 'Dual-Control Verification', type: 'Dual-Control', status: 'enforced', description: 'High-impact operations require distinct authorized approver with expiry', rules: ['Requester cannot approve own request', 'Distinct approver with authorized role required', '15-minute expiry with HMAC-signed audit', 'Break Glass excluded and monitored'], compliance: ['SOC2 CC6.2', 'ISO27001 A.9.2', 'NIST AC-5'], tests: 6 },
  { id: 'break-01', name: 'Break Glass Emergency', type: 'Break Glass', status: 'enforced', description: 'Emergency access with monitoring, alerting, and post-incident review', rules: ['Excluded from standard approval flows', 'Alert on use with HMAC-signed audit', 'Credentials secured in vault', 'Post-incident review required'], compliance: ['SOC2 CC7.2', 'NIST IR-4'], tests: 4 },
  { id: 'dlp-01', name: 'Sensitive Operations Protection', type: 'DLP', status: 'report-only', description: 'Anomaly detection for suspicious privileged operations', rules: ['Detect after-hours privilege escalation', 'Detect unknown sources and automation', 'Quarantine for human review', 'Risk scoring with explainable reasons'], compliance: ['OWASP ASI03', 'MITRE TA0004'], tests: 5 },
];

export function PolicyCenter() {
  const [selected, setSelected] = useState<Policy>(policies[0]);
  const [activeTab, setActiveTab] = useState<'rules' | 'compliance' | 'simulate'>('rules');

  return (
    <div className="bg-[#0a0a0a] rounded-[16px] border border-zinc-800 overflow-hidden flex h-[600px]">
      <div className="w-[300px] border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-[13px] font-semibold text-zinc-100">Security Policies</h3>
          <p className="text-[11px] text-zinc-500 mt-1">Policy enforcement and simulation</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {policies.map(p => {
            const isSelected = selected.id === p.id;
            return (
              <button key={p.id} onClick={()=>setSelected(p)} className={`w-full text-left p-3 border-b border-zinc-800/50 hover:bg-zinc-800/50 transition ${isSelected ? 'bg-amber-500/10 border-l-2 border-l-amber-500' : 'border-l-2 border-l-transparent'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono uppercase ${p.type==='RBAC' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : p.type==='Dual-Control' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : p.type==='Break Glass' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>{p.type}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${p.status==='enforced' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{p.status}</span>
                </div>
                <p className="text-[13px] font-medium text-zinc-100">{p.name}</p>
                <p className="text-[11px] text-zinc-500 mt-1 leading-[1.3] line-clamp-2">{p.description}</p>
                <p className="text-[10px] text-zinc-600 mt-1 font-mono">{p.tests} tests • {p.compliance.length} frameworks</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-zinc-100">{selected.name}</h2>
            <p className="text-[12px] text-zinc-500 mt-0.5">{selected.description}</p>
          </div>
          <div className="flex gap-1.5">
            {(['rules','compliance','simulate'] as const).map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)} className={`h-7 px-3 rounded-full text-[11px] font-medium border capitalize ${activeTab===tab ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{tab}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'rules' && (
            <div className="space-y-2.5">
              {selected.rules.map((rule,i) => (
                <div key={i} className="p-3 rounded-[12px] bg-zinc-900 border border-zinc-800 flex gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[10px] text-emerald-400">✓</span></span>
                  <span className="text-[12px] text-zinc-300 leading-[1.4]">{rule}</span>
                </div>
              ))}
              <div className="mt-4 p-3 rounded-[12px] bg-amber-500/5 border border-amber-500/10">
                <p className="text-[11px] text-amber-300 font-medium">Test coverage: {selected.id} — {selected.tests} tests</p>
                <p className="text-[11px] text-zinc-500 mt-1">Policy engine provides single authorization gate with default-deny and fail-closed behavior</p>
              </div>
            </div>
          )}
          {activeTab === 'compliance' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {selected.compliance.map(c => (
                  <div key={c} className="p-2.5 rounded-[10px] bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono">{c}</div>
                ))}
              </div>
              <div className="p-3 rounded-[12px] bg-violet-500/5 border border-violet-500/10">
                <p className="text-[11px] text-violet-300">Compliance mapping covers NIST, OWASP, SOC2, MITRE, and ISO27001 frameworks</p>
              </div>
            </div>
          )}
          {activeTab === 'simulate' && (
            <div className="space-y-3">
              <div className="p-3 rounded-[12px] bg-zinc-900 border border-zinc-800">
                <p className="text-[12px] font-medium text-zinc-100">What-If Simulation — Dry-run evaluation</p>
                <p className="text-[11px] text-zinc-500 mt-1">Simulate policy impact without affecting production ledger. Includes comprehensive test scenarios.</p>
                <button className="mt-3 h-8 px-4 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-300 hover:text-zinc-100 transition">Run simulation</button>
              </div>
              <div className="p-3 rounded-[12px] bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-[11px] text-emerald-300">Report-only mode allows safe evaluation before enforcement — recommended for DLP and sensitive operations</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

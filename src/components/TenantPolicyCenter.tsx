/**
 * TenantPolicyCenter — Per-tenant policies like OrbitDesk PolicyCenter
 * Each tenant different strictness like NovaTech/Bloom/Apex
 * Shows CA policies, compliance, expectations
 */

'use client';

import { useState } from 'react';
import { tenants, type Tenant } from '../data/tenants';

export function TenantPolicyCenter() {
  const [selected, setSelected] = useState<Tenant>(tenants[0]);
  const [activeTab, setActiveTab] = useState<'policies' | 'compliance' | 'expectations'>('policies');

  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm overflow-hidden flex h-[600px]">
      {/* Tenant list — like client list */}
      <div className="w-[280px] border-r border-zinc-800/60 bg-zinc-900/30 flex flex-col">
        <div className="p-3 border-b border-zinc-800/60">
          <h3 className="text-[13px] font-semibold text-zinc-100">Tenants — Per-Tenant Policies</h3>
          <p className="text-[11px] text-zinc-500 mt-1">Each tenant different strictness, expectations, SLA</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {tenants.map(tenant => {
            const isSelected = selected.id === tenant.id;
            const nonCompliant = tenant.approvalPolicies.reduce((sum, p) => sum + p.nonCompliant, 0);
            const color = tenant.color === 'violet' ? 'violet' : tenant.color === 'pink' ? 'pink' : 'emerald';
            
            return (
              <button
                key={tenant.id}
                onClick={() => setSelected(tenant)}
                className={`w-full text-left p-3 border-b border-zinc-800/30 hover:bg-zinc-800/40 transition-colors ${isSelected ? 'bg-violet-500/10 border-l-2 border-l-violet-500' : 'border-l-2 border-l-transparent'}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`h-8 w-8 rounded-lg bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-[12px] font-bold text-${color}-400`}>{tenant.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-zinc-100 truncate">{tenant.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{tenant.type} • {tenant.sla}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${nonCompliant > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {nonCompliant > 0 ? `${nonCompliant} non-compliant` : 'Compliant'}
                      </span>
                      <span className="text-[10px] text-zinc-600">{tenant.approvalPolicies.length} policies</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-2.5 border-t border-zinc-800/60 bg-zinc-900/50">
          <p className="text-[10px] text-zinc-600">Per-tenant policies like real workplace — different strictness, expectations, comms</p>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-zinc-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-zinc-100">{selected.name}</h2>
              <p className="text-[12px] text-zinc-500 mt-0.5">{selected.description}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {(['policies', 'compliance', 'expectations'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`h-7 px-3 rounded-lg text-[11px] font-medium border capitalize transition-colors ${activeTab === tab ? 'bg-violet-500/15 text-violet-300 border-violet-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700/50 hover:border-zinc-600'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'policies' && (
            <div className="space-y-3">
              {selected.approvalPolicies.map((policy, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-medium text-zinc-100">{policy.name}</h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${policy.mode === 'ON' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : policy.mode === 'Report-Only' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                          {policy.mode}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${policy.risk === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : policy.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'}`}>
                          {policy.risk}
                        </span>
                      </div>
                      <p className="text-[12px] text-zinc-400 mt-1.5 leading-[1.4]">{policy.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {policy.requires.map(req => (
                          <span key={req} className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700/30">
                            {req}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-2 font-mono">Last: {policy.lastModified}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[12px] font-medium ${policy.nonCompliant > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {policy.nonCompliant > 0 ? `${policy.nonCompliant} non-compliant` : 'Compliant'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-2.5">
              {selected.compliance.map((comp, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <div>
                    <p className="text-[13px] font-medium text-zinc-200">{comp.name} {comp.required && <span className="text-red-400">*</span>}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{comp.details}</p>
                  </div>
                  <span className={`text-[11px] px-2 py-1 rounded-full border font-medium ${comp.status === 'Compliant' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : comp.status === 'Partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {comp.status}
                  </span>
                </div>
              ))}
              <div className="mt-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <p className="text-[12px] font-medium text-violet-300">Per-tenant compliance like real workplace:</p>
                <p className="text-[11px] text-zinc-400 mt-1 leading-[1.4]">Apex Financial requires SEC-2024-07 Strict, BitLocker + Key Escrowed, Defender Tamper ON, DLP blocking, Break Glass excluded + monitored, audit log 7 years HMAC-signed. Bloom & Co relaxed — MFA only, optional BitLocker, simple language.</p>
              </div>
            </div>
          )}

          {activeTab === 'expectations' && (
            <div className="space-y-3">
              {Object.entries(selected.expectations).map(([key, value]) => (
                <div key={key} className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <p className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">{key}</p>
                  <p className="text-[12px] text-zinc-300 mt-1.5 leading-[1.4]">{value}</p>
                </div>
              ))}
              <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/30">
                <p className="text-[11px] font-medium text-zinc-400">SLA: {selected.sla}</p>
                <p className="text-[11px] text-zinc-500 mt-1">Like OrbitDesk — different tenants have different expectations, comms style, language, audit requirements. Makes it feel 100% real workplace.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

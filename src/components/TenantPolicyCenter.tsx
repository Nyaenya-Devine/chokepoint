/**
 * TenantPolicyCenter — Organizational policy overview
 */

'use client';

import { useState } from 'react';
import { tenants, type Tenant } from '../data/tenants';

export function TenantPolicyCenter() {
  const [selected, setSelected] = useState<Tenant>(tenants[0]);
  const [activeTab, setActiveTab] = useState<'policies' | 'compliance'>('policies');

  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm overflow-hidden flex h-[600px]">
      <div className="w-[280px] border-r border-zinc-800/60 bg-zinc-900/30 flex flex-col">
        <div className="p-3 border-b border-zinc-800/60">
          <h3 className="text-[13px] font-semibold text-zinc-100">Environments</h3>
          <p className="text-[11px] text-zinc-500 mt-1">Policy strictness by environment</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {tenants.map(tenant => {
            const isSelected = selected.id === tenant.id;
            return (
              <button key={tenant.id} onClick={()=>setSelected(tenant)} className={`w-full text-left p-3 border-b border-zinc-800/30 hover:bg-zinc-800/30 transition ${isSelected ? 'bg-violet-500/10 border-l-2 border-l-violet-500' : 'border-l-2 border-l-transparent'}`}>
                <p className="text-[13px] font-medium text-zinc-100">{tenant.name}</p>
                <p className="text-[11px] text-zinc-500 mt-1">{tenant.description.substring(0,60)}...</p>
                <div className="flex gap-1 mt-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{tenant.approvalPolicies.length} policies</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-zinc-100">{selected.name}</h2>
            <p className="text-[11px] text-zinc-500 mt-1">{selected.description}</p>
          </div>
          <div className="flex gap-1.5">
            {(['policies','compliance'] as const).map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)} className={`h-7 px-3 rounded-full text-[11px] font-medium border capitalize ${activeTab===tab ? 'bg-violet-500/15 text-violet-300 border-violet-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{tab}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'policies' && (
            <div className="space-y-2">
              {selected.approvalPolicies.map((policy:any, i:number) => (
                <div key={i} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-[12px] font-medium text-zinc-200">{policy.name || policy.id}</p>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-[1.4]">{policy.description || 'Security policy enforcement'}</p>
                  <div className="mt-2 flex gap-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{policy.status || 'enforced'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'compliance' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-[12px] font-medium text-zinc-200">Compliance Requirements</p>
                <p className="text-[11px] text-zinc-500 mt-1 leading-[1.4]">Policies mapped to NIST, SOC2, ISO27001, and OWASP frameworks. Audit logging with HMAC verification and hash-chained integrity.</p>
              </div>
              <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
                <p className="text-[11px] text-violet-300">Security product demonstrating end-to-end ownership: authentication, authorization, dual-control, tamper-evident audit, and automated scanning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

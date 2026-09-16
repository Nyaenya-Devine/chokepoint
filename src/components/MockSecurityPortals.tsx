/**
 * MockSecurityPortals — Security admin portals for approval context
 */

'use client';

import { useState } from 'react';
import type { LiveRequest } from '../data/requestEngine';

interface Props {
  request: LiveRequest | null;
}

const portals = [
  { id: 'identity', name: 'Identity', icon: '◍', color: 'violet', description: 'Users, groups, roles, audit logs' },
  { id: 'devices', name: 'Devices', icon: '◐', color: 'emerald', description: 'Fleet, compliance, attestation' },
  { id: 'policies', name: 'Policies', icon: '◑', color: 'amber', description: 'Access policies, What-If, Report-Only' },
  { id: 'threat', name: 'Threat', icon: '◒', color: 'red', description: 'Alerts, incidents, risk analysis' },
  { id: 'audit', name: 'Audit', icon: '◓', color: 'blue', description: 'Ledger, verification, SIEM export' },
];

export function MockSecurityPortals({ request }: Props) {
  const [activePortal, setActivePortal] = useState('identity');
  const [executedActions, setExecutedActions] = useState<string[]>([]);

  const executeAction = (action: string) => {
    setExecutedActions(prev => [...prev, `${new Date().toLocaleTimeString()} — ${action} — Executed — Audit signed`]);
  };

  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 overflow-hidden flex h-[600px]">
      <div className="w-[200px] border-r border-zinc-800/60 bg-zinc-900/30 p-2 space-y-1">
        {portals.map(p => (
          <button key={p.id} onClick={()=>setActivePortal(p.id)} className={`w-full text-left p-2.5 rounded-xl border transition ${activePortal===p.id ? 'bg-violet-500/10 border-violet-500/20 text-violet-200' : 'bg-zinc-800/30 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
            <div className="flex items-center gap-2"><span className="text-[14px]">{p.icon}</span><span className="text-[12px] font-medium">{p.name}</span></div>
            <p className="text-[10px] opacity-60 mt-1 leading-[1.2]">{p.description}</p>
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-[13px] font-semibold text-zinc-100 mb-3">{portals.find(p=>p.id===activePortal)?.name} — Security Context</h3>
        {request ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[12px] font-medium text-zinc-200">{request.code} — {request.title}</p>
              <p className="text-[11px] text-zinc-500 mt-1">{request.description}</p>
              <p className="text-[11px] text-zinc-500 mt-2">Risk: {request.risk} • Priority: {request.priority} • Requires: {request.requiredApproverRole}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={()=>executeAction(`Verified ${activePortal} for ${request.code}`)} className="h-9 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] hover:bg-zinc-700">Verify {activePortal}</button>
              <button onClick={()=>executeAction(`Checked audit trail for ${request.code}`)} className="h-9 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] hover:bg-zinc-700">Check audit trail</button>
            </div>
            {executedActions.length>0 && (
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-[11px] font-medium text-zinc-400 mb-2">Recent actions — HMAC-signed</p>
                {executedActions.slice(-5).map((a,i)=><p key={i} className="text-[11px] font-mono text-zinc-500 py-1 border-b border-zinc-800/50 last:border-0">{a}</p>)}
              </div>
            )}
          </div>
        ) : (
          <p className="text-[12px] text-zinc-500">Select a request to view security context</p>
        )}
      </div>
    </div>
  );
}

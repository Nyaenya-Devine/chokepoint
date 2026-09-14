/**
 * ApproverRoster — Pure security: approvers with roles, not operators with 44h/week conflicts
 * Focused: RBAC, distinct approver, separation of duties, no OrbitDesk coaching drama
 */

'use client';

interface Approver {
  id: string;
  name: string;
  role: 'Admin' | 'Auditor' | 'Operator' | 'Viewer';
  status: 'available' | 'busy' | 'offline';
  canApprove: string[];
  workload: string;
  lastAction: string;
  trustScore: number;
}

const approvers: Approver[] = [
  { id: '1', name: 'Nia Owiti', role: 'Admin', status: 'available', canApprove: ['P1 Critical', 'Privilege escalation', 'Fleet wipe'], workload: '2 pending', lastAction: 'Approved PRIV-001 2m ago', trustScore: 98 },
  { id: '2', name: 'Alex Rivera', role: 'Admin', status: 'available', canApprove: ['P1 Critical', 'Agent access'], workload: '1 pending', lastAction: 'Approved AGENT-002 5m ago', trustScore: 96 },
  { id: '3', name: 'Priya Singh', role: 'Auditor', status: 'available', canApprove: ['DLP disable', 'Compliance exception', 'SIEM export'], workload: '0 pending', lastAction: 'Verified ledger 8m ago', trustScore: 99 },
  { id: '4', name: 'Dmitri Kovac', role: 'Operator', status: 'busy', canApprove: [], workload: '3 requests', lastAction: 'Created FLEET-004', trustScore: 85 },
];

export function ApproverRoster() {
  return (
    <div className="rounded-[16px] border border-white/[0.06] bg-[#0a0a0a] p-5">
      <h3 className="text-[13px] font-semibold flex items-center gap-2 mb-4">
        <span className="h-6 w-6 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">👥</span>
        Approvers — RBAC, distinct, separation of duties
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {approvers.map(a => (
          <div key={a.id} className="p-3 rounded-[12px] bg-[#08080A] border border-white/[0.06] hover:border-white/[0.10] transition">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[12px] font-medium">{a.name.split(' ').map(n=>n[0]).join('')}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#F5F3EF] flex items-center gap-2">{a.name} <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono uppercase ${a.role==='Admin' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : a.role==='Auditor' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : a.role==='Operator' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-white/5 text-white/40 border-white/10'}`}>{a.role}</span> <span className={`h-2 w-2 rounded-full ${a.status==='available' ? 'bg-emerald-500' : a.status==='busy' ? 'bg-amber-500' : 'bg-zinc-600'}`} /></p>
                <p className="text-[11px] text-white/40">{a.workload} • Trust {a.trustScore}% • {a.lastAction}</p>
              </div>
            </div>
            {a.canApprove.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {a.canApprove.map(cap => <span key={cap} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40">{cap}</span>)}
              </div>
            )}
            {a.role === 'Operator' && <p className="text-[10px] text-white/20 mt-2">Cannot approve own requests • Distinct approver required • Separation of duties</p>}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-[12px] bg-white/[0.03] border border-white/[0.06]">
        <p className="text-[11px] text-white/40 leading-[1.4]">Pure security: 4 roles Viewer/Operator/Auditor/Admin, default-deny, explicit allow, requester cannot approve own, distinct authorized approver, session TTL + CSRF. No 44h/week conflicts, no SBI coaching drama, no public shaming — that's OrbitDesk, not Chokepoint. Proof: authz.test.ts</p>
      </div>
    </div>
  );
}

export const OperatorRoster = ApproverRoster;

/**
 * Dashboard v2.0 — OrbitDesk-inspired clean bento, real-time endless requests, voice approvals
 * Linear dark-first violet, Stripe gradient mesh, Intercom human bubbles, Notion warmth, Vercel restraint
 * Not basic AI — human feel, 5 balanced voices, per-tenant policies, remote verification
 */

'use client';

import { useState, useEffect } from 'react';
import { SecurityDashboard } from '@/src/components/SecurityDashboard';
import { RequestQueue } from '@/src/components/RequestQueue';
import { VoiceApprovalCenter } from '@/src/components/VoiceApprovalCenter';
import { OperatorRoster } from '@/src/components/OperatorRoster';
import { TenantPolicyCenter } from '@/src/components/TenantPolicyCenter';
import { RemoteVerification } from '@/src/components/RemoteVerification';
import { MockSecurityPortals } from '@/src/components/MockSecurityPortals';
import { requestEngine, type LiveRequest } from '@/src/data/requestEngine';

type Tab = 'overview' | 'requests' | 'tenants' | 'operators' | 'verification';

export default function DashboardV2() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedRequest, setSelectedRequest] = useState<LiveRequest | null>(null);
  const [requests, setRequests] = useState<LiveRequest[]>([]);

  useEffect(() => {
    requestEngine.start();
    const unsub = requestEngine.subscribe(setRequests);
    return () => {
      unsub();
      requestEngine.stop();
    };
  }, []);

  const handleApprove = (id: string, note: string) => {
    requestEngine.approveRequest(id, 'Nia Owiti', note);
    setSelectedRequest(prev => prev?.id === id ? { ...prev, status: 'approved' as const } : prev);
  };

  const handleReject = (id: string, reason: string) => {
    requestEngine.rejectRequest(id, 'Nia Owiti', reason);
    setSelectedRequest(prev => prev?.id === id ? { ...prev, status: 'rejected' as const } : prev);
  };

  const handleExecute = (id: string) => {
    requestEngine.executeRequest(id, 'Nia Owiti');
    setSelectedRequest(prev => prev?.id === id ? { ...prev, status: 'executed' as const } : prev);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100">
      {/* Top bar — OrbitDesk style friendly dark #0a0a0a with emerald pulse */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-zinc-800/60">
        <div className="max-w-[1600px] mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-[12px]">C</span>
            </div>
            <span className="text-[14px] font-semibold tracking-[-0.01em]">Chokepoint</span>
            <span className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium tracking-widest text-zinc-400 uppercase">◍ Chokepoint Lab • Real Voice Approvals • Desktop Installable</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-zinc-800/60 border border-zinc-700/50">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-400">{pendingCount} pending • Live endless</span>
            </div>
            <div className="flex items-center gap-1">
              {[
                { label: '5 Voices', color: 'violet' },
                { label: 'PWA+Electron', color: 'emerald' },
                { label: 'HMAC-signed', color: 'amber' },
              ].map(pill => (
                <span key={pill.label} className={`text-[10px] px-2 py-1 rounded-full bg-${pill.color}-500/10 text-${pill.color}-300 border border-${pill.color}-500/20`}>
                  {pill.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs — bento clean */}
        <div className="max-w-[1600px] mx-auto px-4 h-10 flex items-center gap-1 border-t border-zinc-800/40">
          {[
            { id: 'overview', label: 'Overview', icon: '◍', desc: 'Bento clean dashboard' },
            { id: 'requests', label: 'Live Requests', icon: '◐', desc: `${pendingCount} pending • Voice approvals`, badge: pendingCount },
            { id: 'tenants', label: 'Tenants', icon: '◑', desc: 'Per-tenant policies like real workplace' },
            { id: 'operators', label: 'Operators', icon: '◒', desc: 'Conflicts, skills, 44h/week' },
            { id: 'verification', label: 'Verification', icon: '◓', desc: 'Remote PC + Mock portals' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`h-7 px-3 rounded-lg text-[12px] font-medium flex items-center gap-1.5 border transition-all ${activeTab === tab.id ? 'bg-violet-500/15 text-violet-300 border-violet-500/30' : 'bg-transparent text-zinc-500 border-transparent hover:bg-zinc-800/50 hover:text-zinc-300'}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">{tab.badge}</span>
              )}
            </button>
          ))}
          
          <div className="ml-auto flex items-center gap-2 text-[11px] text-zinc-600">
            <span>Linear • Stripe • Intercom • Superhuman • Notion • Vercel inspired</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto p-4">
        {activeTab === 'overview' && <SecurityDashboard />}

        {activeTab === 'requests' && (
          <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
            <div className="col-span-4 h-full">
              <RequestQueue onSelectRequest={setSelectedRequest} selectedId={selectedRequest?.id} />
            </div>
            <div className="col-span-8 h-full">
              <VoiceApprovalCenter request={selectedRequest} onApprove={handleApprove} onReject={handleReject} onExecute={handleExecute} />
            </div>
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="h-[calc(100vh-120px)]">
            <TenantPolicyCenter />
          </div>
        )}

        {activeTab === 'operators' && (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5">
              <OperatorRoster />
            </div>
            <div className="col-span-7 space-y-4">
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60">
                <h3 className="text-[13px] font-semibold text-zinc-100 mb-3">Why Operators Have Conflicts — Like OrbitDesk Agents</h3>
                <div className="space-y-2.5 text-[12px] leading-[1.5] text-zinc-400">
                  <p><span className="text-zinc-200 font-medium">Dmitri vs Alex:</span> Alex said Dmitri wastes time escalating easy tickets without checking logs — public shaming in #team-internal. Needs SBI coaching privately, not public.</p>
                  <p><span className="text-zinc-200 font-medium">Learning gaps:</span> Dmitri escalates easy M365 without Message Trace first. Lisa high CSAT 4.7 but slow FRT 25m needs time management.</p>
                  <p><span className="text-zinc-200 font-medium">Coaching:</span> Pair Alex mentors Dmitri on Message Trace, shadowing 2 tickets/day, private 1:1 SBI, follow-up 1 week. Priya patient mentor, explains step-by-step, pairs with juniors.</p>
                  <p><span className="text-zinc-200 font-medium">Real workplace:</span> 44h/week compliance, SLA/CSAT/QA/FRT/MTTR tracked, mood frustrated/calm/happy, workload max, traits, canApprove different per role.</p>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent border border-violet-500/20">
                <h3 className="text-[13px] font-semibold text-violet-200 mb-2">Training Lab — Like OrbitDesk</h3>
                <p className="text-[12px] text-zinc-400 leading-[1.4]">Practice approvals with What If, audit logs, Break Glass verification. Each operator different skills 1-10: Entra ID 10, Conditional Access 10, Intune 10, Device Compliance 10, etc. Per-tenant expectations: NovaTech technical concise Correlation IDs, Bloom & Co casual friendly emojis simple steps, Apex Financial formal compliance SEC-2024-07 audit trail.</p>
                <div className="mt-3 flex gap-1.5">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">SBI Coaching</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">GROW Model</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">Shadowing</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
            <div className="col-span-6 h-full">
              <RemoteVerification request={selectedRequest} />
            </div>
            <div className="col-span-6 h-full">
              <MockSecurityPortals request={selectedRequest} />
            </div>
          </div>
        )}
      </div>

      {/* Footer — subtle legal like OrbitDesk v2.0.2 */}
      <div className="border-t border-zinc-800/60 bg-[#0a0a0a]/50 mt-8">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between text-[11px] text-zinc-600">
          <div className="flex items-center gap-4">
            <span>Chokepoint Lab — Educational simulation, not real security system. HMAC-signed ledger, hash-chained audit, What If verified, Break Glass excluded from CA.</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Linear dark-first • Stripe mesh • Intercom bubbles • Superhuman ⌘K • Notion warmth • Vercel restraint</span>
            <span className="h-3 w-px bg-zinc-800" />
            <span className="font-mono">v2.0.0 • Military-grade • Zero Trust</span>
          </div>
        </div>
      </div>
    </div>
  );
}

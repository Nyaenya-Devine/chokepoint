/**
 * SecurityDashboard — Clean bento dashboard like OrbitDesk DashboardMetrics v2.0.2
 * Quiet chrome, KPI 28px, SLA, CSAT, FRT, MTTR, Live Queue, Client Health, etc
 * Not basic AI — Linear dark-first violet, Stripe mesh, Intercom bubbles
 */

'use client';

import { useEffect, useState } from 'react';
import { requestEngine, type LiveRequest } from '../data/requestEngine';
import { operators } from '../data/operators';
import { tenants } from '../data/tenants';

export function SecurityDashboard() {
  const [requests, setRequests] = useState<LiveRequest[]>([]);
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    requestEngine.start();
    const unsub = requestEngine.subscribe(setRequests);
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => {
      unsub();
      clearInterval(timer);
      requestEngine.stop();
    };
  }, []);

  const pending = requests.filter(r => r.status === 'pending').length;
  const p1 = requests.filter(r => r.priority === 'P1').length;
  const critical = requests.filter(r => r.risk === 'Critical').length;
  const approved = requests.filter(r => r.status === 'approved').length;
  const avgWorkload = operators.reduce((sum, op) => sum + op.workload, 0) / operators.length;
  const slaAvg = operators.reduce((sum, op) => sum + op.slaCompliance, 0) / operators.length;
  const csatAvg = operators.reduce((sum, op) => sum + op.csat, 0) / operators.length;

  return (
    <div className="space-y-4">
      {/* Header — quiet chrome like OrbitDesk */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-zinc-100">Chokepoint — Live Security Operations</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Real-time high-impact approvals • HMAC-signed • Hash-chained • 5 voices • Per-tenant policies • {liveTime.toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">Live • Encrypted • Recording ON</span>
        </div>
      </div>

      {/* KPI Cards — 28px like OrbitDesk */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 shadow-sm">
          <p className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">Live Queue</p>
          <p className="text-[28px] font-semibold tracking-[-0.02em] text-zinc-100 mt-1">{requests.length}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[12px] text-zinc-400">{pending} pending</span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span className="text-[12px] text-red-400">{p1} P1</span>
          </div>
          <div className="mt-3 h-1 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full bg-violet-500" style={{ width: `${(pending / Math.max(1, requests.length)) * 100}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 shadow-sm">
          <p className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">SLA Compliance</p>
          <p className="text-[28px] font-semibold tracking-[-0.02em] text-zinc-100 mt-1">{slaAvg.toFixed(1)}%</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[12px] text-emerald-400">↑ 2.3% vs yesterday</span>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {operators.slice(0, 5).map(op => (
              <div key={op.id} className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400">
                {op.avatar}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 shadow-sm">
          <p className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">CSAT / QA</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-[28px] font-semibold tracking-[-0.02em] text-zinc-100">{csatAvg.toFixed(1)}</p>
            <span className="text-[14px] text-amber-400">★</span>
            <span className="text-[11px] text-zinc-500">• QA 88 avg</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[12px] text-zinc-400">FRT 14m • MTTR 32m</span>
          </div>
          <div className="mt-3 h-1 rounded-full bg-zinc-800 overflow-hidden flex">
            <div className="h-full bg-emerald-500" style={{ width: '70%' }} />
            <div className="h-full bg-amber-500" style={{ width: '20%' }} />
            <div className="h-full bg-red-500" style={{ width: '10%' }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/60 shadow-sm">
          <p className="text-[11px] font-medium tracking-widest text-zinc-400 uppercase">Critical Risk</p>
          <p className="text-[28px] font-semibold tracking-[-0.02em] text-red-400 mt-1">{critical}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[12px] text-zinc-400">{approved} approved today</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] text-zinc-500">Break Glass verified • What If ready</span>
          </div>
        </div>
      </div>

      {/* Middle row — Client Health + Live Queue + Quick Actions like OrbitDesk */}
      <div className="grid grid-cols-12 gap-3">
        {/* Client Health — per-tenant like OrbitDesk */}
        <div className="col-span-5 p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 shadow-sm">
          <h3 className="text-[13px] font-semibold text-zinc-100 mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            Tenant Health
          </h3>
          <div className="space-y-2.5">
            {tenants.map(tenant => {
              const tenantRequests = requests.filter(r => r.tenantId === tenant.id);
              const nonCompliant = tenant.approvalPolicies.reduce((sum, p) => sum + p.nonCompliant, 0);
              const color = tenant.color === 'violet' ? 'violet' : tenant.color === 'pink' ? 'pink' : 'emerald';
              
              return (
                <div key={tenant.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-lg bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center`}>
                      <span className={`text-[11px] font-bold text-${color}-400`}>{tenant.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-zinc-200">{tenant.name}</p>
                      <p className="text-[11px] text-zinc-500">{tenant.type} • {tenantRequests.length} requests • {tenant.sla}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[11px] font-medium ${nonCompliant > 2 ? 'text-red-400' : nonCompliant > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {nonCompliant > 0 ? `${nonCompliant} non-compliant` : 'Compliant'}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{tenant.approvalPolicies.length} policies</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Queue sparkline + Problem Management */}
        <div className="col-span-4 space-y-3">
          <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 shadow-sm">
            <h3 className="text-[13px] font-semibold text-zinc-100 mb-3">Ticket Trends — Live</h3>
            <div className="h-[60px] flex items-end gap-1">
              {Array.from({ length: 20 }).map((_, i) => {
                const h = 20 + Math.random() * 60;
                const isP1 = Math.random() < 0.2;
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
                    <div className={`rounded-sm ${isP1 ? 'bg-red-500' : 'bg-violet-500/60'}`} style={{ height: `${h}%` }} />
                    <div className="h-1 rounded-full bg-zinc-800" />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-3 text-[11px] text-zinc-500">
              <span>Last 60min • Endless generation</span>
              <span className="flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-red-500" /> P1</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent border border-violet-500/20 shadow-sm">
            <h3 className="text-[13px] font-semibold text-violet-200 mb-2">Problem Management</h3>
            <p className="text-[12px] text-zinc-400 leading-[1.4]">Recurring: {requests.filter(r => r.isRecurring).length} • Root cause: Privilege escalation without What If</p>
            <div className="mt-3 flex gap-1.5">
              <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">Runbook: Approval Checklist</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">KB-042</span>
            </div>
          </div>
        </div>

        {/* Quick Actions + Success Tracker */}
        <div className="col-span-3 space-y-3">
          <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 shadow-sm">
            <h3 className="text-[13px] font-semibold text-zinc-100 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Check Entra Audit Logs', icon: '◍', color: 'violet' },
                { label: 'What If Simulation', icon: '◐', color: 'emerald' },
                { label: 'Verify Break Glass', icon: '◑', color: 'amber' },
                { label: 'Review SIEM Export', icon: '◒', color: 'pink' },
              ].map(action => (
                <button key={action.label} className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors text-left group">
                  <span className={`h-7 w-7 rounded-lg bg-${action.color}-500/10 border border-${action.color}-500/20 flex items-center justify-center text-[12px] group-hover:scale-105 transition-transform`}>
                    {action.icon}
                  </span>
                  <span className="text-[12px] text-zinc-300">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/60 shadow-sm">
            <h3 className="text-[12px] font-semibold text-zinc-200 mb-2">Success Tracker</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-500">Approved today</span>
                <span className="text-emerald-400 font-medium">{approved}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-500">Avg approval time</span>
                <span className="text-zinc-300 font-medium">3.2m</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-500">Break Glass uses</span>
                <span className="text-amber-400 font-medium">0 — Good</span>
              </div>
            </div>
            <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[11px] text-emerald-300">✓ Security Posture: Strong — HMAC-signed, hash-chained, What If verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Posture — like OrbitDesk footer */}
      <div className="p-3 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-emerald-500" />HMAC-signed ledger</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-violet-500" />Hash-chained audit</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-amber-500" />Break Glass verified</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-pink-500" />5 voices balanced</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-emerald-500" />PWA+Electron ready</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-600">Chokepoint v2.0.0 • Military-grade • Tamper-evident • Zero Trust</span>
      </div>
    </div>
  );
}

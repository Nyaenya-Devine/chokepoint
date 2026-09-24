/**
 * Dashboard v3.0 — Security engineering security product
 * Pure focus: dual-control mandates, risk engine, ledger verification, policy center, approvers
 * Product boundary: privileged-action authorization and audit.
 */

'use client';

import { useState } from 'react';
import { SecurityDashboard } from '@/src/components/SecurityDashboard';
import { MandateQueue } from '@/src/components/MandateQueue';
import { DualControlCenter } from '@/src/components/DualControlCenter';
import { ApproverRoster } from '@/src/components/ApproverRoster';
import { PolicyCenter } from '@/src/components/PolicyCenter';
import { LedgerVerification } from '@/src/components/LedgerVerification';

type Tab = 'overview' | 'mandates' | 'policies' | 'approvers' | 'ledger';

export default function DashboardV3() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-[#050507]/85 border-b border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-[8px] bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-black font-bold text-[12px]">C</span>
            </div>
            <span className="text-[14px] font-semibold tracking-[-0.01em]">Chokepoint</span>
            <span className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.08em] text-white/40 uppercase">Tamper-evident • Dual-control • HMAC-signed • automated tests</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06] font-mono">v3.0 • Privileged-action controls</span>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">0 vulns</span>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 h-10 flex items-center gap-1 border-t border-white/[0.04]">
          {[
            { id: 'overview', label: 'Overview', desc: 'Risk + ledger + mandates bento' },
            { id: 'mandates', label: 'Mandates', desc: 'Dual-control queue, 4-eyes' },
            { id: 'policies', label: 'Policies', desc: 'RBAC + ABAC + Break Glass' },
            { id: 'approvers', label: 'Approvers', desc: 'RBAC, distinct, separation' },
            { id: 'ledger', label: 'Ledger', desc: 'Hash chain + HMAC + Merkle' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`h-7 px-3 rounded-full text-[12px] font-medium flex items-center gap-1.5 border transition-all ${activeTab === tab.id ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-transparent text-white/40 border-transparent hover:bg-white/[0.04] hover:text-white/60'}`}
            >
              {tab.label} <span className="text-[10px] opacity-60">• {tab.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <SecurityDashboard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <MandateQueue />
              <LedgerVerification />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PolicyCenter />
              <ApproverRoster />
            </div>
          </div>
        )}
        {activeTab === 'mandates' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1"><MandateQueue /></div>
            <div className="lg:col-span-2"><DualControlCenter /></div>
          </div>
        )}
        {activeTab === 'policies' && <PolicyCenter />}
        {activeTab === 'approvers' && <ApproverRoster />}
        {activeTab === 'ledger' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LedgerVerification />
            <SecurityDashboard />
          </div>
        )}
      </div>

      <footer className="border-t border-white/[0.06] mt-8 py-4 px-4">
        <p className="text-[11px] text-white/20 font-mono text-center">Chokepoint v3.0 • Security engineering • Dual-control 4-eyes • Hash-chained HMAC-signed • tested security properties • OWASP ASI03 • Built by Devine Nyaenya</p>
      </footer>
    </div>
  );
}

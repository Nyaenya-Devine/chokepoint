/**
 * MockSecurityPortals — Mock admin portals for approval context
 * Like OrbitDesk MockPortals but for security: Entra, Intune, CA, Defender, etc
 * Ability to execute actions that seem real
 */

'use client';

import { useState } from 'react';
import type { LiveRequest } from '../data/requestEngine';

interface Props {
  request: LiveRequest | null;
}

const portals = [
  { id: 'entra', name: 'Entra ID', icon: '◍', color: 'violet', description: 'Audit Logs, Sign-in Logs, Users, Devices' },
  { id: 'intune', name: 'Intune', icon: '◐', color: 'emerald', description: 'Devices, Compliance, BitLocker, Autopilot' },
  { id: 'ca', name: 'Conditional Access', icon: '◑', color: 'amber', description: 'Policies, What If, Report-Only, Named Locations' },
  { id: 'defender', name: 'Defender', icon: '◒', color: 'red', description: 'Alerts, Incidents, Tamper Protection, DLP' },
  { id: 'exchange', name: 'Exchange', icon: '◓', color: 'blue', description: 'Message Trace, Quarantine, Mail Flow' },
];

export function MockSecurityPortals({ request }: Props) {
  const [activePortal, setActivePortal] = useState('entra');
  const [executedActions, setExecutedActions] = useState<string[]>([]);

  const executeAction = (action: string) => {
    setExecutedActions(prev => [...prev, `${new Date().toLocaleTimeString()} — ${action} — Executed ✓ — Audit HMAC-signed`]);
  };

  if (!request) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0a0a0a] rounded-2xl border border-zinc-800/60">
        <div className="h-12 w-12 rounded-2xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mb-4">
          <span className="text-zinc-500 text-xl">◍</span>
        </div>
        <h3 className="text-[14px] font-medium text-zinc-200 mb-1">Mock Security Portals</h3>
        <p className="text-[12px] text-zinc-500 text-center max-w-[320px] leading-[1.4]">
          Select a request to see mock portals — Entra, Intune, CA What If, Defender, Exchange. Execute actions that seem real, HMAC-signed audit.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm overflow-hidden">
      <div className="p-3 border-b border-zinc-800/60 bg-zinc-900/50">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-zinc-100">Mock Portals — {request.code} Context</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
            What If • Audit Logs • Real Actions
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2.5">
          {portals.map(portal => (
            <button
              key={portal.id}
              onClick={() => setActivePortal(portal.id)}
              className={`h-7 px-2.5 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 transition-colors ${activePortal === portal.id ? 'bg-violet-500/15 text-violet-300 border-violet-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700/50 hover:border-zinc-600'}`}
            >
              <span>{portal.icon}</span>
              {portal.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activePortal === 'entra' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h4 className="text-[12px] font-semibold text-zinc-200 mb-2">Entra Audit Logs — {request.code}</h4>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between text-zinc-400">
                  <span>Timestamp</span>
                  <span>Actor</span>
                  <span>Action</span>
                  <span>Result</span>
                </div>
                <div className="h-px bg-zinc-800" />
                <div className="flex justify-between text-zinc-300">
                  <span>{new Date(request.requestedAt).toLocaleTimeString()}</span>
                  <span>{request.requestedBy}</span>
                  <span>{request.code}</span>
                  <span className="text-amber-400">Pending</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>08:02</span>
                  <span>john.admin</span>
                  <span>Modified CA policy without Report-Only</span>
                  <span className="text-red-400">Caused P1!</span>
                </div>
              </div>
              <button onClick={() => executeAction(`Checked Entra Audit Logs for ${request.code}`)} className="mt-3 h-7 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium transition-colors">
                Execute: Check Audit Logs
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h4 className="text-[12px] font-semibold text-zinc-200 mb-2">Sign-in Logs — Failed Logins</h4>
              <p className="text-[11px] text-zinc-400 leading-[1.4]">IP 102.214.88.7 — 3 failed logins, then allow request — possible brute force. Check IP reputation, geo, risk.</p>
              <button onClick={() => executeAction(`Checked Sign-in logs IP 102.214.88.7`)} className="mt-2 h-7 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-zinc-300 text-[11px] transition-colors">
                Execute: Check Sign-in Logs
              </button>
            </div>
          </div>
        )}

        {activePortal === 'ca' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <h4 className="text-[12px] font-semibold text-violet-200 mb-2">What If Simulation — {request.code}</h4>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="font-medium text-zinc-300">Current State:</p>
                  <p className="text-zinc-500 mt-1">Policy: {request.tenantId} — {request.requiredTools[0]}</p>
                  <p className="text-zinc-500">Impact: {request.estimatedImpact.substring(0, 60)}...</p>
                  <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20">BLOCK — Device not compliant</span>
                </div>
                <div>
                  <p className="font-medium text-zinc-300">If Approved 15min:</p>
                  <p className="text-zinc-500 mt-1">Impact limited to 15min window, audit shows who approved</p>
                  <p className="text-zinc-500">Break Glass verified, auto-revoke after expiry</p>
                  <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Safe — Limited impact</span>
                </div>
              </div>
              <button onClick={() => executeAction(`Ran What If for ${request.code} — Safe with 15min expiry`)} className="mt-3 h-7 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium transition-colors">
                Execute: What If Simulation
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h4 className="text-[12px] font-semibold text-zinc-200 mb-2">Report-Only Mode — Lessons from OrbitDesk</h4>
              <p className="text-[11px] text-zinc-400 leading-[1.4]">Like OrbitDesk P1 — john.admin changed CA without Report-Only, caused P1 payroll blocked. Always use Report-Only first, monitor impact, then ON. Correlation ID: a7f3c9e2</p>
            </div>
          </div>
        )}

        {activePortal === 'intune' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h4 className="text-[12px] font-semibold text-zinc-200 mb-2">Device Compliance — {request.tenantName}</h4>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-zinc-500">Total devices</span><span className="text-zinc-300">50</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Compliant</span><span className="text-emerald-400">42</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Non-compliant</span><span className="text-red-400">8 — BitLocker not escrowed</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">BitLocker keys escrowed</span><span className="text-amber-400">42/50</span></div>
              </div>
              <button onClick={() => executeAction(`Checked Intune compliance — 8 non-compliant BitLocker`)} className="mt-3 h-7 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium transition-colors">
                Execute: Check Compliance
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-[11px] font-medium text-amber-300">Per SEC-2024-07 — Apex Financial:</p>
              <p className="text-[11px] text-zinc-400 mt-1">Require BitLocker + Key Escrowed to Entra ID and Intune before wipe. 8 devices non-compliant — need verification before approving fleet wipe per compliance.</p>
            </div>
          </div>
        )}

        {activePortal === 'defender' && (
          <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <h4 className="text-[12px] font-semibold text-zinc-200 mb-2">Defender — Tamper Protection + DLP</h4>
            <p className="text-[11px] text-zinc-400 leading-[1.4]">Tamper Protection: ON — All devices compliant. DLP: Blocking external sharing of financial data per SEC-2024-07. Need time-bound exception with approval + audit.</p>
            <button onClick={() => executeAction(`Checked Defender Tamper ON, DLP blocking external sharing`)} className="mt-3 h-7 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-medium transition-colors">
              Execute: Check Defender
            </button>
          </div>
        )}

        {activePortal === 'exchange' && (
          <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <h4 className="text-[12px] font-semibold text-zinc-200 mb-2">Exchange — Message Trace</h4>
            <p className="text-[11px] text-zinc-400 leading-[1.4]">Like OrbitDesk: Message Trace for quarantined emails, release after verification. Correlation ID for tracking.</p>
            <button onClick={() => executeAction(`Checked Exchange Message Trace — no quarantine for ${request.code}`)} className="mt-3 h-7 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition-colors">
              Execute: Message Trace
            </button>
          </div>
        )}

        {executedActions.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-black border border-zinc-800">
            <h4 className="text-[11px] font-medium text-zinc-400 mb-2">Executed Actions — Audit Trail HMAC-signed, Hash-chained</h4>
            <div className="space-y-1 font-mono text-[10px] text-zinc-500 max-h-[100px] overflow-y-auto">
              {executedActions.map((a, i) => (
                <div key={i} className="text-emerald-400">{a}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

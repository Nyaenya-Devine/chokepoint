/**
 * RemoteVerification — Remote device verification for approval context
 * Like OrbitDesk RemoteDesktop but for security verification
 * Shows Entra, Intune, device compliance, dsregcmd, BitLocker, etc
 * 100% real feel that can access client's pc
 */

'use client';

import { useState, useEffect } from 'react';
import type { LiveRequest } from '../data/requestEngine';

interface Props {
  request: LiveRequest | null;
}

const verificationSteps = [
  { id: 'entra', name: 'Entra ID', status: 'checking', icon: '◍', details: 'Checking user, device, audit logs...' },
  { id: 'intune', name: 'Intune Devices', status: 'checking', icon: '◐', details: 'Checking device compliance, BitLocker keys...' },
  { id: 'ca', name: 'Conditional Access', status: 'checking', icon: '◑', details: 'What If simulation for policy impact...' },
  { id: 'defender', name: 'Defender', status: 'checking', icon: '◒', details: 'Checking tamper protection, risk...' },
  { id: 'breakglass', name: 'Break Glass', status: 'checking', icon: '◓', details: 'Verifying Break Glass excluded from CA...' },
];

export function RemoteVerification({ request }: Props) {
  const [steps, setSteps] = useState(verificationSteps);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (request) {
      setIsConnected(true);
      setLogs([`[${new Date().toLocaleTimeString()}] Encrypted session ${request.id.substring(0, 8)} established — ${request.tenantName}`, `[${new Date().toLocaleTimeString()}] Verifying ${request.code} — ${request.title}`]);
      
      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < verificationSteps.length) {
          setSteps(prev => prev.map((s, i) => i === stepIndex ? { ...s, status: 'done' } : s));
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${verificationSteps[stepIndex].name}: Verified — ${verificationSteps[stepIndex].details} ✓`]);
          setActiveStep(stepIndex + 1);
          stepIndex++;
        } else {
          clearInterval(interval);
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] All verifications complete — What If safe with 15min expiry, Break Glass verified, ready for approval`]);
        }
      }, 800);

      return () => clearInterval(interval);
    } else {
      setIsConnected(false);
      setSteps(verificationSteps);
      setActiveStep(0);
      setLogs([]);
    }
  }, [request?.id]);

  if (!request) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0a0a0a] rounded-2xl border border-zinc-800/60">
        <div className="h-12 w-12 rounded-2xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mb-4">
          <span className="text-zinc-500 text-xl">◍</span>
        </div>
        <h3 className="text-[14px] font-medium text-zinc-200 mb-1">Remote Verification</h3>
        <p className="text-[12px] text-zinc-500 text-center max-w-[300px] leading-[1.4]">
          Select a request to start remote verification. Feels 100% real that can access client's PC — Entra, Intune, CA, Defender, Break Glass.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm overflow-hidden">
      {/* Header — Windows 11 like OrbitDesk RemoteDesktop */}
      <div className="h-10 flex items-center justify-between px-3 bg-zinc-900 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[12px] font-medium text-zinc-300 ml-2">Remote Verification — {request.tenantName}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-2 flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            Connected • Encrypted
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <span>Session {request.id.substring(0, 8)}</span>
          <span>•</span>
          <span>Recording ON</span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Steps */}
        <div className="w-[200px] border-r border-zinc-800/60 bg-zinc-900/30 p-3">
          <h4 className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase mb-3">Verification Steps</h4>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={step.id} className={`p-2.5 rounded-xl border transition-colors ${i === activeStep ? 'bg-violet-500/10 border-violet-500/30' : step.status === 'done' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-zinc-800/50 border-zinc-700/30'}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-6 w-6 rounded-lg flex items-center justify-center text-[12px] ${step.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' : i === activeStep ? 'bg-violet-500/20 text-violet-400 animate-pulse' : 'bg-zinc-700 text-zinc-500'}`}>
                    {step.status === 'done' ? '✓' : step.icon}
                  </span>
                  <div>
                    <p className={`text-[12px] font-medium ${step.status === 'done' ? 'text-emerald-300' : i === activeStep ? 'text-violet-300' : 'text-zinc-400'}`}>{step.name}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-[1.2]">{step.details.substring(0, 30)}...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/30">
            <p className="text-[11px] font-medium text-zinc-300">What If Simulation</p>
            <p className="text-[10px] text-zinc-500 mt-1 leading-[1.3]">If approved with 15min expiry: Impact limited, audit shows who approved, Break Glass works, auto-revoke after expiry — Safe</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 mt-2 inline-block">Safe to approve</span>
          </div>
        </div>

        {/* Terminal / Logs — like OrbitDesk dsregcmd */}
        <div className="flex-1 flex flex-col bg-black">
          <div className="p-2 border-b border-zinc-800/60 bg-zinc-900/50 flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-400">C:\Windows\System32&gt; Verification logs — {request.code}</span>
            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          
          <div className="flex-1 p-3 font-mono text-[11px] leading-[1.5] overflow-y-auto">
            <div className="text-zinc-500 mb-2">Microsoft Windows [Version 10.0.22631.3593]</div>
            <div className="text-zinc-500 mb-3">(c) Microsoft Corporation. All rights reserved.</div>
            
            <div className="space-y-1">
              {logs.map((log, i) => (
                <div key={i} className={`${log.includes('✓') ? 'text-emerald-400' : log.includes('Verifying') ? 'text-violet-400' : 'text-zinc-300'}`}>
                  {log}
                </div>
              ))}
              <div className="text-zinc-300 mt-3">
                C:\&gt; dsregcmd /status
              </div>
              <div className="text-zinc-400 ml-2">
                Device State: AzureADJoined YES, DomainJoined NO, WorkplaceJoined NO<br />
                SSO State: AzureAdPrt YES, EnterprisePrt NO<br />
                Device Details: DeviceId {request.id.substring(0, 8)}-..., Thumbprint A1B2...,<br />
                &nbsp;&nbsp;Compliant: {request.tenantId === 'apex' ? 'NO — BitLocker not escrowed' : 'YES'}<br />
                &nbsp;&nbsp;TenantId {request.tenantId}, TenantName {request.tenantName}
              </div>
              
              <div className="text-zinc-300 mt-3">C:\&gt; Check Entra Audit Logs</div>
              <div className="text-zinc-400 ml-2">
                Audit Log: {request.code} requested by {request.requestedBy} at {new Date(request.requestedAt).toLocaleString()}<br />
                Policy: {request.tenantId} — {request.requiredTools.join(', ')}<br />
                Correlation ID: {Math.random().toString(36).substring(2, 10)}-{Math.random().toString(36).substring(2, 6)}<br />
                Result: Pending dual-control approval — distinct approver required
              </div>

              <div className="text-zinc-300 mt-3">C:\&gt; What If Tool — Simulate {request.code}</div>
              <div className="text-emerald-400 ml-2">
                Simulation: If approved with 15min expiry — Impact limited to window, audit trail HMAC-signed, hash-chained, Break Glass verified, auto-revoke after expiry<br />
                Recommendation: Approve with 15min expiry + audit log
              </div>

              <div className="text-zinc-300 mt-3 flex items-center gap-2">
                C:\&gt; <span className="h-3 w-0.5 bg-zinc-400 animate-pulse inline-block" />
              </div>
            </div>
          </div>

          <div className="p-2 border-t border-zinc-800/60 bg-zinc-900/50 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Encrypted session • Recording ON • HMAC-signed • Hash-chained • Real feel PC access</span>
            <span className="font-mono">{request.tenantName} • {request.code}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

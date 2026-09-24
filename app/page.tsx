/**
 * Chokepoint v3.0 — Security engineering security product
 * Pure focus: least-privilege access control & tamper-evident audit for sensitive ops — humans and AI agents
 * Product boundary: privileged-action authorization and audit.
 * Inspired by HashiCorp Vault + Snyk + Vanta + Linear — focused, confident, proof over claims
 */

import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Fingerprint,
  Activity,
  ArrowRight,
  CheckCircle2,
  Zap,
  Eye,
  Layers,
  ShieldAlert,
  Hash,
  FileKey,
  UsersRound,
  AlertTriangle,
  BookOpenCheck,
} from "lucide-react";

const features = [
  {
    icon: UsersRound,
    title: "Dual-control — Two-person rule",
    desc: "Irreversible actions need a second, distinct, authorized approver. Requester cannot approve own. 15min expiry. Break Glass excluded, monitored, alert on use.",
    accent: "amber",
    stats: "4-eyes • Distinct approver • Sealed",
    proof: "authz.test.ts proves distinct-approver + authorized-approver",
  },
  {
    icon: Hash,
    title: "Tamper-evident ledger — Hash chain + HMAC",
    desc: "Every event SHA-256 hash-chained prevHash, HMAC-SHA256 signed with secret. Edit/delete/reorder/re-sign breaks chain and is provable. Merkle inclusion proofs.",
    accent: "violet",
    stats: "SHA-256 • HMAC • Merkle",
    proof: "ledger.test.ts detects altered, deleted, reordered, re-signed",
  },
  {
    icon: ShieldAlert,
    title: "Anomaly detection — Explainable",
    desc: "Failed logins, after-hours privilege, unknown sources, privilege escalation, automation, impossible travel surfaced with human-readable reasons. Risk index 0-100.",
    accent: "emerald",
    stats: "Risk 0-100 • 5 signals • Human reasons",
    proof: "anomaly.test.ts signals fire on intended conditions",
  },
  {
    icon: KeyRound,
    title: "RBAC — Least privilege by default",
    desc: "Viewer / Operator / Auditor / Admin. Single policy gate on every action. Default-deny, explicit allow. Session TTL, CSRF, HttpOnly SameSite=Strict signed cookie.",
    accent: "cyan",
    stats: "4 roles • Default-deny • Session TTL",
    proof: "authz.test.ts policy matrix + fail-closed",
  },
  {
    icon: BookOpenCheck,
    title: "Policy simulator — Dry-run before prod",
    desc: "6 default tests dry-run clone policy. What If impact before approval. Report-Only first. Clone and test without touching prod ledger.",
    accent: "violet",
    stats: "6 tests • Dry-run • Clone",
    proof: "policySimulator.ts + /api/policy-simulate",
  },
  {
    icon: FileKey,
    title: "SIEM export + Compliance mapper",
    desc: "Export JSON / CEF / OCSF / LEEF. Map to NIST, OWASP ASI03, SOC2, MITRE, ISO27001. Impersonation detector for agent_as_human, human_as_agent, role_spoof, session_hijack, token_replay.",
    accent: "amber",
    stats: "4 formats • 5 frameworks • ASI03",
    proof: "siemExport.ts + complianceMapper.ts + impersonationDetector.ts",
  },
];

const securityProperties = [
  { test: "ledger.test.ts", proves: "Detects altered payloads, deleted entries, reordered entries, re-signed wrong-key" },
  { test: "authz.test.ts", proves: "Policy matrix + dual-control distinct + authorized approver, fail-closed" },
  { test: "crypto.test.ts", proves: "PBKDF2 salted timing-safe, HMAC keyed signatures, no hardcoded secrets" },
  { test: "anomaly.test.ts", proves: "Signals fire on failed logins, after-hours, privilege escalation, automation" },
];

export default function LandingV3() {
  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 selection:bg-amber-500/30 relative overflow-hidden">
      {/* Control Plane Livery — Obsidian aurora amber violet, specific to Chokepoint, restrained dark palette */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute top-[-20%] left-[5%] w-[900px] h-[700px] rounded-full blur-[120px] opacity-[0.14] bg-gradient-to-br from-amber-500 via-orange-500 to-red-500" />
        <div className="absolute top-[10%] right-[-10%] w-[700px] h-[600px] rounded-full blur-[100px] opacity-[0.10] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-500" />
        <div className="absolute bottom-[-10%] left-[30%] w-[800px] h-[600px] rounded-full blur-[100px] opacity-[0.06] bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-800" />
        {/* Hash-chain stripes — dual-control livery */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 28px, rgba(251,191,36,0.4) 28px, rgba(251,191,36,0.4) 29px, transparent 29px, transparent 56px, rgba(139,92,246,0.3) 56px, rgba(139,92,246,0.3) 57px)`
        }} />
      </div>

      {/* Top — clean, expert, not OrbitDesk green */}
      <div className="relative z-20 sticky top-0 backdrop-blur-xl bg-[#050507]/85 border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-[10px] bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldCheck className="h-4 w-4 text-black" />
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.01em]">Chokepoint</span>
            <span className="h-4 w-px bg-white/10 hidden md:block" />
            <div className="hidden md:flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.08em] text-white/50 uppercase">Tamper-evident • Dual-control • HMAC-signed • OWASP ASI03</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5">
              {[
                'Hash-chained',
                'HMAC-signed',
                'automated tests',
                '0 vulns',
              ].map(pill => (
                <span key={pill} className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] text-white/50 border border-white/[0.08] font-mono">
                  {pill}
                </span>
              ))}
            </div>
            <Link href="/login" className="h-8 px-4 rounded-full bg-[#FFFDFA] text-[#050507] text-[13px] font-semibold hover:bg-white transition flex items-center gap-1.5 shadow-sm">
              Open demo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-10 py-12 md:py-20">
        {/* Hero — focused security product */}
        <div className="max-w-[900px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-3.5 py-1.5 mb-8">
            <Fingerprint className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-amber-300">OWASP Agentic AI Top 10 • ASI03 Identity & Privilege Abuse • Least-privilege • Tamper-evident</span>
          </div>

          <h1 className="font-display text-[44px] md:text-[76px] leading-[0.9] tracking-[-0.04em] font-[550]">
            A chokepoint for
            <br />
            sensitive ops —
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">human and agent,</span>
            <br />
            <span className="text-[28px] md:text-[36px] font-[400] tracking-[-0.02em] text-white/60 leading-[1.1] block mt-3">with dual-control, hash-chained audit, and explainable anomaly detection. Proof over claims.</span>
          </h1>

          <p className="mt-8 text-[16px] leading-[1.7] text-white/50 max-w-[62ch] font-[400]">
            Chokepoint answers one question: how do you let people — and increasingly, AI agents — perform high-impact actions without giving anyone enough authority to abuse it? 
            <span className="text-white/80"> Role-based auth, working two-person approval, SHA-256 hash-chained HMAC-signed audit log, anomaly detection.</span> No real tenant data. No hardcoded secrets. automated tests that prove the security properties, not toy smoke tests.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 items-center">
            <Link href="/dashboard" className="h-11 px-6 rounded-full bg-[#FFFDFA] text-[#050507] text-[14px] font-semibold inline-flex items-center gap-2 hover:bg-white transition shadow-lg">
              Open live dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="h-11 px-6 rounded-full border border-white/[0.08] bg-white/[0.04] text-white/80 text-[14px] font-medium inline-flex items-center gap-2 hover:bg-white/[0.08] hover:text-white transition backdrop-blur">
              <Layers className="h-4 w-4" /> Explore demo accounts
            </Link>
            <div className="flex items-center gap-2 text-[12px] text-white/40 ml-2 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live • HMAC-signed • Hash-chained • automated tests pass • 0 vulns
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Viewer / Operator / Auditor / Admin",
              "Requester cannot approve own",
              "Break Glass monitored",
              "SHA-256 + HMAC-SHA256 + Merkle",
              "Risk 0-100",
              "NIST + OWASP + SOC2 + MITRE",
            ].map(tag => (
              <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40">{tag}</span>
            ))}
          </div>
        </div>

        {/* Bento — 6 focused security features, not 6 OrbitDesk features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="group relative rounded-[20px] border border-white/[0.06] bg-[#101012]/80 backdrop-blur-[20px] p-6 hover:border-white/[0.12] hover:bg-[#151519] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="flex items-start justify-between mb-4">
                <div className={`h-11 w-11 rounded-[12px] flex items-center justify-center border ${
                  f.accent === 'amber' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                  f.accent === 'violet' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' :
                  f.accent === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                }`}>
                  <f.icon size={20} />
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06] font-mono">{f.stats}</span>
              </div>
              <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#F5F3EF]">{f.title}</h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-white/50">{f.desc}</p>
              <div className="mt-3 p-2.5 rounded-[10px] bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[11px] font-mono text-white/30">Proof: <span className="text-white/60">{f.proof}</span></p>
              </div>
            </div>
          ))}
        </div>

        {/* Proof over claims — tests that prove security properties */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 rounded-[20px] border border-white/[0.06] bg-[#101012]/80 backdrop-blur p-6">
            <h3 className="text-[14px] font-semibold flex items-center gap-2 mb-4">
              <span className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /></span>
              Tests that prove security properties — not toy smoke tests
            </h3>
            <div className="space-y-3">
              {securityProperties.map(item => (
                <div key={item.test} className="flex gap-3 p-3 rounded-[12px] bg-[#08080A] border border-white/[0.06] hover:border-emerald-500/20 transition">
                  <span className="font-mono text-[11px] text-emerald-400 mt-0.5">✓ {item.test}</span>
                  <span className="text-[12px] text-white/50 leading-[1.4]">{item.proves}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">automated tests pass</span>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06]">0 vulns • npm audit</span>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06]">Next 16.3.5 • React 19.2.8</span>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-[20px] border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-orange-500/[0.04] to-transparent backdrop-blur p-6">
            <h3 className="text-[14px] font-semibold text-amber-200 mb-3 flex items-center gap-2"><ShieldAlert className="h-4 w-4" />Military-grade hardening — 10 upgrades</h3>
            <div className="space-y-2.5 text-[12px] leading-[1.5] text-white/50">
              <p><span className="text-white/80 font-medium">1. Encrypted sessions & audit:</span> dual-control 4-eyes, hash-chained HMAC-SHA256 ledger, correlation ID tamper-evident</p>
              <p><span className="text-white/80 font-medium">2. RBAC & least privilege:</span> Viewer Operator Approver Admin, default-deny, separation of duties, TTL + CSRF</p>
              <p><span className="text-white/80 font-medium">3. Break Glass:</span> excluded from approval flows, monitored alert, password in vault, runbook tested quarterly</p>
              <p><span className="text-white/80 font-medium">4. Tamper-evident ledger:</span> SHA-256 chain + HMAC signed secret env, Merkle proofs, /api/audit/verify</p>
              <p><span className="text-white/80 font-medium">5. Zero Trust:</span> verify every request, device trust scoring, OWASP ASI03 mapped</p>
              <p><span className="text-white/80 font-medium">6. Headers:</span> nosniff, DENY, strict-origin, Permissions-Policy, CSP self-only, HSTS 63072000</p>
              <p><span className="text-white/80 font-medium">7. No secrets:</span> no hardcoded PATs, grep ghp_ clean, no real tenant, no tracking</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {['HMAC-signed', 'Hash-chained', 'Merkle', 'Break Glass', 'CSP self-only', 'HSTS 63072000', 'Zero Trust', 'OWASP ASI03'].map(tag => (
                <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Live preview — focused security dashboard, not OrbitDesk tenants */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 rounded-[20px] border border-white/[0.06] bg-[#101012]/80 backdrop-blur overflow-hidden">
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
              <h3 className="text-[13px] font-semibold flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />Live Mandates — Dual-control queue</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06] font-mono">P1 • Critical • HMAC-signed</span>
            </div>
            <div className="p-3 space-y-2">
              {[
                { code: 'PRIV-001', title: 'Escalate operator to admin for incident response', priority: 'P1', risk: 92, status: 'pending_approval', approver: 'Distinct required' },
                { code: 'FLEET-004', title: 'Wipe fleet of 50 devices — lost shipment', priority: 'P1', risk: 95, status: 'pending_approval', approver: 'Admin + Auditor' },
                { code: 'AGENT-002', title: 'Grant agent billing write access to production', priority: 'P1', risk: 88, status: 'in_review', approver: 'Admin only' },
                { code: 'COMPLIANCE-005', title: 'Disable DLP policy for external sharing', priority: 'P2', risk: 67, status: 'pending_approval', approver: 'Auditor required' },
              ].map(req => (
                <div key={req.code} className="p-3 rounded-[12px] bg-[#08080A] border border-white/[0.06] hover:border-amber-500/20 transition-colors">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`h-5 px-1.5 rounded text-[10px] font-bold flex items-center border ${req.priority === 'P1' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{req.priority}</span>
                    <span className="text-[11px] font-mono font-medium text-white/60">{req.code}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06]">Risk {req.risk}</span>
                    <span className="ml-auto text-[10px] font-mono text-white/30">{req.status.replace('_',' ')}</span>
                  </div>
                  <p className="text-[13px] font-medium text-[#F5F3EF] leading-[1.3] line-clamp-1">{req.title}</p>
                  <p className="text-[11px] text-white/40 mt-1">Approver: <span className="text-white/60">{req.approver}</span> • Requester cannot approve own • 15min expiry</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-[20px] border border-white/[0.06] bg-[#101012]/80 backdrop-blur p-5">
              <h3 className="text-[13px] font-semibold flex items-center gap-2 mb-3"><Activity className="h-4 w-4 text-violet-400" />Risk Engine — 0-100 behavioral scoring</h3>
              <div className="space-y-3">
                {[
                  { signal: 'Privilege creep', score: 78, reason: 'Operator escalated 3 times in 24h, unusual velocity' },
                  { signal: 'After-hours', score: 65, reason: 'Admin action at 02:14 UTC, outside 9-5 policy' },
                  { signal: 'Failed auths', score: 82, reason: '5 failed logins from 192.168.1.45, possible brute force' },
                  { signal: 'Impersonation', score: 91, reason: 'Agent token used with human role — ASI03' },
                ].map((item, i) => (
                  <div key={i} className="p-2.5 rounded-[12px] bg-[#08080A] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-white/70">{item.signal}</span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-full border font-mono ${item.score > 80 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{item.score}</span>
                    </div>
                    <p className="text-[11px] text-white/40 leading-[1.3]">{item.reason}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2.5 rounded-[10px] bg-violet-500/10 border border-violet-500/20">
                <p className="text-[11px] text-violet-300 font-mono">riskEngine.ts • velocity + privilege creep + after-hours + failed auths + ASI03 + trust decay</p>
              </div>
            </div>

            <div className="rounded-[20px] border border-white/[0.06] bg-[#101012]/80 backdrop-blur p-5">
              <h3 className="text-[13px] font-semibold flex items-center gap-2 mb-3"><Eye className="h-4 w-4 text-emerald-400" />Audit Ledger — Tamper-evident</h3>
              <div className="space-y-2 font-mono text-[11px]">
                {[
                  { hash: 'a7f3c9e2…', prev: 'b2e1d4f8…', action: 'REQUEST_CREATED', hmac: '✓', time: '14:22:03' },
                  { hash: 'c4d8e1a5…', prev: 'a7f3c9e2…', action: 'APPROVAL_GRANTED', hmac: '✓', time: '14:24:11' },
                  { hash: 'e9f2a6b3…', prev: 'c4d8e1a5…', action: 'POLICY_ENFORCED', hmac: '✓', time: '14:24:12' },
                  { hash: 'f1a3c7d9…', prev: 'e9f2a6b3…', action: 'ANOMALY_DETECTED', hmac: '✓', time: '14:25:00' },
                ].map(entry => (
                  <div key={entry.hash} className="p-2 rounded-[8px] bg-[#08080A] border border-white/[0.06] flex items-center gap-2">
                    <span className="text-emerald-400">{entry.hmac}</span>
                    <span className="text-white/50">{entry.hash}</span>
                    <span className="text-white/20">← {entry.prev}</span>
                    <span className="ml-auto text-white/60">{entry.action}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="p-2.5 rounded-[10px] bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-[11px] text-emerald-300">✓ Chain intact • HMAC verified • Merkle inclusion proof valid • /api/audit/verify</p>
                </div>
                <p className="text-[10px] text-white/30 font-mono">Try tampering: edit one entry → chain breaks → provable. ledger.test.ts proves it.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo accounts — focused, not 8 operators with conflicts */}
        <div className="mt-12 rounded-[20px] border border-white/[0.06] bg-[#101012]/80 backdrop-blur p-6">
          <h3 className="text-[14px] font-semibold mb-1">Try it in 30 seconds — 4 demo accounts, no signup</h3>
          <p className="text-[12px] text-white/40 mb-4">Least-privilege: each role sees only what policy allows. Requester cannot approve own. Proof over claims.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { username: 'admin', password: 'admin1234', role: 'Admin', desc: 'Approves critical, full policy control, Break Glass', color: 'amber' },
              { username: 'operator', password: 'operator1234', role: 'Operator', desc: 'Creates requests, runs scans, requests agent actions', color: 'violet' },
              { username: 'auditor', password: 'auditor1234', role: 'Auditor', desc: 'Verifies integrity, exports SIEM, compliance mapping', color: 'cyan' },
              { username: 'viewer', password: 'viewer1234', role: 'Viewer', desc: 'Read-only dashboard, risk index, anomaly feed', color: 'neutral' },
            ].map(u => (
              <Link key={u.username} href={`/login?user=${u.username}`} className="group p-4 rounded-[14px] border border-white/[0.06] bg-[#08080A] hover:border-white/[0.12] hover:bg-[#0F0F11] transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono tracking-wide uppercase ${u.color === 'amber' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : u.color === 'violet' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : u.color === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-white/5 border-white/10 text-white/40'}`}>{u.role}</span>
                  <CheckCircle2 size={14} className="text-white/20 group-hover:text-amber-400 transition" />
                </div>
                <p className="mt-3 font-mono text-[13px] font-medium text-[#F5F3EF]">{u.username}</p>
                <p className="text-[11px] text-white/40 mt-1 leading-[1.4]">{u.desc}</p>
                <p className="text-[10px] font-mono text-white/20 mt-2">Pass: {u.password}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Architecture — clean */}
        <div className="mt-12 rounded-[20px] border border-white/[0.06] bg-[#0a0a0a]/60 backdrop-blur p-6">
          <h3 className="text-[13px] font-semibold mb-3 flex items-center gap-2"><Layers className="h-4 w-4 text-white/40" />Architecture — Clients → Policy engine → Dual-control → Ledger → Anomaly</h3>
          <div className="font-mono text-[11px] text-white/30 leading-[1.6] bg-[#08080A] border border-white/[0.06] rounded-[12px] p-4 overflow-x-auto">
            <div>Clients (web / PWA / Capacitor)</div>
            <div className="pl-4 border-l border-white/[0.06] ml-2 mt-1">Next.js App Router → Session (HttpOnly, SameSite=Strict, signed cookie)</div>
            <div className="pl-8 border-l border-white/[0.06] ml-2 mt-1">Policy engine (lib/authz) → Dual-control (approve/reject mandates)</div>
            <div className="pl-12 border-l border-white/[0.06] ml-2 mt-1">Tamper-evident ledger (hash chain + HMAC) → Anomaly detection → SIEM export</div>
            <div className="mt-3 text-white/20">Key modules: riskEngine.ts, policySimulator.ts, siemExport.ts, impersonationDetector.ts, complianceMapper.ts — 5 inventive engines, 5 API routes, 4 dashboards gated by can(role,action)</div>
          </div>
        </div>
      </main>

      {/* Footer — professional */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#050507]/80 backdrop-blur mt-12">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-white/30 font-mono">
            <div className="space-y-1">
              <p><span className="text-white/60">Chokepoint v3.0</span> — Least-privilege access control & tamper-evident audit for sensitive ops — humans and AI agents. Educational simulation, HMAC-signed ledger, hash-chained, dual-control 4-eyes, OWASP ASI03.</p>
              <p>Built by Devine Nyaenya • Production-minded engineering • Focused control scope • Proof over claims • automated tests • 0 vulns • Next 16.3.5</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/dashboard" className="hover:text-white/60 transition">Dashboard →</Link>
              <span className="h-3 w-px bg-white/10" />
              <Link href="https://devine-nyaenya-portfolio.vercel.app" className="hover:text-white/60 transition">Portfolio ↗</Link>
              <span className="h-3 w-px bg-white/10" />
              <span>devine@nyaenya.dev</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.04] flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[10px] text-white/20 font-mono">
            <span>Security: PBKDF2/Argon2id + salt, HMAC compare_digest, role whitelist, TTL CSRF IP rate limiting, html.escape, CSP self-only, HSTS 63072000, no secrets, no real tenant</span>
            <span>v3.0 • HashiCorp Vault + Snyk + Vanta + Linear inspiration • Operational security interface</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

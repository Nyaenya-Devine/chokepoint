/**
 * Chokepoint v2.0 Landing — OrbitDesk-inspired masterpiece
 * Linear dark-first violet, Stripe gradient mesh, Intercom human bubbles, Notion warmth, Vercel restraint
 * Not basic AI — human feel, top 1% SaaS, real-time endless requests, voice approvals, per-tenant policies
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
  Phone,
  Monitor,
  Users,
  Building2,
} from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "Real-time endless requests",
    desc: "High-impact ops that need 4-eyes approval — endless generation, P1 critical, expiring timers, recurring patterns",
    accent: "violet",
    stats: "Live • 20 max • HMAC-signed",
  },
  {
    icon: Phone,
    title: "Voice approvals with 5 balanced voices",
    desc: "Requester calls approver, talks with different voices men/women, flowing conversation, client does actions asks questions",
    accent: "emerald",
    stats: "Nia • Dmitri • Jessica • David • Alex",
  },
  {
    icon: Monitor,
    title: "Remote verification — 100% real PC feel",
    desc: "Encrypted session ID, recording ON, audit HMAC-signed, dsregcmd, Entra audit logs, What If, Break Glass verified",
    accent: "amber",
    stats: "Windows 11 • Encrypted • Recording",
  },
  {
    icon: Building2,
    title: "Per-tenant policies — real workplace",
    desc: "NovaTech enterprise strict 24/7, Bloom & Co SMB 9-5 relaxed simple language, Apex Financial regulated SEC-2024-07",
    accent: "pink",
    stats: "NovaTech • Bloom • Apex • Different SLA",
  },
  {
    icon: Users,
    title: "Operators with conflicts & coaching",
    desc: "Dmitri vs Alex conflict public shaming, 44h/week, skills 1-10, SLA/CSAT/QA/FRT/MTTR, mood, SBI coaching, shadowing",
    accent: "violet",
    stats: "8 operators • 44h/week • Conflicts",
  },
  {
    icon: Layers,
    title: "Mock security portals — real actions",
    desc: "Entra, Intune, CA What If, Defender, Exchange Message Trace — execute actions that seem real, audit trail",
    accent: "cyan",
    stats: "What If • Audit Logs • Real Actions",
  },
];

const tenants = [
  { name: 'NovaTech Enterprises', type: 'Enterprise 24/7', color: 'violet', sla: 'P1 60min', policies: 3, nonCompliant: 2, comms: 'Technical concise, Correlation IDs' },
  { name: 'Bloom & Co Studio', type: 'SMB 9-5', color: 'pink', sla: 'P2 8h', policies: 2, nonCompliant: 0, comms: 'Casual friendly emojis simple steps' },
  { name: 'Apex Financial Group', type: 'Regulated', color: 'emerald', sla: 'P1 30min', policies: 3, nonCompliant: 3, comms: 'Formal SEC-2024-07 audit trail' },
];

const operators = [
  { name: 'Nia Owiti', role: 'Admin', avatar: 'N', status: 'available', workload: '2/10', hours: '38/44h', sla: '98%', conflict: null },
  { name: 'Dmitri Kovac', role: 'Operator', avatar: 'D', status: 'busy', workload: '5/5', hours: '44/44h', sla: '92%', conflict: 'vs Alex — public shaming' },
  { name: 'Alex Rivera', role: 'Approver', avatar: 'A', status: 'available', workload: '3/5', hours: '40/44h', sla: '96%', conflict: 'vs Dmitri — needs coaching' },
];

export default function LandingV2() {
  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 selection:bg-violet-500/30 relative overflow-hidden">
      {/* Stripe-inspired gradient mesh + Linear aurora */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-[-20%] left-[5%] w-[900px] h-[700px] rounded-full blur-[120px] opacity-[0.12] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500" />
        <div className="absolute top-[10%] right-[-10%] w-[700px] h-[600px] rounded-full blur-[100px] opacity-[0.08] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="absolute bottom-[-10%] left-[30%] w-[800px] h-[600px] rounded-full blur-[100px] opacity-[0.06] bg-gradient-to-br from-amber-500 via-orange-500 to-red-500" />
      </div>

      {/* Top — friendly dark #0a0a0a emerald pulse like OrbitDesk v2.0.2 */}
      <div className="relative z-20 sticky top-0 backdrop-blur-xl bg-[#0a0a0a]/90 border-b border-zinc-800/60">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 h-11 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <span className="text-[14px] font-semibold tracking-[-0.01em]">Chokepoint</span>
            <span className="h-4 w-px bg-zinc-800 hidden md:block" />
            <div className="hidden md:flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium tracking-widest text-zinc-400 uppercase">◍ Chokepoint Lab • Real Voice Approvals • Desktop Installable</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5">
              {[
                { label: '5 Voices', color: 'violet' },
                { label: 'PWA+Electron', color: 'emerald' },
                { label: 'Security Hardened', color: 'amber' },
              ].map(pill => (
                <span key={pill.label} className={`text-[10px] px-2 py-1 rounded-full bg-${pill.color}-500/10 text-${pill.color}-300 border border-${pill.color}-500/20`}>
                  {pill.label}
                </span>
              ))}
            </div>
            <Link href="/login" className="h-8 px-4 rounded-full bg-zinc-100 text-zinc-900 text-[13px] font-semibold hover:bg-white transition flex items-center gap-1.5">
              Open demo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-10 py-10 md:py-16">
        {/* Hero — massive kinetic typography like Linear */}
        <div className="max-w-[900px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-3 py-1 mb-6">
            <Zap className="h-3 w-3 text-violet-400" />
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-violet-300">Tamper-evident · Dual-control · Voice approvals · Per-tenant policies</span>
          </div>

          <h1 className="font-display text-[42px] md:text-[72px] leading-[0.9] tracking-[-0.04em] font-[550]">
            A chokepoint for
            <br />
            sensitive ops —
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">human and agent,</span>
            <br />
            <span className="text-[32px] md:text-[44px] font-[400] tracking-[-0.02em] text-zinc-400">with voice, real PC feel, per-tenant policies</span>
          </h1>

          <p className="mt-6 text-[17px] leading-[1.6] text-zinc-400 max-w-[60ch] font-[350]">
            Like OrbitDesk but for security — real-time endless high-impact requests that need 4-eyes approval, voice calls where requester/approver talks with different voices men/women flowing conversation client does actions asks questions, remote approval PC feel encrypted session ID recording audit, per-tenant/client policies different strictness like NovaTech/Bloom/Apex, ability to execute actions that seem real, call option where client calls needs live help.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="h-11 px-6 rounded-full bg-zinc-100 text-zinc-900 text-[14px] font-semibold inline-flex items-center gap-2 hover:bg-white transition">
              Open live dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="h-11 px-6 rounded-full border border-zinc-700 bg-zinc-900/50 text-zinc-200 text-[14px] font-medium inline-flex items-center gap-2 hover:bg-zinc-800 hover:border-zinc-600 transition">
              <Layers className="h-4 w-4" /> Explore demo accounts
            </Link>
            <div className="flex items-center gap-2 text-[12px] text-zinc-500 ml-2">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              Live • Endless • HMAC-signed • Hash-chained
            </div>
          </div>
        </div>

        {/* Bento grid — features like OrbitDesk clean */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="group relative rounded-[20px] border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur p-5 hover:border-zinc-700/60 hover:bg-zinc-900/50 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${f.accent === 'violet' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : f.accent === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : f.accent === 'amber' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : f.accent === 'pink' ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
                  <f.icon size={18} />
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700/50 font-mono">{f.stats}</span>
              </div>
              <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-zinc-100">{f.title}</h3>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Live preview — real-time requests + voice + tenants */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Requests live */}
          <div className="lg:col-span-5 rounded-[20px] border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur overflow-hidden">
            <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />Live Requests — Endless</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">P1 • Critical • HMAC-signed</span>
            </div>
            <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto">
              {[
                { code: 'PRIV-001', title: 'Escalate operator to admin for incident response', priority: 'P1', risk: 'Critical', tenant: 'NovaTech', time: '2m 14s', status: 'pending' },
                { code: 'FLEET-004', title: 'Wipe fleet of 50 devices — lost shipment', priority: 'P1', risk: 'Critical', tenant: 'Apex', time: '5m 42s', status: 'pending' },
                { code: 'COMPLIANCE-005', title: 'Disable DLP policy for external sharing', priority: 'P2', risk: 'High', tenant: 'Bloom', time: '8m 03s', status: 'in_review' },
                { code: 'AGENT-002', title: 'Grant agent billing write access to production', priority: 'P1', risk: 'Critical', tenant: 'NovaTech', time: '1m 22s', status: 'pending' },
              ].map(req => (
                <div key={req.code} className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`h-5 px-1.5 rounded text-[10px] font-bold flex items-center ${req.priority === 'P1' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>{req.priority}</span>
                    <span className="text-[11px] font-medium text-zinc-300">{req.code}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${req.tenant === 'NovaTech' ? 'bg-violet-500/10 text-violet-400' : req.tenant === 'Bloom' ? 'bg-pink-500/10 text-pink-400' : 'bg-emerald-500/10 text-emerald-400'} border border-current/20`}>{req.tenant}</span>
                    <span className="ml-auto text-[11px] font-mono text-zinc-500">{req.time}</span>
                  </div>
                  <p className="text-[13px] font-medium text-zinc-100 leading-[1.3] line-clamp-1">{req.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${req.risk === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{req.risk}</span>
                    <span className="text-[11px] text-zinc-500">{req.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice + Tenants */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-[20px] border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur p-4">
              <h3 className="text-[13px] font-semibold flex items-center gap-2 mb-3"><Phone className="h-4 w-4 text-violet-400" />Voice Approvals — 5 Balanced Voices</h3>
              <div className="space-y-2.5">
                {[
                  { speaker: 'Dmitri (Ops)', text: 'Hi, this is Dmitri from Operations at NovaTech. P1 payroll blocked, need admin for 2 hours, Correlation ID a7f3c9e2!', voice: 'masculine Eastern European', sentiment: 'urgent' },
                  { speaker: 'Nia (Security)', text: 'Acknowledged PRIV-001 — Checking audit logs and policy now. Per NovaTech policy, requires dual-control + audit trail.', voice: 'feminine Kenyan', sentiment: 'calm' },
                  { speaker: 'Jessica (SMB)', text: 'Heyy! 😅 DLP blocking me from sharing project files with external client, need to disable for 2 hours!', voice: 'feminine American', sentiment: 'confused' },
                ].map((msg, i) => (
                  <div key={i} className={`p-2.5 rounded-xl border ${msg.sentiment === 'urgent' ? 'bg-red-500/5 border-red-500/20' : msg.sentiment === 'confused' ? 'bg-pink-500/5 border-pink-500/20' : 'bg-violet-500/5 border-violet-500/20'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-zinc-200">{msg.speaker}</span>
                      <span className="text-[10px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-500">{msg.voice}</span>
                    </div>
                    <p className="text-[12px] text-zinc-400 leading-[1.3]">{msg.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-[11px] text-emerald-300">● REC • Encrypted session • Recording ON • HMAC-signed • Human feel • Client does actions</p>
              </div>
            </div>

            <div className="rounded-[20px] border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur p-4">
              <h3 className="text-[13px] font-semibold flex items-center gap-2 mb-3"><Building2 className="h-4 w-4 text-emerald-400" />Tenants — Per-Tenant Policies</h3>
              <div className="space-y-2.5">
                {tenants.map(t => (
                  <div key={t.name} className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <div className={`h-7 w-7 rounded-lg bg-${t.color}-500/10 border border-${t.color}-500/20 flex items-center justify-center`}>
                        <span className={`text-[11px] font-bold text-${t.color}-400`}>{t.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-zinc-200 truncate">{t.name}</p>
                        <p className="text-[11px] text-zinc-500">{t.type} • {t.sla} • {t.policies} policies</p>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${t.nonCompliant > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {t.nonCompliant > 0 ? `${t.nonCompliant} non-compliant` : 'Compliant'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1.5 leading-[1.3]">{t.comms}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Operators + Security */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 rounded-[20px] border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur p-4">
            <h3 className="text-[13px] font-semibold flex items-center gap-2 mb-3"><Users className="h-4 w-4 text-violet-400" />Operators — Conflicts, Skills, 44h/week, Coaching</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {operators.map(op => (
                <div key={op.name} className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[12px] font-medium">{op.avatar}</div>
                    <div>
                      <p className="text-[12px] font-medium text-zinc-200">{op.name}</p>
                      <p className="text-[11px] text-zinc-500">{op.role} • {op.workload} • {op.hours} • SLA {op.sla}</p>
                    </div>
                  </div>
                  {op.conflict && <p className="text-[11px] text-red-400 mt-2 leading-[1.3]">Conflict: {op.conflict}</p>}
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-[11px] font-medium text-amber-300">Learning gaps & coaching like OrbitDesk:</p>
              <p className="text-[11px] text-zinc-400 mt-1 leading-[1.4]">Dmitri escalates easy M365 without Message Trace first. Alex said Dmitri wastes time in public — needs SBI coaching privately. Pair Alex mentors Dmitri on Message Trace, shadowing 2 tickets/day, private 1:1, follow-up 1 week. Priya patient mentor explains step-by-step.</p>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-[20px] border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent backdrop-blur p-4">
            <h3 className="text-[13px] font-semibold text-violet-200 mb-2">Security — Military-grade Hardened</h3>
            <div className="space-y-2 text-[12px] leading-[1.4] text-zinc-400">
              <p><span className="text-zinc-200 font-medium">HMAC-signed ledger:</span> SHA-256 hash chain + HMAC-SHA256, edit one and chain breaks, tamper-evident</p>
              <p><span className="text-zinc-200 font-medium">Dual-control:</span> Irreversible actions need distinct approver, 15min expiry, audit trail, Break Glass excluded from CA</p>
              <p><span className="text-zinc-200 font-medium">What If:</span> Simulate policy impact before approval, Report-Only first like OrbitDesk P1 lesson</p>
              <p><span className="text-zinc-200 font-medium">Zero Trust:</span> CSP self-only, HSTS 63072000, X-Frame DENY, nosniff, Permissions-Policy, no secrets in repo</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['HMAC-signed', 'Hash-chained', 'What If', 'Break Glass', 'CSP self-only', 'HSTS', 'Zero Trust'].map(tag => (
                <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Demo accounts */}
        <div className="mt-8 rounded-[20px] border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur p-5">
          <h3 className="text-[14px] font-semibold mb-3">Try it in 30 seconds — 4 demo accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { username: 'admin', password: 'admin1234', role: 'Admin', desc: 'Approves critical changes, full policy control', color: 'amber' },
              { username: 'operator', password: 'operator1234', role: 'Operator', desc: 'Runs scans and requests agent actions', color: 'violet' },
              { username: 'auditor', password: 'auditor1234', role: 'Auditor', desc: 'Verifies integrity, exports audit log', color: 'cyan' },
              { username: 'viewer', password: 'viewer1234', role: 'Viewer', desc: 'Read-only dashboard', color: 'neutral' },
            ].map(u => (
              <Link key={u.username} href={`/login?user=${u.username}`} className="group p-3 rounded-xl border border-zinc-800/60 bg-zinc-900/50 hover:border-zinc-700/60 hover:bg-zinc-800/50 transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono tracking-wide uppercase ${u.color === 'amber' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : u.color === 'violet' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : u.color === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-zinc-700/50 border-zinc-600/50 text-zinc-400'}`}>{u.role}</span>
                  <CheckCircle2 size={14} className="text-zinc-600 group-hover:text-violet-400 transition" />
                </div>
                <p className="mt-2 font-mono text-[13px] font-medium text-zinc-100">{u.username}</p>
                <p className="text-[11px] text-zinc-500 mt-1 leading-[1.3]">{u.desc}</p>
                <p className="text-[10px] font-mono text-zinc-600 mt-1">Pass: {u.password}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer — 2 rows subtle legal like OrbitDesk v2.0.2 */}
      <footer className="relative z-10 border-t border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur mt-12">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-zinc-600">
            <div className="flex flex-wrap items-center gap-3">
              <span>Chokepoint Lab — Educational simulation, not real security system. HMAC-signed ledger, hash-chained audit, What If verified, Break Glass excluded from CA, dual-control, 4-eyes approval.</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Linear dark-first • Stripe mesh • Intercom bubbles • Superhuman ⌘K • Notion warmth • Vercel restraint</span>
              <span className="h-3 w-px bg-zinc-800" />
              <span className="font-mono">v2.0.0 • Military-grade • Zero Trust • 5 Voices • PWA+Electron</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[11px] text-zinc-700">
            <span>Built by Devine Nyaenya • Inspired by top 20 SaaS combined for best outcome • Human not basic AI • Real-time endless • Voice approvals • Per-tenant policies • Remote PC feel • Desktop installable</span>
            <div className="flex items-center gap-3">
              <span>devine@nyaenya.dev</span>
              <span className="h-3 w-px bg-zinc-700" />
              <Link href="https://devine-nyaenya-portfolio.vercel.app" className="hover:text-zinc-500 transition">Portfolio ↗</Link>
              <span className="h-3 w-px bg-zinc-700" />
              <Link href="/dashboard" className="hover:text-zinc-500 transition">Dashboard →</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

# Security Policy — Chokepoint — Cybersecurity Hardened

## Supported Versions — Electron + PWA

| Version | Supported | Electron | Node | Security Updates | Auto-Update |
| ------- | --------- | -------- | ---- | ---------------- | ----------- |
| 6.6.x   | ✅ Yes | 32.3.3 (Chromium 128) | 20 | Active | GitHub Releases via electron-updater |
| 6.5.x   | ⚠️ Maintenance | 28.0.0 | 20 | Critical only | Manual |
| <6.5    | ❌ No | <28 | <20 | No | No |

**Current:** v6.6.0 — LinkedIn chat dock + orbit animation + modern toast + pause + Electron 32 + auto-update

## Reporting a Vulnerability — Private Disclosure

**DO NOT open public issue with secrets or exploit details.**

1. **GitHub Security Advisory (Preferred — Private):**
   https://github.com/Nyaenya-Devine/chokepoint/security/advisories/new
   - Encrypted, private, allows CVSS, CWE, credit

2. **Email (if advisory not possible):**
   devinenyaenya@gmail.com — PGP optional, subject `[Chokepoint Security]`

**Response SLA:**
- Acknowledgment: 24h
- Triage: 72h
- Fix + Release: 7 days for critical, 14 days for high
- Credit: Hall of Fame in SECURITY.md + release notes

**What to include (no real tenant data):**
- Repro steps, impact, CVSS vector, suggested fix
- No real credentials, PATs, tenant IDs — use simulated data
- Screenshot/PoC if applicable, masked

## Security Architecture — Zero-Trust MSP Lab

### Electron Hardening — v6.6 Essential

| Control | Implementation | File | Status |
| ------- | -------------- | ---- | ------ |
| **Electron Version** | 32.3.3 (Chromium 128, CVE fixes) | package.json | ✅ |
| **Auto-Update** | electron-updater 6.6.2 + electron-log, GitHub Releases signed, user consent | electron.js | ✅ |
| **Sandbox** | `sandbox: true` — renderer isolated | electron.js | ✅ |
| **Context Isolation** | `contextIsolation: true` — no node in renderer | electron.js | ✅ |
| **Node Integration** | `nodeIntegration: false` — zero-trust | electron.js | ✅ |
| **Web Security** | `webSecurity: true`, `allowRunningInsecureContent: false` | electron.js | ✅ |
| **Permissions** | Handler — allow microphone (voice STT), block camera/geo | electron.js | ✅ |
| **Single Instance** | `requestSingleInstanceLock` — prevents spoofing | electron.js | ✅ |
| **CSP** | Session header — default-src self + vercel, script-src unsafe-eval for Next, frame-ancestors none | electron.js + next.config.ts | ✅ |
| **External Nav** | Block untrusted origins, open in browser, log warning | electron.js | ✅ |
| **Preload** | Secure bridge — only whitelisted IPC, no direct node | preload.js | ✅ |

### Next.js Security Headers

```ts
// next.config.ts
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(self), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'
```

- `microphone=(self)` required for voice call center STT — logged, user consent
- `unsafe-eval`/`unsafe-inline` required by Next.js Turbopack dev — production can tighten
- `frame-ancestors 'none'` — anti-clickjacking = DENY

### Supply Chain — SBOM + Dependabot + Audit

- **SBOM:** CycloneDX JSON + XML — `npm run sbom` → sbom.json — uploaded in release artifacts + GitHub Dependency Graph
- **npm ci:** Integrity — lockfile pinned, no floating deps
- **Dependabot:** Weekly npm + github-actions, groups dev-deps + electron, labels security
- **CodeQL:** SAST — javascript, security-and-quality queries — on push/PR/schedule
- **Dependency Review:** Fail on high severity, allow MIT/Apache/BSD/ISC only
- **Secret Scan:** TruffleHog verified + grep ghp_/github_pat_/vcp_ — fails on leak
- **npm audit:** High severity fails, electron >=32 enforced

### MSP Security Model — Simulated but Realistic

- **RBAC:** Senior max 5 tickets skills 7-10, Junior max 3 skills 2-6, Team Lead max 10 all 8 — UI enforces
- **Break Glass:** Emergency admin excluded from all CA — prevents lockout P1
- **Audit Logs:** Entra Audit — who changed CA 08:02 Report-Only OFF→ON, Exchange — who released quarantine, Intune — who changed compliance, Remote — every dsregcmd logged with actor/time
- **Compliance:** BitLocker required + escrowed, Defender real-time + tamper, OS min 10.0.19045/22621, Secure Boot ON for Apex SEC-2024-07, PIN 6 digits
- **CA:** Require compliant device, MFA SMS+Authenticator, Trusted locations Nairobi HQ + Mombasa, Approved client apps Outlook/Teams only for Apex
- **Email:** Quarantine bulk/spam/phish — Release + Allow + Report Not Junk, Anti-spam per-client, Anti-phish impersonation finance, Safe Attachments invoice PDFs, DLP block external sharing PII

### Privacy by Design

- 100% browser, LocalStorage only — no real tenant data
- No tracking cookies, analytics, third-party trackers
- Simulated tickets fictional users only
- Disclaimer: Educational simulator, not affiliated with Microsoft

## Threat Model — See THREAT_MODEL.md

- CA misconfig → P1 50 users blocked — mitigations: Report-Only + What If + peer review + break glass + audit logs
- Stale enrollment 0x80180024 — dsregcmd /status, re-enroll
- Quarantine false positives — Release + Allow Sender + Report Not Junk
- BitLocker key loss — escrowed to Entra ID
- XSS in LinkedIn chat dock — React escapes, no innerHTML, CSP
- Electron IPC bypass — contextIsolation + preload whitelist only
- Auto-update tampering — GitHub Releases signature verification via electron-updater

## Hardening Checklist for Contributors

- [ ] No `ghp_`, `github_pat_`, `vcp_` — `grep -R` clean
- [ ] No `eval()`, no `innerHTML` with user data
- [ ] `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`, `webSecurity: true` preserved
- [ ] Permission handler — microphone only, camera/geo blocked
- [ ] CSP updated if new external origin — next.config.ts + electron.js session header
- [ ] Audit log added for new portal actions
- [ ] `npm run build` — 9/9 routes, no turbopack errors
- [ ] Electron: `npm run desktop` — window opens, no console errors, update check works
- [ ] `npm run sbom` if deps changed

## Security Badges — For README

```md
![CI](https://github.com/Nyaenya-Devine/chokepoint/actions/workflows/ci.yml/badge.svg)
![Security](https://github.com/Nyaenya-Devine/chokepoint/actions/workflows/security.yml/badge.svg)
![CodeQL](https://github.com/Nyaenya-Devine/chokepoint/actions/workflows/security.yml/badge.svg?event=schedule)
![Electron Release](https://github.com/Nyaenya-Devine/chokepoint/actions/workflows/electron-release.yml/badge.svg)
```

## Hall of Fame

- No vulnerabilities reported yet — be first via Security Advisory!

## Contact

- GitHub: @Nyaenya-Devine
- Portfolio: https://devine-nyaenya-portfolio.vercel.app (original, not generic)
- LinkedIn: (add your LinkedIn)
- Email: devinenyaenya@gmail.com

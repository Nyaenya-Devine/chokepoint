# Chokepoint Pull Request — Security & Quality Checklist

## Description
<!-- What does this PR do? Why? Link issue if applicable -->

## Type
- [ ] Feature — new lab capability (ticket, voice, remote, chat)
- [ ] Security — hardening, CVE fix, audit, CSP
- [ ] Electron — auto-update, packaging, desktop
- [ ] PWA — installable, offline, TWA/MSIX
- [ ] Bug fix — regression, SLA, UX
- [ ] Docs — README, SECURITY.md, THREAT_MODEL

## Security Checklist — Zero-Trust Required
- [ ] No hardcoded secrets, PATs, API keys (`grep -r ghp_ --exclude=node_modules` clean)
- [ ] No `eval()`, no `innerHTML` with user data, no `nodeIntegration: true`
- [ ] `contextIsolation: true`, `sandbox: true`, `webSecurity: true` preserved in electron.js
- [ ] CSP headers updated in next.config.ts if new external origin added
- [ ] Permissions handler updated — microphone only for voice calls, camera/geo blocked
- [ ] Audit logging added for new actions (who, what, when)
- [ ] Tested with `npm run build` — 9/9 routes, no turbopack errors
- [ ] Tested Electron: `npm run desktop` — window opens, no console errors, update check works

## Quality
- [ ] StudentModeGuide not covered by toasts (z-100 > dock 65 > toast 45)
- [ ] Layout: flex-1 min-h-0, footer mt-auto, no calc overlap
- [ ] LinkedIn chat dock works: bottom-right 320px, max 2 windows, auto-open live ticket
- [ ] Orbit animation restored around Logo full variant when animated prop true
- [ ] Toast modern: bottom-left, blur-2xl, max 2, progress bar, swipe dismiss
- [ ] Pause system: visibilitychange auto-pause, SLA push-forward, welcome-back tickets

## Screenshots / Loom
<!-- Add screenshot of LinkedIn chat dock + orbit animation + toast position -->

## SBOM & Supply Chain
- [ ] `npm run sbom` generated sbom.json if dependencies changed
- [ ] `npm audit` clean or documented risk acceptance

## Linked Issues
Closes #

## Checklist for Maintainer (Devine)
- [ ] CODEOWNERS approved
- [ ] Security workflow passing (CodeQL, Dependency Review, Secret Scan)
- [ ] Electron release workflow tested (dist artifacts)
- [ ] Vercel preview deployed and smoke-tested

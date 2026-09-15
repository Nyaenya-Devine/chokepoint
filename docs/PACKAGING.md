# Packaging — PWA → Play Store (TWA) + Windows Store (MSIX) + Electron Auto-Update

## Overview — OrbitDesk v6.6 Essential GitHub

OrbitDesk is PWA + Electron. Must be buildable for Play Store via PWABuilder TWA and Windows Store via MSIX, plus Electron auto-update via GitHub Releases — all essential for cybersecurity titles and desktop distribution.

## PWA — Manifest + Service Worker

`public/manifest.json` already has:
- display standalone, icons 192/512 maskable, shortcuts P1 Calls / Remote PC / Experts, file handlers, share target
- `npm run build` generates static export compatible with PWA

Verify:
```bash
npm run build
# Check out/ folder exists, manifest linked in layout
```

## Play Store — TWA via PWABuilder

**Tool:** https://www.pwabuilder.com/

Steps:
1. Deploy to Vercel — https://orbitdesk-gamma.vercel.app must be live, HTTPS, manifest valid, service worker (next-pwa)
2. Go PWABuilder → Enter URL → Score 100% PWA (manifest, icons, offline)
3. Package → Android → TWA — generates Android Studio project
   - Package ID: `com.orbitdesk.lab.twa`
   - Signing key: generate new keystore, keep secure — do NOT commit to GitHub (`grep ghp_` clean)
   - Asset Links: `/.well-known/assetlinks.json` must be hosted on Vercel — PWABuilder gives JSON to add to public/.well-known/
4. Build APK/AAB → Test on device → Upload to Play Console → Production
5. Update: PWABuilder checks manifest, auto-updates TWA if PWA updates — no need to republish unless package ID changes

**Security:**
- Asset Links verifies ownership — prevents spoofing
- TWA runs in Chrome Custom Tab — no WebView vulns, auto-updates Chrome
- No secrets in APK — all data LocalStorage, no API keys

**OrbitDesk Specific:**
- Mic permission for voice calls — declare in TWA manifest `permissions: ["microphone"]`
- Camera/geo blocked — Permissions-Policy in next.config.ts

## Windows Store — MSIX via PWABuilder OR Electron AppX

### Option A — PWA MSIX (Recommended for Store — Lightweight)

1. PWABuilder → Enter https://orbitdesk-gamma.vercel.app → Package → Windows → Generate
   - Package ID: `OrbitDeskLab` (must be unique in Partner Center)
   - Publisher: `CN=Devine Nyaenya` — matches cert
   - Version: 6.6.0
2. Download MSIX package → Test via `Add-AppxPackage .\OrbitDeskLab.msix`
3. Upload to Partner Center → Windows Store → Certification → Publish
4. Update: PWABuilder MSIX auto-updates if PWA updates — no republish unless package identity changes

### Option B — Electron AppX (Full Desktop Features — Auto-Update, Native Notifications)

1. `package.json` build already has win target nsis + portable, but for Store need appx:
```json
"win": {
  "target": [
    {"target": "nsis", "arch": ["x64"]},
    {"target": "appx", "arch": ["x64"]}
  ]
}
```
2. Need Windows cert — self-signed for test, or EV cert for Store — do NOT commit cert to GitHub
3. `npx electron-builder --win appx --publish=never` → dist/*.appx
4. Upload appx to Partner Center — same as MSIX but with full Electron features (auto-updater via GitHub still works, but Store has its own update via Microsoft)

**Security:**
- MSIX/AppX sandboxed — file system isolated, registry virtualized
- No admin required — least privilege
- Auto-update via Store — verified signature via Microsoft

## Electron Auto-Update — GitHub Releases (Essential)

**Why Essential:** Desktop app must auto-update like Chrome/Netflix — secure, not "boom desktop" — user emphasis security.

### Implementation v6.6

- **Deps:** electron-updater 6.6.2 + electron-log 5.2.1 — in package.json
- **electron.js:** autoUpdater logger = log, autoDownload false (user consent zero-trust), autoInstallOnAppQuit true, events checking-for-update, update-available (dialog Download Now/Later), download-progress, update-downloaded (Restart Now/On Next Launch), error
- **preload.js:** Secure IPC — check-for-updates, download-update, install-update, get-app-version, get-app-info, onUpdate* events
- **Menu:** Check for Updates, Version, Security Policy, Threat Model, Audit Logs, Report Security Issue
- **Publish Config:** package.json build.publish provider github owner Nyaenya-Devine repo orbitdesk private false releaseType release — generates latest.yml, latest-mac.yml, etc. for auto-updater to check

### Release Flow

1. Update version in package.json — e.g., 6.6.0 → 6.6.1
2. Commit + Tag:
```bash
git tag v6.6.1
git push origin master --tags
```
3. Workflow `.github/workflows/electron-release.yml` triggers on tag v*.*.*:
   - Builds win (exe nsis portable + yml), mac (dmg zip x64+arm64 + yml), linux (AppImage deb + yml)
   - Publishes to GitHub Releases — https://github.com/Nyaenya-Devine/orbitdesk/releases/tag/v6.6.1
   - Artifacts: OrbitDesk-Setup-6.6.1.exe, OrbitDesk-6.6.1.dmg, OrbitDesk-6.6.1.AppImage, latest.yml, sbom.json
   - Release notes auto-generated with LinkedIn dock + security hardening
4. Existing desktop apps check on startup (3s delay) → autoUpdater.checkForUpdates() → hits GitHub Releases → if new version → dialog → download → install on quit
5. User can also manually check via Menu → Check for Updates or via UI toast

### Manual Test Auto-Update

```bash
npm run desktop:dist   # builds without publish, creates dist/latest.yml locally
# For test, need to publish to GitHub Releases — use npm run desktop:publish with GH_TOKEN
GH_TOKEN=github_pat_xxx npm run desktop:publish
```

**Security:**
- Signature verification — electron-updater verifies SHA512 from latest.yml — prevents MITM
- HTTPS only — GitHub Releases via https
- User consent — autoDownload false — dialog before download — zero-trust
- SBOM included — transparency
- Log via electron-log — audit trail file at app.getPath('logs')

## Checklist — Essential for Cybersecurity Titles

- [ ] PWA manifest valid, icons 512, display standalone, shortcuts
- [ ] next.config.ts security headers DENY nosniff HSTS CSP Permissions-Policy mic=self
- [ ] electron.js 32.3.3 sandbox contextIsolation nodeIntegration false permission handler mic only singleInstance autoUpdater
- [ ] preload.js whitelist IPC only
- [ ] package.json build.publish github + asar true + entitlements.mac.plist hardenedRuntime
- [ ] SBOM via `npm run sbom` → sbom.json in release
- [ ] Dependabot weekly + CODEOWNERS + workflows CI Security Electron Release SBOM passing
- [ ] No secrets `grep -R ghp_` clean
- [ ] Tested `npm run build` 9/9 routes, `npm run desktop` window opens, update check works
- [ ] PWABuilder TWA + MSIX packaging docs tested

## Links

- PWABuilder: https://www.pwabuilder.com/
- Electron Auto-Update: https://www.electron.build/auto-update
- Electron Security: https://www.electronjs.org/docs/latest/tutorial/security
- Play Console: https://play.google.com/console
- Partner Center: https://partner.microsoft.com/dashboard
- GitHub Releases: https://github.com/Nyaenya-Devine/orbitdesk/releases

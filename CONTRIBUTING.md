# Contributing

Thanks for your interest! This repo follows **Build → Test → Break → Learn → Secure**.

## How to Contribute

1. **Find an issue:** Look for `good first issue` or `help wanted` labels
   - OrbitDesk: https://github.com/Nyaenya-Devine/orbitdesk/issues
   - Chokepoint: https://github.com/Nyaenya-Devine/chokepoint/issues
   - Portfolio: https://github.com/Nyaenya-Devine/devine-nyaenya-portfolio/issues

2. **Fork & branch:** `git checkout -b feat/your-feature`

3. **Build & test:**
   - `npm install && npm run build` (Next.js projects)
   - `pytest` (Python projects)
   - Ensure 0 CVEs: `npm audit`

4. **Commit with signed commits:**
   - Setup: `git config commit.gpgsign true` or SSH signing
   - See `docs/SIGNED_COMMITS.md`

5. **Open PR:** Fill template, link issue, add screenshots/GIF if UI change

## Good First Issues

- Add new ticket scenario (Entra 53003, Intune DeviceCapReached)
- Test Electron auto-update on Linux/macOS
- Improve mobile responsive (LinkedIn dock 320px → full-width bottom sheet on <640px)
- Add Cedar policy example
- Test TWA install on Android
- Add OG image for social share

## Code Style

- TypeScript strict, Tailwind, no `any`
- Security: No `dangerouslySetInnerHTML` without sanitization, CSP nonce for scripts
- Accessibility: Keyboard navigable, ARIA labels, contrast >4.5:1

## Community

- Discussions: Use GitHub Discussions for ideas, Q&A, show and tell
- Be kind, be helpful, reply within 24h
- If you find this project helpful, please ⭐ star the repo!

## Security

- Do NOT open public issue for vulnerabilities
- See `SECURITY.md` → Private disclosure via GitHub Security Advisory
- Response SLA: 24h ack, 72h triage, 7d critical fix

Thank you for contributing to this project.

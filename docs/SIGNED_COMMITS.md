# Signed Commits — Essential for Cybersecurity Titles

## Why Essential

For MSP Team Lead + Modern Workplace + Cybersecurity titles, signed commits prove:
- **Authenticity:** Commit really from Devine Nyaenya, not spoofed
- **Integrity:** Commit not tampered in transit — supply chain security
- **Non-repudiation:** Audit trail — who pushed what, when — required for zero-trust
- **GitHub Verified Badge:** Green Verified badge on commits — shows world-class expert, not amateur

OrbitDesk enforces signed commits via branch protection + CODEOWNERS — essential for SLSA L3 provenance.

## Setup — GPG or SSH Signing (Recommended: SSH — simpler, modern)

### Option A — SSH Signing (Recommended — GitHub supports SSH commit signing since 2022)

1. **Generate SSH key if not exists:**
```bash
ssh-keygen -t ed25519 -C "devinenyaenya@gmail.com" -f ~/.ssh/orbitdesk_signing
```

2. **Add public key to GitHub:**
- Go https://github.com/settings/keys → New SSH key → Type: Signing Key → Paste content of `~/.ssh/orbitdesk_signing.pub`

3. **Configure Git:**
```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/orbitdesk_signing.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true
# For this repo only:
git config user.signingkey ~/.ssh/orbitdesk_signing.pub
git config commit.gpgsign true
```

4. **Sign commit:**
```bash
git commit -S -m "feat: LinkedIn chat dock + orbit animation + Electron 32 auto-update"
# GitHub will show Verified badge
```

### Option B — GPG Signing (Classic)

1. **Generate GPG key:**
```bash
gpg --full-generate-key
# RSA 4096, expire 2y, name Devine Nyaenya, email devinenyaenya@gmail.com
```

2. **Export and add to GitHub:**
```bash
gpg --armor --export devinenyaenya@gmail.com
# Copy → https://github.com/settings/keys → New GPG key
gpg --list-secret-keys --keyid-format=long
# Note key ID
git config --global user.signingkey YOUR_GPG_KEY_ID
git config --global commit.gpgsign true
git config --global gpg.program gpg
```

3. **Sign:**
```bash
git commit -S -m "feat: v6.7.1 signed commits + SLSA + assetlinks"
```

## Verify Signed Commits

```bash
git log --show-signature -1
# Should show: gpg: Signature made ... Good signature from "Devine Nyaenya"

git verify-commit HEAD
```

GitHub UI: Commit shows green `Verified` badge — hover shows "This commit was signed with a verified signature"

## Branch Protection — Enforce Signed Commits

**Settings → Branches → Add rule → master:**
- ✅ Require signed commits
- ✅ Require status checks to pass before merging: CI, Security, SBOM
- ✅ Require pull request reviews before merging: 1, CODEOWNERS
- ✅ Require conversation resolution
- ✅ Do not allow bypassing above settings

This prevents unsigned commits — supply chain hardening — essential for cybersecurity titles.

## For OrbitDesk — Current Status

- Commits `ff587cf` + `f37ca80` + `v6.7.0` tag currently unsigned (OrbitDesk bot) — next commits should be signed via SSH
- Workflow `slsa.yml` generates SLSA provenance — attests build artifacts were built from verified signed commit — L3 supply chain
- Release artifacts (exe/dmg/AppImage + latest.yml + sbom.json) include provenance — verifiable via `slsa-verifier`

## Troubleshooting

- **Error: gpg failed to sign data:** `export GPG_TTY=$(tty)` in ~/.bashrc
- **SSH signing not verified on GitHub:** Ensure public key added as Signing Key (not Authentication Key), and `user.signingkey` points to `.pub` file
- **Vercel deploy fails with signed commits:** Vercel supports signed commits — no extra config needed

## Links

- GitHub Docs: https://docs.github.com/en/authentication/managing-commit-signature-verification
- SLSA: https://slsa.dev/
- OrbitDesk Security: .github/SECURITY.md — Hall of Fame for verified signed contributions

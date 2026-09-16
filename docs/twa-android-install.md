# TWA / Android install check (issue #18)

## What we verified (2026-09-16)

Live demo: https://chokepoint-demo.vercel.app/

### 1. Digital Asset Links endpoint

- URL: `https://chokepoint-demo.vercel.app/.well-known/assetlinks.json`
- HTTP status: **200**
- Content-Type: JSON array with one `delegate_permission/common.handle_all_urls` statement
- Package: `com.chokepoint.security.twa`

### 2. Fingerprint gate (blocker for real TWA install)

The published fingerprint is still the template value:

```text
REPLACE_WITH_YOUR_KEYSTORE_SHA256
```

Until this is replaced with the real signing-cert SHA-256 from the Android/TWA keystore, Chrome will **not** treat the site as a verified Trusted Web Activity host. The install prompt may still appear as a generic PWA, but Digital Asset Links verification will fail.

### 3. Desktop/PWA surface (non-Android control)

- Demo homepage returns HTTP 200.
- `public/manifest.webmanifest` / `public/manifest.json` are present with icons (`icon-192.png`, `icon-512.png`) and `sw.js` service worker.

### 4. Recommended Android manual steps (device required)

1. Open https://chokepoint-demo.vercel.app in Chrome on Android.
2. Confirm whether an Install / Add to Home screen / TWA affordance appears (PWABuilder / Bubblewrap packaging).
3. After replacing the fingerprint, re-check with Google's statement list generator / `adb shell pm get-app-links com.chokepoint.security.twa`.
4. Capture a screenshot of the install UI and attach it under `docs/assets/`.

## README screenshot

See `docs/assets/twa-assetlinks-check.svg` for the live Asset Links JSON evidence captured during this check.

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  experimental: {
    // TypeScript 7 uses the native compiler and no longer exposes the legacy JS Compiler API.
    // Next.js uses the project-local tsc CLI for type checking instead.
    useTypeScriptCli: true,
  },
  // Security headers via proxy.ts (nonce-based CSP) — best-in-class
  // This fallback ensures headers even if proxy is bypassed
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            // Was the only one of the four Next apps shipping without a CSP.
            // This app loads nothing off-origin: no next/font, no third-party
            // scripts or stylesheets, no dangerouslySetInnerHTML, and the only
            // external URLs in the source are plain <a href> links. That makes
            // a strict policy safe rather than aspirational. 'unsafe-inline' on
            // script-src stays because Next injects inline bootstrap scripts;
            // removing it needs nonces threaded through every page.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "media-src 'self'",
              "connect-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "worker-src 'self'",
              "manifest-src 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-XSS-Protection", value: "0" },
        ],
      },
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }],
      },
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;

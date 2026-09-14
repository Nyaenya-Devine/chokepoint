import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://chokepoint-demo.vercel.app"),
  title: "Chokepoint v3.0 — Least-privilege & Tamper-evident Audit for Sensitive Ops — Humans and AI Agents",
  description:
    "World-class expert: dual-control 4-eyes distinct approver, SHA-256 hash-chained HMAC-SHA256 + Merkle ledger, anomaly detection explainable, RBAC least privilege, policy simulator dry-run, SIEM JSON/CEF/OCSF/LEEF, compliance NIST/OWASP ASI03/SOC2/MITRE/ISO27001, risk engine 0-100, 26 tests proving security properties. OWASP Agentic AI ASI03. Pure security, no OrbitDesk mixing.",
  applicationName: "Chokepoint",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Chokepoint v3.0 — Pure Security Expert — Dual-control, Hash-chained, HMAC-signed",
    description:
      "Least-privilege access control & tamper-evident audit for sensitive ops — humans and AI agents. Dual-control 4-eyes, hash-chained HMAC-signed ledger, anomaly detection, RBAC, 26 tests proving properties. OWASP ASI03.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}

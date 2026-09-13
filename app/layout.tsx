import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://nyaenya-devine-chokepoint.vercel.app"),
  title: "Chokepoint v2.0 — Live Security Operations with Voice Approvals",
  description:
    "Real-time endless high-impact requests that need 4-eyes approval, voice calls with 5 balanced voices men/women flowing conversation client does actions, remote verification encrypted session ID recording audit, per-tenant policies NovaTech/Bloom/Apex, mock security portals, HMAC-signed hash-chained tamper-evident audit, desktop PWA+Electron",
  applicationName: "Chokepoint",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Chokepoint v2.0 — Live Security Operations with Voice Approvals",
    description:
      "Real-time endless requests, voice approvals 5 balanced voices, remote verification 100% real PC feel, per-tenant policies, mock portals, HMAC-signed tamper-evident, desktop PWA+Electron",
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

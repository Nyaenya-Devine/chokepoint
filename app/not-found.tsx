import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowRight, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Route not found — Chokepoint",
  description:
    "The requested route does not exist. Chokepoint applies default-deny to unknown paths.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative z-10 mx-auto flex min-h-screen max-w-[1280px] flex-col items-center justify-center px-6 py-20 text-center md:px-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-3.5 py-1.5">
        <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-amber-300">
          Default-deny • Unknown route
        </span>
      </div>

      <p className="mt-8 font-mono text-[64px] leading-none tracking-[-0.04em] text-amber-400 md:text-[96px]">
        404
      </p>

      <h1 className="font-display mt-4 text-[36px] leading-[1.05] tracking-[-0.03em] text-white md:text-[52px]">
        No such route
      </h1>

      <p className="mt-5 max-w-[54ch] text-[16px] leading-[1.7] text-white/50">
        This path isn&apos;t part of Chokepoint. Unknown routes are denied by
        default — the same posture the control plane applies to privileged
        actions.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#FFFDFA] px-6 text-[14px] font-semibold text-[#050507] shadow-lg transition hover:bg-white"
        >
          Back to home <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-6 text-[14px] font-medium text-white/80 backdrop-blur transition hover:bg-white/[0.08] hover:text-white"
        >
          <Layers className="h-4 w-4" /> Open live dashboard
        </Link>
      </div>

      <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.18em] text-white/30">
        Chokepoint v3.1 — Least-privilege access control and tamper-evident audit
      </p>
    </main>
  );
}

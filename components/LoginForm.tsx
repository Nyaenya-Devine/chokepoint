"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, ShieldCheck, ArrowLeft } from "lucide-react";

const DEMO = ["admin", "operator", "auditor", "viewer"] as const;

export default function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState(() => params.get("user") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Sign-in failed.");
      return;
    }
    // Full navigation ensures the freshly-set session cookie is sent to the
    // server when the dashboard renders (client-side RSC push could race it).
    router.push("/dashboard");
    router.refresh();
  }

  async function openDemo(role: string) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: role, demo: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      setBusy(false);
      setError(data.error ?? "Demo account is unavailable.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Link href="/" style={{ color: "var(--text-dim)", display: "inline-flex", gap: 6, alignItems: "center", marginBottom: 24 }}>
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="card">
          <div className="row mb-16" style={{ gap: 12 }}>
            <div className="brand-badge"><ShieldCheck size={20} /></div>
            <div>
              <div className="brand-name">Chokepoint</div>
              <div className="brand-sub">Sign in</div>
            </div>
          </div>
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <div className="alert alert-bad mb-16">{error}</div>
            )}
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
              <LogIn size={16} /> {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <div className="mt-16">
            <div className="meta-cell mb-8">One-click demo accounts:</div>
            <div className="row">
              {DEMO.map((role) => (
                <button
                  key={role}
                  type="button"
                  className="btn btn-sm btn-ghost"
                  disabled={busy}
                  onClick={() => void openDemo(role)}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="meta-cell" style={{ textAlign: "center", marginTop: 16 }}>
Demo sessions use in-memory data and reset when the deployment restarts.
        </div>
      </div>
    </div>
  );
}

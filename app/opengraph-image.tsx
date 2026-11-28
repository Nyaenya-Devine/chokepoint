import { ImageResponse } from "next/og";

// Rendered at build time from the app's own livery, so the shared preview is
// always in step with the product and no PNG ever has to be committed. The
// repo deliberately keeps large binaries out of git (see .gitignore), which is
// why this exists instead of an exported og.png.
export const runtime = "edge";
export const alt = "Chokepoint — least-privilege and tamper-evident audit for sensitive operations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(180deg, #050507 0%, #101012 55%, #050507 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* faint audit-grid, echoing the dashboard background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -140,
            left: "28%",
            width: 660,
            height: 380,
            borderRadius: "9999px",
            background: "radial-gradient(closest-side, rgba(255,178,36,0.20), transparent)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: "#FFB224",
              boxShadow: "0 0 24px rgba(255,178,36,0.9)",
            }}
          />
          <div
            style={{
              color: "#A8A6A1",
              fontFamily: "monospace",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Control Plane · v3.0
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: "#F5F3EF", fontSize: 96, fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.02em" }}>
            Chokepoint
          </div>
          <div style={{ color: "#FFB224", fontSize: 38, fontWeight: 600, lineHeight: 1.2 }}>
            Dual-control and tamper-evident audit
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "#A8A6A1", fontSize: 26, maxWidth: 720, lineHeight: 1.4 }}>
            Least-privilege access for humans and AI agents. Four-eyes approval,
            hash-chained ledger, explainable anomaly detection.
          </div>
          <div
            style={{
              color: "#050507",
              background: "#FFB224",
              borderRadius: 12,
              padding: "14px 26px",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            Live demo
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

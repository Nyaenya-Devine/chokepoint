import { redirect } from "next/navigation";
import { getSessionUid } from "@/lib/session";
import { store } from "@/lib/store";
import FleetRiskClient from "@/components/FleetRiskClient";

export const metadata = {
  title: "Fleet Risk — Chokepoint",
  description: "Agent fleet risk scoring, heatmap, and critical agents",
};

export default async function FleetRiskPage() {
  const uid = await getSessionUid();
  if (!uid) redirect("/login");
  const user = store.getUserById(uid);
  if (!user) redirect("/login");

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">Fleet Risk — Behavioral Scoring</h1>
          <p className="page-sub">
            Advanced controls: agent risk profiles from audit chain, anomaly engine, and policy simulator. Scores are derived from the current ledger.
          </p>
        </div>
        <span className="badge badge-ok">live ledger</span>
      </div>
      <FleetRiskClient />
    </>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { requireRole } from "@/lib/apiauth";
import { generateExport, type ExportFormat } from "@/lib/siemExport";
import { assessLedger } from "@/lib/anomaly";

const FORMATS = new Set<ExportFormat>(["json", "cef", "ocsf", "leef"]);

export async function GET(req: NextRequest) {
  const auth = await requireRole("export_log");
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const requestedFormat = searchParams.get("format") ?? "json";
  if (!FORMATS.has(requestedFormat as ExportFormat)) {
    return NextResponse.json({ error: "Unsupported export format." }, { status: 400 });
  }
  const format = requestedFormat as ExportFormat;
  const includeRisk = searchParams.get("includeRisk") !== "false";
  const risks = assessLedger(store.ledger);
  const result = generateExport(store.ledger, risks, { format, includeRisk });

  return new NextResponse(result.content, {
    headers: {
      "Content-Type": result.mimeType,
      "Content-Disposition": `attachment; filename="chokepoint-audit-${Date.now()}.${result.extension}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}

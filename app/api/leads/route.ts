import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, marketingConsent, analysisResult } = await req.json();

    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn("WEBHOOK_URL not set — skipping lead submission");
      return NextResponse.json({ success: true, warning: "Webhook not configured" });
    }

    // Flatten zones into individual fields for CRM readability
    const zoneFields: Record<string, string> = {};
    if (analysisResult?.zones) {
      for (const zone of analysisResult.zones) {
        const key = zone.overlayRegion; // e.g. "forehead", "cheeks"
        zoneFields[`zone_${key}_name`]           = zone.name;
        zoneFields[`zone_${key}_concern`]         = zone.concern;
        zoneFields[`zone_${key}_recommendation`]  = zone.recommendation;
        zoneFields[`zone_${key}_severity`]         = zone.severity;
      }
    }

    // Build a plain-text summary of all zones for easy reading in CRM notes
    const analysisSummary = analysisResult?.zones
      ?.map((z: { name: string; severity: string; concern: string; recommendation: string }) =>
        `${z.name} (${z.severity}): ${z.concern} → ${z.recommendation}`
      )
      .join("\n") ?? "";

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Contact details
        firstName,
        lastName,
        email,
        phone,
        marketingConsent,
        // Analysis summary
        faceShape:        analysisResult?.faceShape ?? null,
        overallSummary:   analysisResult?.overallSummary ?? null,
        analysisSummary,
        // Flattened zone fields
        ...zoneFields,
        // Meta
        source:      "Harley Street Aesthetics Filler Analysis App",
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("Webhook error:", response.status);
      return NextResponse.json({ success: true, warning: "Webhook delivery failed" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ success: true, warning: "Webhook delivery failed" });
  }
}

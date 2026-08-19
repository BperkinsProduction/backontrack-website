import { NextResponse } from "next/server";
import { parseCsv, parseEvents, isPublishedSheet, toCsvUrl } from "../../lib/parseResults.js";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("url") || "";

  // SSRF guard: only accept published Google Sheets URLs.
  if (!isPublishedSheet(raw)) {
    return NextResponse.json(
      { error: "Only published Google Sheets links are supported." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(toCsvUrl(raw), { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Could not load the results sheet." }, { status: 502 });
    }
    const text = await res.text();
    // A sheet that is not published to the web returns Google's HTML page
    // instead of CSV; tell the admin exactly what to fix.
    if (/^\s*<(!doctype|html)/i.test(text)) {
      return NextResponse.json(
        {
          error:
            "This sheet is not published to the web yet. In Google Sheets: File > Share > Publish to web, then republish the link.",
        },
        { status: 422 }
      );
    }
    const events = parseEvents(parseCsv(text));
    return NextResponse.json({ events });
  } catch (err) {
    console.error("Results fetch/parse error:", err);
    return NextResponse.json({ error: "Could not read the results sheet." }, { status: 502 });
  }
}

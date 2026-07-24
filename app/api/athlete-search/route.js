import { createClient } from "@vercel/kv";
import { NextResponse } from "next/server";
import { parseCsv, parseEvents, isPublishedSheet, toCsvUrl } from "../../lib/parseResults.js";

export const runtime = "nodejs";

const DATA_KEY = "backontrack_site_data";

function getKV() {
  return createClient({
    url: process.env.STORAGE_REST_API_URL || process.env.KV_REST_API_URL,
    token: process.env.STORAGE_REST_API_TOKEN || process.env.KV_REST_API_TOKEN,
  });
}

function resultYear(r) {
  if (!r) return null;
  const seasonYear = String(r.season || "").match(/(19|20)\d{2}/);
  if (seasonYear) return seasonYear[0];
  const date = String(r.date || "");
  const dateYear4 = date.match(/(19|20)\d{2}/);
  if (dateYear4) return dateYear4[0];
  const dateYear2 = date.match(/[/\-.](\d{2})\s*$/);
  if (dateYear2) return `20${dateYear2[1]}`;
  return null;
}

// Search every meet's results sheet (for a season) for an athlete name and
// return their finishes across the season.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("name") || "").trim().toLowerCase();
  const season = searchParams.get("season") || "";
  if (q.length < 2) return NextResponse.json({ matches: [] });

  let data = null;
  try {
    data = await getKV().get(DATA_KEY);
  } catch (err) {
    console.error("athlete-search KV error:", err);
    return NextResponse.json({ error: "Could not load results." }, { status: 502 });
  }

  const results = (data?.results || []).filter(
    (r) => (!season || resultYear(r) === season) && isPublishedSheet(r.downloadUrl)
  );

  const matches = [];
  await Promise.all(
    results.map(async (r) => {
      try {
        const res = await fetch(toCsvUrl(r.downloadUrl), { cache: "no-store" });
        if (!res.ok) return;
        const events = parseEvents(parseCsv(await res.text()));
        for (const ev of events) {
          for (const en of ev.entries) {
            if (en.name.toLowerCase().includes(q)) {
              matches.push({
                meet: r.meetName || "Meet",
                date: r.date || "",
                event: ev.title,
                place: en.place,
                name: en.name,
                age: en.age,
                time: en.time,
              });
            }
          }
        }
      } catch {}
    })
  );

  return NextResponse.json({ matches });
}

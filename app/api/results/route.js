import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Minimal CSV parser (handles quoted fields and escaped quotes).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const norm = (s) => (s == null ? "" : String(s)).trim();

// Detect side-by-side event blocks: each "PLACE" header cell starts a block of
// PLACE / NAME / AGE / TIME columns, with the event title in a row just above.
function parseEvents(rows) {
  const events = [];
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r] || [];
    const placeCols = [];
    for (let c = 0; c < row.length; c++) {
      if (norm(row[c]).toUpperCase() === "PLACE") placeCols.push(c);
    }
    for (const pc of placeCols) {
      const nameCol = pc + 1;
      const ageCol = pc + 2;
      const timeCol = pc + 3;

      let title = "";
      for (let tr = r - 1; tr >= 0 && tr >= r - 3; tr--) {
        for (let cc = pc; cc <= timeCol; cc++) {
          const v = norm(rows[tr] && rows[tr][cc]);
          if (v && !["PLACE", "NAME", "AGE", "TIME"].includes(v.toUpperCase())) {
            title = v;
            break;
          }
        }
        if (title) break;
      }

      const entries = [];
      for (let dr = r + 1; dr < rows.length; dr++) {
        const drow = rows[dr] || [];
        const place = norm(drow[pc]);
        const name = norm(drow[nameCol]);
        if (place.toUpperCase() === "PLACE") break;
        if (!place && !name) {
          if (entries.length) break;
          continue;
        }
        if (!name) continue;
        entries.push({
          place,
          name,
          age: norm(drow[ageCol]),
          time: norm(drow[timeCol]),
        });
      }
      if (entries.length) events.push({ title: title || "Event", entries });
    }
  }
  return events;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("url") || "";

  // SSRF guard: only accept published Google Sheets URLs.
  if (!/^https:\/\/docs\.google\.com\/spreadsheets\/d\/e\/[\w-]+\/pub/.test(raw)) {
    return NextResponse.json(
      { error: "Only published Google Sheets links are supported." },
      { status: 400 }
    );
  }

  const csvUrl = raw.replace(/\/pub(html)?(\?.*)?$/, "/pub?output=csv");
  try {
    const res = await fetch(csvUrl, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Could not load the results sheet." }, { status: 502 });
    }
    const text = await res.text();
    const events = parseEvents(parseCsv(text));
    return NextResponse.json({ events });
  } catch (err) {
    console.error("Results fetch/parse error:", err);
    return NextResponse.json({ error: "Could not read the results sheet." }, { status: 502 });
  }
}

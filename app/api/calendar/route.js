export const runtime = "nodejs";

function dateParts(dateStr) {
  if (!dateStr) return null;
  const cleaned = String(dateStr).replace(/(\d+)(st|nd|rd|th)/i, "$1");
  const d = new Date(cleaned);
  if (isNaN(d.getTime())) return null;
  return { y: d.getFullYear(), m: d.getMonth() + 1, day: d.getDate() };
}

function parseTime(timeStr) {
  const m = String(timeStr || "").match(/(\d{1,2}):(\d{2})\s*(a|p)\.?m/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const pm = /p/i.test(m[3]);
  if (pm && h < 12) h += 12;
  if (!pm && h === 12) h = 0;
  return { h, min };
}

const pad = (n) => String(n).padStart(2, "0");
const icsEscape = (s) =>
  String(s || "")
    .replace(/\\/g, "\\\\")
    .replace(/[,;]/g, (m) => "\\" + m)
    .replace(/\r?\n/g, " ");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Back on Track Meet").slice(0, 200);
  const location = (searchParams.get("location") || "").slice(0, 300);
  const details =
    (searchParams.get("details") ||
      "Back on Track All-Comers Track & Field Meet. See backontrackmeets.com for details.").slice(0, 500);

  const dp = dateParts(searchParams.get("date"));
  if (!dp) {
    return new Response("Invalid date", { status: 400 });
  }
  const t = parseTime(searchParams.get("time")) || { h: 18, min: 30 };
  const endH = Math.min(t.h + 2, 23);

  const start = `${dp.y}${pad(dp.m)}${pad(dp.day)}T${pad(t.h)}${pad(t.min)}00`;
  const end = `${dp.y}${pad(dp.m)}${pad(dp.day)}T${pad(endH)}${pad(t.min)}00`;
  const uid = `${start}-${String(title).replace(/\W+/g, "").toLowerCase().slice(0, 30)}@backontrackmeets.com`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Back on Track//Meets//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:America/New_York",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:-0500",
    "TZOFFSETTO:-0400",
    "TZNAME:EDT",
    "DTSTART:19700308T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:-0400",
    "TZOFFSETTO:-0500",
    "TZNAME:EST",
    "DTSTART:19701101T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${start}`,
    `DTSTART;TZID=America/New_York:${start}`,
    `DTEND;TZID=America/New_York:${end}`,
    `SUMMARY:${icsEscape(title)}`,
    location ? `LOCATION:${icsEscape(location)}` : null,
    `DESCRIPTION:${icsEscape(details)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="back-on-track-meet.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}

import { createClient } from "@vercel/kv";
import HomePage from "./HomePage";

// Re-render at most once per minute so admin edits go live quickly while
// regular traffic is served from the static cache.
export const revalidate = 60;

const DATA_KEY = "backontrack_site_data";

function getKV() {
  return createClient({
    url: process.env.STORAGE_REST_API_URL || process.env.KV_REST_API_URL,
    token: process.env.STORAGE_REST_API_TOKEN || process.env.KV_REST_API_TOKEN,
  });
}

// Replace em/en dashes with a plain hyphen in every saved text value so old
// content keeps the site's no-dash style without needing a manual admin edit.
function cleanDashes(value) {
  if (typeof value === "string") {
    return value.replace(/\s*[—–]\s*/g, " - ");
  }
  if (Array.isArray(value)) return value.map(cleanDashes);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = cleanDashes(v);
    return out;
  }
  return value;
}

function meetIso(dateStr) {
  if (!dateStr) return null;
  const cleaned = String(dateStr).replace(/(\d+)(st|nd|rd|th)/i, "$1");
  const d = new Date(cleaned);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Open-Meteo (free, no key) forecast for the next meet, if it's within the
// ~16-day forecast window. Fetched server-side so no browser CORS/CSP needed.
async function getNextMeetWeather(meets, todayIso) {
  const upcoming = (meets || [])
    .map((m) => meetIso(m.date))
    .filter((iso) => iso && iso >= todayIso)
    .sort();
  const nextIso = upcoming[0];
  if (!nextIso) return null;
  const daysAway = Math.round((new Date(`${nextIso}T00:00:00`) - new Date(`${todayIso}T00:00:00`)) / 86400000);
  if (daysAway < 0 || daysAway > 15) return null;
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=39.6418&longitude=-77.72` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code` +
      `&temperature_unit=fahrenheit&timezone=America%2FNew_York&start_date=${nextIso}&end_date=${nextIso}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const j = await res.json();
    const d = j.daily;
    if (!d || !d.time || !d.time.length) return null;
    return {
      forDate: nextIso,
      high: Math.round(d.temperature_2m_max[0]),
      low: Math.round(d.temperature_2m_min[0]),
      precip: d.precipitation_probability_max ? d.precipitation_probability_max[0] : null,
      code: d.weather_code ? d.weather_code[0] : null,
    };
  } catch {
    return null;
  }
}

// Server component: fetch saved site data before render so the first HTML
// already contains real content (dates, contacts, sponsors) for visitors,
// search engines, and link previews. HomePage falls back to its built-in
// defaults for anything missing.
export default async function Page() {
  let saved = null;
  try {
    saved = await getKV().get(DATA_KEY);
  } catch (error) {
    console.error("KV read error during page render:", error);
  }
  // Today's date in the venue's timezone (Hagerstown, MD = Eastern), as
  // YYYY-MM-DD, so meets auto-flip to "completed" the day after they run.
  // revalidate = 60 keeps this current without a redeploy.
  const serverDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const weather = await getNextMeetWeather(saved && saved.meets, serverDate);

  return <HomePage initialData={cleanDashes(saved)} serverDate={serverDate} weather={weather} />;
}

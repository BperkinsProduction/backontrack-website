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
  return <HomePage initialData={saved} />;
}

import { createClient } from "@vercel/kv";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionCookieValue } from "../../lib/session.js";

export const runtime = "nodejs";

const DATA_KEY = "backontrack_site_data";
const MAX_BODY_BYTES = 200_000;

function getKV() {
  return createClient({
    url: process.env.STORAGE_REST_API_URL || process.env.KV_REST_API_URL,
    token: process.env.STORAGE_REST_API_TOKEN || process.env.KV_REST_API_TOKEN,
  });
}

export async function GET() {
  try {
    const kv = getKV();
    const data = await kv.get(DATA_KEY);
    if (data) {
      return NextResponse.json(data);
    }
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("KV read error:", error);
    return NextResponse.json(null, { status: 204 });
  }
}

export async function POST(request) {
  const cookie = cookies().get(SESSION_COOKIE);
  if (!cookie || !verifySessionCookieValue(cookie.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (host && originHost !== host) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  let raw;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = body && body.data;
  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const kv = getKV();
    await kv.set(DATA_KEY, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("KV write error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

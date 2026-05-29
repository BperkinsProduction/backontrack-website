import { NextResponse } from "next/server";
import { SESSION_COOKIE, clearedCookieAttrs } from "../../lib/session.js";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE}=; ${clearedCookieAttrs()}`
  );
  return res;
}

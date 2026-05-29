import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionCookieValue } from "../../lib/session.js";

export const runtime = "nodejs";

export async function GET() {
  const cookie = cookies().get(SESSION_COOKIE);
  const authenticated = cookie ? verifySessionCookieValue(cookie.value) : false;
  return NextResponse.json({ authenticated });
}

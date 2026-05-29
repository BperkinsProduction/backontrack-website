import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionCookieValue,
  passwordsMatch,
  sessionCookieAttrs,
} from "../../lib/session.js";

export const runtime = "nodejs";

export async function POST(request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Admin password not configured on server" },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const provided = body && typeof body.password === "string" ? body.password : "";
  if (!passwordsMatch(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let cookieValue;
  try {
    cookieValue = createSessionCookieValue();
  } catch (err) {
    console.error("Session sign error:", err.message);
    return NextResponse.json(
      { error: "Session secret not configured" },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ success: true });
  res.headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE}=${cookieValue}; ${sessionCookieAttrs()}`
  );
  return res;
}

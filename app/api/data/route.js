import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

const DATA_KEY = "backontrack_site_data";

// GET — load saved site data
export async function GET() {
  try {
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

// POST — save site data (admin only, password required)
export async function POST(request) {
  try {
    const body = await request.json();
    const { password, data } = body;

    // Simple password check
    if (password !== process.env.ADMIN_PASSWORD && password !== "BOT2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await kv.set(DATA_KEY, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("KV write error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

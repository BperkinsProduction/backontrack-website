import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionCookieValue } from "../../lib/session.js";

export const runtime = "nodejs";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dmvkf3ms8";

// Admin-only: list existing images in the Cloudinary account so the admin
// can pick which ones to add to a gallery album. Uses the Admin API with the
// API key/secret kept server-side — the browser never sees the credentials.
export async function GET(request) {
  const cookie = cookies().get(SESSION_COOKIE);
  if (!cookie || !verifySessionCookieValue(cookie.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error:
          "Cloudinary API credentials are not configured. Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET on Vercel.",
      },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");

  const params = new URLSearchParams({ max_results: "60" });
  if (cursor) params.set("next_cursor", cursor);

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?${params.toString()}`;

  try {
    const res = await fetch(endpoint, {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Cloudinary Admin API error:", res.status, text);
      return NextResponse.json(
        { error: "Cloudinary rejected the request. Check your API key/secret." },
        { status: 502 }
      );
    }
    const json = await res.json();
    const resources = (json.resources || []).map((r) => ({
      publicId: r.public_id,
      thumbUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_300,h_200,q_auto,f_auto/${r.public_id}`,
      previewUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_600,h_400,q_auto,f_auto/${r.public_id}`,
      fullUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto/${r.public_id}`,
      createdAt: r.created_at || null,
    }));
    return NextResponse.json({ resources, nextCursor: json.next_cursor || null });
  } catch (err) {
    console.error("Cloudinary assets fetch failed:", err);
    return NextResponse.json(
      { error: "Could not reach Cloudinary." },
      { status: 502 }
    );
  }
}

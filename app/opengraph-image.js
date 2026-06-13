import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Back on Track - Pete Wright Memorial Summer All-Comers Track & Field Series, Hagerstown MD";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded 1200x630 social share card shown when the site is shared on
// Facebook, in text messages, LinkedIn, etc. Generated at build time so it
// stays consistent and needs no design tool.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1A1A",
          padding: 60,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            background: "#F5A123",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            color: "#F5A123",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 10,
            marginBottom: 28,
          }}
        >
          HAGERSTOWN, MARYLAND
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 140,
            fontWeight: 900,
            letterSpacing: -2,
          }}
        >
          <span style={{ color: "#FFFFFF" }}>BACK</span>
          <span style={{ color: "#F5A123", margin: "0 20px" }}>ON</span>
          <span style={{ color: "#FFFFFF" }}>TRACK</span>
        </div>

        <div
          style={{
            display: "flex",
            color: "rgba(255,255,255,0.85)",
            fontSize: 36,
            fontWeight: 600,
            marginTop: 24,
            maxWidth: 1000,
            textAlign: "center",
          }}
        >
          Pete Wright Memorial Summer All-Comers Track &amp; Field Series
        </div>

        <div
          style={{
            display: "flex",
            color: "rgba(255,255,255,0.6)",
            fontSize: 28,
            fontWeight: 500,
            marginTop: 44,
          }}
        >
          Summer 2026  •  North Hagerstown High School  •  Free for Students
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 14,
            background: "#F5A123",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

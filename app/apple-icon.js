import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Clean iPhone home-screen icon: brand-dark background with an orange
// running-track oval. Full-bleed (no transparency) so iOS renders it
// cleanly with its own rounded corners.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1A1A",
        }}
      >
        <div
          style={{
            width: 118,
            height: 78,
            border: "17px solid #F5A123",
            borderRadius: 39,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

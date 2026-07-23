import Link from "next/link";

export const metadata = {
  title: "Page Not Found | Back on Track",
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem 1.5rem",
        background: "#FFFFFF",
        fontFamily: "'Raleway', sans-serif",
        position: "relative",
      }}
    >
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 6, background: "#F5A123" }} />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-stamp.png"
        alt="Back on Track"
        style={{ width: "min(220px, 58vw)", height: "auto", marginBottom: "2rem" }}
      />

      <div
        style={{
          fontSize: "clamp(3.5rem, 15vw, 6rem)",
          fontWeight: 900,
          fontStyle: "italic",
          color: "#1A1A1A",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        4<span style={{ color: "#F5A123" }}>0</span>4
      </div>

      <h1
        style={{
          fontSize: "clamp(1.3rem, 4.5vw, 2rem)",
          fontWeight: 900,
          fontStyle: "italic",
          color: "#1A1A1A",
          margin: "1.1rem 0 0.6rem",
        }}
      >
        Looks like you ran off the track
      </h1>

      <p
        style={{
          fontSize: "1rem",
          color: "#555",
          fontWeight: 400,
          maxWidth: 460,
          lineHeight: 1.7,
          marginBottom: "2rem",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
      </p>

      <Link
        href="/"
        style={{
          background: "#1A1A1A",
          color: "#F5A123",
          fontWeight: 700,
          textDecoration: "none",
          padding: "0.85rem 2.2rem",
          borderRadius: 999,
          fontSize: "0.95rem",
          letterSpacing: "0.03em",
        }}
      >
        Back to Home
      </Link>

      <div style={{ marginTop: "1.75rem", fontSize: "0.85rem", color: "#888", fontWeight: 400 }}>
        or jump to{" "}
        <Link href="/#schedule" style={{ color: "#E8930A", fontWeight: 700, textDecoration: "none" }}>Schedule</Link>
        {"  ·  "}
        <Link href="/#gallery" style={{ color: "#E8930A", fontWeight: 700, textDecoration: "none" }}>Gallery</Link>
        {"  ·  "}
        <Link href="/#contact" style={{ color: "#E8930A", fontWeight: 700, textDecoration: "none" }}>Contact</Link>
      </div>
    </main>
  );
}

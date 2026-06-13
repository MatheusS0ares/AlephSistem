import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0b0a0c 0%, #3d0a16 50%, #0b0a0c 100%)",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Spotlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: "400px",
            height: "300px",
            background: "radial-gradient(ellipse at 50% 0%, rgba(231,182,92,0.25) 0%, transparent 70%)",
            transform: "translateX(-50%)",
          }}
        />
        {/* Eyebrow */}
        <p style={{ fontSize: "18px", color: "#e7b65c", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "20px", fontFamily: "monospace" }}>
          DESDE 2015 · SETOR CENTRAL DO GAMA · DF
        </p>
        {/* Headline */}
        <h1 style={{ fontSize: "72px", fontWeight: 900, color: "#f4efe7", lineHeight: 1.0, marginBottom: "24px", maxWidth: "900px" }}>
          Escola de Dança{" "}
          <span style={{ color: "#e7b65c", fontStyle: "italic" }}>Sala de Ensaio</span>
        </h1>
        {/* Sub */}
        <p style={{ fontSize: "24px", color: "#8c8089", marginBottom: "0" }}>
          10 anos formando corpos, histórias e artistas no coração do Gama.
        </p>
        {/* Brand */}
        <p style={{ position: "absolute", top: "60px", right: "80px", fontSize: "16px", color: "#6e1023", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "monospace" }}>
          SDE DANCE
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

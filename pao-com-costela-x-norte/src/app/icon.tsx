import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<MarcaX tamanho={32} />, size);
}

export function MarcaX({ tamanho }: { tamanho: number }) {
  const traco = Math.round(tamanho * 0.14);
  const braco = Math.round(tamanho * 0.62);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0806",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", width: braco, height: braco, display: "flex" }}>
        <div
          style={{
            position: "absolute",
            top: braco / 2 - traco / 2,
            left: -(braco * 0.21),
            width: braco * 1.42,
            height: traco,
            background: "#ff4d23",
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: braco / 2 - traco / 2,
            left: -(braco * 0.21),
            width: braco * 1.42,
            height: traco,
            background: "#ff4d23",
            transform: "rotate(-45deg)",
          }}
        />
      </div>
    </div>
  );
}

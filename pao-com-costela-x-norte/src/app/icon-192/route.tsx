import { ImageResponse } from "next/og";
import { MarcaX } from "../icon";

export async function GET() {
  return new ImageResponse(<MarcaX tamanho={192} />, { width: 192, height: 192 });
}

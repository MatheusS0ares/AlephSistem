import { ImageResponse } from "next/og";
import { MarcaX } from "../icon";

export async function GET() {
  return new ImageResponse(<MarcaX tamanho={512} />, { width: 512, height: 512 });
}

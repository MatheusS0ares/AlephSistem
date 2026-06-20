import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SDE Dance — Escola de Dança Sala de Ensaio",
    short_name: "SDE Dance",
    description: "10 anos formando corpos, histórias e artistas no coração do Gama–DF.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0A0C",
    theme_color: "#6E1023",
    orientation: "portrait",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      // TODO-CLIENTE: adicionar /public/icon-192.png e /public/icon-512.png
    ],
  };
}

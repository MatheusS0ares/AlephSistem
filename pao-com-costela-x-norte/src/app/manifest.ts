import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// PWA do painel administrativo (é a parte instalável — o site público não precisa).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.nome} — Painel`,
    short_name: "Painel X Norte",
    description: "Painel de pedidos e cardápio do X Norte.",
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    background_color: "#faf8f4",
    theme_color: "#e2451f",
    orientation: "portrait",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      // TODO-CLIENTE: adicionar /public/icon-192.png e /public/icon-512.png
    ],
  };
}

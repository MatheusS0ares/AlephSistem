import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CustomCursor from "@/components/ui/CustomCursor";
import CookieBanner from "@/components/CookieBanner";
import ThemeProvider from "@/components/ui/ThemeProvider";
import { site } from "@/config/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// TODO-CLIENTE: substituir "sdedance.com.br" pelo domínio definitivo
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://sdedance.com.br";

export const metadata: Metadata = {
  title: site.seo.title,
  description: site.seo.description,
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    siteName: site.brand.name,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: `${site.brand.short} — ${site.brand.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: ["/og"],
  },
  robots: { index: true, follow: true },
};

/* Inline script prevents flash of wrong theme before JS hydrates */
const themeScript = `
try {
  var t = localStorage.getItem('sde_theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.dataset.theme = t;
} catch(e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${inter.variable} ${geistMono.variable}`}
    >
      {/* Anti-flash: sets data-theme before first paint */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <CustomCursor />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <CookieBanner />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

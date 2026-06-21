"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(11,10,12,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(110,16,35,0.3)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="flex flex-col leading-none focus-visible:outline-offset-4"
          aria-label="SDE Dance — página inicial"
        >
          <span
            className="text-xl font-bold tracking-wider"
            style={{ color: "var(--color-bone)", fontFamily: "var(--font-display)" }}
          >
            SDE
          </span>
          <span className="text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: "var(--color-spot)" }}>
            DANCE
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide transition-colors duration-200 hover:text-spot focus-visible:text-spot"
              style={{ color: "var(--color-ash)" }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/portal/login"
            className="text-xs tracking-[0.12em] uppercase px-3 py-2 border transition-colors duration-200 hover:border-spot hover:text-bone"
            style={{
              borderColor: "var(--border-mid)",
              color: "var(--color-ash)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Entrar
          </a>
          <a
            href={site.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded text-sm font-medium transition-colors duration-200"
            style={{
              backgroundColor: "var(--color-spot)",
              color: "var(--color-blackout)",
            }}
          >
            Falar no WhatsApp
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className="block w-6 h-px transition-transform duration-300"
            style={{
              backgroundColor: "var(--color-bone)",
              transform: menuOpen ? "rotate(45deg) translate(3px,3px)" : "none",
            }}
          />
          <span
            className="block w-6 h-px transition-opacity duration-200"
            style={{
              backgroundColor: "var(--color-bone)",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-px transition-transform duration-300"
            style={{
              backgroundColor: "var(--color-bone)",
              transform: menuOpen ? "rotate(-45deg) translate(3px,-3px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
          style={{ backgroundColor: "rgba(11,10,12,0.97)" }}
          aria-label="Menu mobile"
        >
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-base py-1 border-b"
              style={{
                color: "var(--color-bone)",
                borderColor: "rgba(110,16,35,0.2)",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/portal/login"
            className="py-2 text-sm border-b text-center"
            style={{ color: "var(--color-spot)", borderColor: "rgba(110,16,35,0.2)" }}
            onClick={() => setMenuOpen(false)}
          >
            Entrar no portal
          </a>
          <a
            href={site.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex justify-center items-center px-5 py-3 rounded text-sm font-medium"
            style={{
              backgroundColor: "var(--color-spot)",
              color: "var(--color-blackout)",
            }}
            onClick={() => setMenuOpen(false)}
          >
            Falar no WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}

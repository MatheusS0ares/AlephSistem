"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const reduced = prefersReducedMotion();

    if (reduced) {
      // Skip elaborate animation, just show content
      gsap.set(
        [eyebrowRef.current, headlineRef.current, subRef.current, ctasRef.current],
        { opacity: 1, y: 0, filter: "blur(0px)" }
      );
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Hold on blackout briefly, then lift the overlay
    tl.fromTo(
      overlayRef.current,
      { opacity: 1 },
      { opacity: 0, duration: 1.2, ease: "power2.inOut" }
    )
      // 2. Eyebrow fades in
      .fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      )
      // 3. Headline rises + blur clears
      .fromTo(
        headlineRef.current,
        { opacity: 0, y: 40, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0 },
        "-=0.3"
      )
      // 4. Sub
      .fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.5"
      )
      // 5. CTAs
      .fromTo(
        ctasRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--color-blackout)" }}
    >
      {/* ── Background media placeholder ── */}
      {/* TODO-CLIENTE: substituir por vídeo/imagem de espetáculo em alta */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(110,16,35,0.18) 0%, transparent 70%), linear-gradient(180deg, var(--color-blackout) 0%, #110810 50%, var(--color-blackout) 100%)",
        }}
      />

      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Amber spotlight — top center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse 50% 70% at 50% 0%, rgba(231,182,92,0.08) 0%, transparent 80%)",
        }}
      />

      {/* ── Blackout overlay (lifted on load) ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ backgroundColor: "var(--color-blackout)" }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 lg:px-10 py-32 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="eyebrow mb-6"
          style={{ opacity: 0 }}
        >
          {site.hero.eyebrow}
        </p>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-bold leading-[1.05] tracking-tight mb-6"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-bone)",
            fontSize: "clamp(2.5rem, 7vw, 6rem)",
            opacity: 0,
          }}
        >
          {site.hero.headline.split(". ").map((part, i) => (
            <span key={i}>
              {i === 0 ? part + ". " : <em>{part}</em>}
              {i === 0 && <br className="hidden sm:block" />}
            </span>
          ))}
        </h1>

        {/* Sub */}
        <p
          ref={subRef}
          className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
          style={{ color: "var(--color-ash)", opacity: 0 }}
        >
          {site.hero.sub}
        </p>

        {/* CTAs */}
        <div
          ref={ctasRef}
          className="flex flex-col sm:flex-row items-center gap-4"
          style={{ opacity: 0 }}
        >
          <a
            href={site.hero.ctaPrimary.href}
            className="inline-flex items-center justify-center px-8 py-4 rounded text-base font-semibold transition-all duration-200 hover:brightness-110 focus-visible:outline-2"
            style={{
              backgroundColor: "var(--color-spot)",
              color: "var(--color-blackout)",
              minWidth: "220px",
            }}
          >
            {site.hero.ctaPrimary.label}
          </a>
          <a
            href={site.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded text-base font-medium border transition-all duration-200 hover:bg-white/5 focus-visible:outline-2"
            style={{
              borderColor: "rgba(244,239,231,0.3)",
              color: "var(--color-bone)",
              minWidth: "220px",
            }}
          >
            {site.hero.ctaSecondary.label}
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2" aria-hidden="true">
          <span
            className="text-[0.65rem] tracking-[0.25em] uppercase"
            style={{ color: "var(--color-ash)" }}
          >
            scroll
          </span>
          <div
            className="w-px h-10 relative overflow-hidden"
            style={{ backgroundColor: "rgba(140,128,137,0.2)" }}
          >
            <div
              className="absolute inset-x-0 top-0 h-1/2"
              style={{
                background: "linear-gradient(to bottom, transparent, var(--color-spot))",
                animation: "scrollDrop 1.8s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollDrop {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { site } from "@/config/site";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

function wordSpans(text: string) {
  return text.split(" ").map((word, i) => (
    <span key={i} className="word-unit inline-block overflow-hidden" style={{ marginRight: "0.28em" }}>
      <span className="word-inner inline-block">{word}</span>
    </span>
  ));
}

export default function Hero() {
  const curtainRef   = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLParagraphElement>(null);
  const headlineRef  = useRef<HTMLHeadingElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const ctasRef      = useRef<HTMLDivElement>(null);
  const stageNumRef  = useRef<HTMLDivElement>(null);
  const yearRef      = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const hasVideo = Boolean(site.hero.backgroundVideo);
  const hasImage = Boolean(site.hero.backgroundImage);

  useEffect(() => {
    registerGsap();
    const reduced = prefersReducedMotion();

    const wordInners = headlineRef.current?.querySelectorAll(".word-inner") ?? [];

    if (reduced) {
      gsap.set([curtainRef.current, eyebrowRef.current, subRef.current, ctasRef.current, stageNumRef.current, yearRef.current], { opacity: 1 });
      gsap.set(wordInners, { y: 0, opacity: 1 });
      return;
    }

    // Animate particles floating up
    if (particlesRef.current) {
      const dots = particlesRef.current.querySelectorAll(".particle");
      dots.forEach((dot) => {
        gsap.to(dot, {
          y: "-100vh",
          opacity: 0,
          duration: gsap.utils.random(4, 9),
          delay: gsap.utils.random(0, 5),
          repeat: -1,
          ease: "none",
        });
      });
    }

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl
      .fromTo(curtainRef.current, { scaleY: 1 }, { scaleY: 0, duration: 1.2, ease: "expo.inOut", transformOrigin: "top" })
      .fromTo(stageNumRef.current, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.1 }, "-=0.55")
      .fromTo(eyebrowRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.4")
      .fromTo(wordInners, { y: "105%", opacity: 0 }, { y: "0%", opacity: 1, duration: 0.7, stagger: 0.055 }, "-=0.2")
      .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
      .fromTo(ctasRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
      .fromTo(yearRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.4");

    return () => { tl.kill(); };
  }, []);

  const [line1] = site.hero.headline.split(". ");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: "var(--color-blackout)" }}>

      {/* ── Background media (foto ou vídeo do cliente) ── */}
      {hasVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={site.hero.backgroundVideo!}
          autoPlay muted loop playsInline
          aria-hidden="true"
        />
      )}
      {!hasVideo && hasImage && (
        <Image
          src={site.hero.backgroundImage!}
          alt="SDE Dance — espetáculo"
          fill
          className="object-cover object-center z-0"
          priority
          sizes="100vw"
        />
      )}

      {/* ── Overlay escuro sobre a mídia (sempre presente) ── */}
      <div
        className="absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background: hasImage || hasVideo
            ? "linear-gradient(180deg, rgba(11,10,12,0.75) 0%, rgba(11,10,12,0.5) 40%, rgba(11,10,12,0.85) 100%)"
            : [
                "radial-gradient(ellipse 85% 65% at 50% 28%, rgba(110,16,35,0.28) 0%, transparent 65%)",
                "radial-gradient(ellipse 45% 55% at 15% 80%, rgba(61,10,22,0.35) 0%, transparent 55%)",
                "radial-gradient(ellipse 30% 40% at 85% 70%, rgba(61,10,22,0.2) 0%, transparent 55%)",
                "linear-gradient(180deg, var(--color-blackout) 0%, #0d060f 50%, var(--color-blackout) 100%)",
              ].join(", "),
        }}
      />

      {/* ── Film grain ── */}
      <div className="absolute inset-0 z-[2] opacity-[0.22] mix-blend-overlay pointer-events-none" aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* ── Spotlight beam ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[2] pointer-events-none" aria-hidden="true"
        style={{ width: "1px", height: "55%", background: "linear-gradient(to bottom, rgba(231,182,92,0.5) 0%, transparent 100%)", boxShadow: "0 0 90px 45px rgba(231,182,92,0.06)" }}
      />

      {/* ── Floating dust particles (CSS-only, no image needed) ── */}
      <div ref={particlesRef} className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${30 + Math.random() * 40}%`,
              bottom: `${Math.random() * 30}%`,
              backgroundColor: "rgba(231,182,92,0.35)",
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {/* ── Ghost "10" ── */}
      <div ref={stageNumRef} className="absolute select-none pointer-events-none z-[3]" aria-hidden="true"
        style={{
          opacity: 0, right: "-1vw", top: "50%", transform: "translateY(-52%)",
          fontFamily: "var(--font-display)", fontSize: "clamp(16rem, 26vw, 30rem)",
          fontWeight: 900, lineHeight: 1, color: "transparent",
          WebkitTextStroke: "1px rgba(110,16,35,0.18)", letterSpacing: "-0.06em",
        }}>
        10
      </div>

      {/* ── Curtain overlay ── */}
      <div ref={curtainRef} className="absolute inset-0 z-20 pointer-events-none"
        style={{ backgroundColor: "var(--color-blackout)", transformOrigin: "top" }} aria-hidden="true" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full pt-28 pb-24">
        <div className="max-w-4xl">

          <p ref={eyebrowRef} className="eyebrow mb-8" style={{ opacity: 0 }}>
            {site.hero.eyebrow}
          </p>

          <h1 ref={headlineRef} className="font-bold leading-[0.92] tracking-tight mb-10"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.2rem, 8.5vw, 8rem)", color: "var(--color-bone)" }}>
            <span className="block">{wordSpans(line1 + ".")}</span>
            <span className="block italic" style={{ color: "var(--color-spot)" }}>
              {wordSpans("É um atravessamento.")}
            </span>
          </h1>

          <p ref={subRef} className="text-lg md:text-xl max-w-xl leading-relaxed mb-12"
            style={{ color: "var(--color-ash)", opacity: 0 }}>
            {site.hero.sub}
          </p>

          <div ref={ctasRef} className="flex flex-col sm:flex-row items-start gap-4" style={{ opacity: 0 }}>
            <a href={site.hero.ctaPrimary.href}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold transition-all duration-300 hover:brightness-110 hover:-translate-y-px"
              style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)", minWidth: "230px" }}>
              {site.hero.ctaPrimary.label}
            </a>
            <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium border transition-all duration-300 hover:bg-white/5 hover:-translate-y-px"
              style={{ borderColor: "rgba(244,239,231,0.22)", color: "var(--color-bone)", minWidth: "230px" }}>
              {site.hero.ctaSecondary.label}
            </a>
          </div>
        </div>

        <div ref={yearRef} className="absolute bottom-10 right-6 lg:right-10 flex flex-col items-end gap-0.5" style={{ opacity: 0 }} aria-hidden="true">
          <span className="text-[0.6rem] tracking-[0.35em] uppercase" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>Since</span>
          <span className="text-5xl font-black tabular-nums" style={{ fontFamily: "var(--font-display)", color: "var(--color-vinho)", lineHeight: 1 }}>
            {site.brand.since}
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-6 lg:left-10 flex items-center gap-3" aria-hidden="true">
        <div className="w-8 h-px" style={{ backgroundColor: "rgba(140,128,137,0.4)" }} />
        <span className="text-[0.6rem] tracking-[0.25em] uppercase" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>scroll</span>
      </div>
    </section>
  );
}

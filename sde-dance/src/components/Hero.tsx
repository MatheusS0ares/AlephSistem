"use client";

import { useEffect, useRef } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const stageNumRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const reduced = prefersReducedMotion();
    const curtain = curtainRef.current;
    const eyebrow = eyebrowRef.current;
    const headline = headlineRef.current;
    const sub = subRef.current;
    const ctas = ctasRef.current;
    const stageNum = stageNumRef.current;
    const year = yearRef.current;
    const wordInners = headline?.querySelectorAll(".word-inner") ?? [];

    if (reduced) {
      gsap.set([curtain, eyebrow, sub, ctas, stageNum, year], { opacity: 1 });
      gsap.set(wordInners, { y: 0, opacity: 1 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl
      .fromTo(curtain, { scaleY: 1 }, { scaleY: 0, duration: 1.1, ease: "expo.inOut", transformOrigin: "top" })
      .fromTo(stageNum, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" }, "-=0.55")
      .fromTo(eyebrow, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.4")
      .fromTo(wordInners, { y: "105%", opacity: 0 }, { y: "0%", opacity: 1, duration: 0.65, stagger: 0.055 }, "-=0.2")
      .fromTo(sub, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
      .fromTo(ctas, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
      .fromTo(year, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.4");

    return () => { tl.kill(); };
  }, []);

  const [line1] = site.hero.headline.split(". ");

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: "var(--color-blackout)" }}>
      <div className="absolute inset-0 z-0" aria-hidden="true" style={{ background: ["radial-gradient(ellipse 85% 65% at 50% 28%, rgba(110,16,35,0.24) 0%, transparent 65%)","radial-gradient(ellipse 45% 55% at 15% 80%, rgba(61,10,22,0.35) 0%, transparent 55%)","radial-gradient(ellipse 30% 40% at 85% 70%, rgba(61,10,22,0.2) 0%, transparent 55%)","linear-gradient(180deg, var(--color-blackout) 0%, #0d060f 50%, var(--color-blackout) 100%)"].join(", ") }} />
      <div className="absolute inset-0 z-0 opacity-[0.25] mix-blend-overlay pointer-events-none" aria-hidden="true" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "256px 256px" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none" aria-hidden="true" style={{ width: "1px", height: "50%", background: "linear-gradient(to bottom, rgba(231,182,92,0.4) 0%, transparent 100%)", boxShadow: "0 0 80px 40px rgba(231,182,92,0.07)" }} />
      <div className="absolute bottom-0 left-[12%] z-0 pointer-events-none" aria-hidden="true" style={{ width: "1px", height: "40%", background: "linear-gradient(to top, rgba(110,16,35,0.5) 0%, transparent 100%)", boxShadow: "0 0 100px 50px rgba(110,16,35,0.08)" }} />
      <div ref={stageNumRef} className="absolute select-none pointer-events-none z-0" aria-hidden="true" style={{ opacity: 0, right: "-1vw", top: "50%", transform: "translateY(-52%)", fontFamily: "var(--font-display)", fontSize: "clamp(20rem, 32vw, 38rem)", fontWeight: 900, lineHeight: 1, color: "transparent", WebkitTextStroke: "1px rgba(110,16,35,0.2)", letterSpacing: "-0.06em" }}>10</div>
      <div ref={curtainRef} className="absolute inset-0 z-20 pointer-events-none" style={{ backgroundColor: "var(--color-blackout)", transformOrigin: "top" }} aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 w-full pt-28 pb-24">
        <div className="max-w-4xl">
          <p ref={eyebrowRef} className="eyebrow mb-8" style={{ opacity: 0 }}>{site.hero.eyebrow}</p>
          <h1 ref={headlineRef} className="font-bold leading-[0.92] tracking-tight mb-10" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 12vw, 11rem)", color: "var(--color-bone)" }}>
            <span className="block">{wordSpans(line1 + ".")}</span>
            <span className="block italic" style={{ color: "var(--color-spot)" }}>{wordSpans("É um atravessamento.")}</span>
          </h1>
          <p ref={subRef} className="text-lg md:text-xl max-w-xl leading-relaxed mb-12" style={{ color: "var(--color-ash)", opacity: 0 }}>{site.hero.sub}</p>
          <div ref={ctasRef} className="flex flex-col sm:flex-row items-start gap-4" style={{ opacity: 0 }}>
            <a href={site.hero.ctaPrimary.href} data-cursor="VER" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold transition-all duration-300 hover:brightness-110 hover:-translate-y-px" style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)", minWidth: "230px" }}>{site.hero.ctaPrimary.label}</a>
            <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer" data-cursor="FALAR" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium border transition-all duration-300 hover:bg-white/5 hover:-translate-y-px" style={{ borderColor: "rgba(244,239,231,0.22)", color: "var(--color-bone)", minWidth: "230px" }}>{site.hero.ctaSecondary.label}</a>
          </div>
        </div>
        <div ref={yearRef} className="absolute bottom-10 right-6 lg:right-10 flex flex-col items-end gap-0.5" style={{ opacity: 0 }} aria-hidden="true">
          <span className="text-[0.6rem] tracking-[0.35em] uppercase" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>Since</span>
          <span className="text-5xl font-black tabular-nums" style={{ fontFamily: "var(--font-display)", color: "var(--color-vinho)", lineHeight: 1 }}>{site.brand.since}</span>
        </div>
      </div>
      <div className="absolute bottom-8 left-6 lg:left-10 flex items-center gap-3" aria-hidden="true">
        <div className="relative w-10 h-px overflow-hidden" style={{ backgroundColor: "rgba(140,128,137,0.25)" }}>
          <div className="absolute inset-y-0 left-0 w-full" style={{ backgroundColor: "var(--color-spot)", animation: "scrollPulse 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite" }} />
        </div>
        <span className="text-[0.6rem] tracking-[0.25em] uppercase" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>scroll</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px z-10" style={{ backgroundColor: "var(--color-vinho)" }} aria-hidden="true" />
      <style>{`@keyframes scrollPulse { 0% { transform: translateX(-100%); } 55% { transform: translateX(0%); } 100% { transform: translateX(100%); } }`}</style>
    </section>
  );
}

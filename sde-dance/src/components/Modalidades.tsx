"use client";

import { useRef, useEffect } from "react";
import { site } from "@/config/site";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

export default function Modalidades() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="modalidades"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-blackout)" }}
    >
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-28 lg:pt-36 pb-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="eyebrow mb-3">Programa</p>
            <h2
              className="font-semibold leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-bone)",
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
              }}
            >
              Modalidades
            </h2>
          </div>
          <p className="text-sm max-w-sm text-right hidden md:block" style={{ color: "var(--color-ash)" }}>
            Turmas para todas as idades — do Baby Ballet ao adulto avançado.
          </p>
        </div>
      </div>

      {/* Playbill items */}
      <div className="pb-16 lg:pb-24">
        {site.modalidades.map((mod, idx) => (
          <PlaybillItem key={mod.numero} mod={mod} index={idx} />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pb-28 lg:pb-36">
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-8 border-t"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <p className="text-sm flex-1" style={{ color: "var(--color-ash)" }}>
            Fale conosco para confirmar vagas e agendar sua aula experimental gratuita.
          </p>
          <a
            href={site.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}
          >
            Consultar turmas
          </a>
        </div>
      </div>
    </section>
  );
}

type Mod = (typeof site.modalidades)[number];

function PlaybillItem({ mod, index }: { mod: Mod; index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = itemRef.current;
    const num = numRef.current;
    const content = contentRef.current;
    if (!el || !num || !content) return;

    if (!prefersReducedMotion()) {
      const ctx = gsap.context(() => {
        // Number zooms in from behind
        gsap.fromTo(num,
          { opacity: 0, scale: 1.15, x: 20 },
          {
            opacity: 1, scale: 1, x: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
          }
        );
        // Content slides up
        gsap.fromTo(content,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 0.7, delay: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
          }
        );
      }, el);

      // Hover refletor
      const showGlow = () => gsap.to(glowRef.current, { opacity: 1, duration: 0.3 });
      const hideGlow = () => gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
      el.addEventListener("mouseenter", showGlow);
      el.addEventListener("mouseleave", hideGlow);

      return () => {
        ctx.revert();
        ScrollTrigger.refresh();
        el.removeEventListener("mouseenter", showGlow);
        el.removeEventListener("mouseleave", hideGlow);
      };
    }
  }, [index]);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={itemRef}
      className="relative group border-b"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      {/* Amber refletor line — top */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
        aria-hidden="true"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(231,182,92,0.7) 50%, transparent 100%)",
          opacity: 0,
          boxShadow: "0 0 16px 3px rgba(231,182,92,0.2)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className={`flex items-stretch min-h-[220px] lg:min-h-[260px] ${isEven ? "" : "flex-row-reverse"}`}>

          {/* Giant act number — NDT / Paris Opera style */}
          <div
            className="relative flex items-center justify-center shrink-0 w-28 lg:w-44"
            style={{
              borderRight: isEven ? "1px solid var(--border-subtle)" : "none",
              borderLeft: isEven ? "none" : "1px solid var(--border-subtle)",
            }}
          >
            <span
              ref={numRef}
              className="select-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(5rem, 10vw, 10rem)",
                fontWeight: 900,
                lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(110,16,35,0.5)",
                transition: "color 0.3s, -webkit-text-stroke-color 0.3s",
              }}
            >
              {mod.numero}
            </span>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className={`flex-1 flex flex-col justify-center py-10 ${isEven ? "pl-8 lg:pl-14" : "pr-8 lg:pr-14"}`}
          >
            {/* Ato label */}
            <span
              className="block text-[0.65rem] tracking-[0.25em] uppercase mb-3"
              style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}
            >
              Ato {mod.numero}
            </span>

            {/* Nome */}
            <h3
              className="font-bold leading-tight mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-bone)",
                fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
              }}
            >
              {mod.nome}
            </h3>

            {/* Faixas */}
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 mb-5">
              {mod.faixas.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                  <span className="inline-block w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: "var(--color-spot)" }} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Descrição */}
            <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--color-ash)" }}>
              {mod.descricao}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

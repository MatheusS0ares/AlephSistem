"use client";

import { useRef, useEffect } from "react";
import { site } from "@/config/site";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

export default function Modalidades() {
  const sectionRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    // Amber light sweep on section entry
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lightRef.current,
        { opacity: 0, scaleY: 0.6 },
        {
          opacity: 1,
          scaleY: 1,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="modalidades"
      className="relative overflow-hidden py-28 lg:py-36"
      style={{
        background:
          "linear-gradient(180deg, var(--color-blackout) 0%, var(--color-vinho-deep) 50%, var(--color-blackout) 100%)",
      }}
    >
      {/* Amber spotlight — subtle, top */}
      <div
        ref={lightRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        aria-hidden="true"
        style={{
          width: "700px",
          height: "320px",
          background:
            "radial-gradient(ellipse 55% 100% at 50% 0%, rgba(231,182,92,0.10) 0%, transparent 80%)",
          opacity: 0,
          transformOrigin: "top center",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="mb-16">
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

        {/* Playbill list */}
        <ol className="divide-y" style={{ borderColor: "rgba(244,239,231,0.08)" }}>
          {site.modalidades.map((mod, idx) => (
            <PlaybillItem key={mod.numero} mod={mod} index={idx} />
          ))}
        </ol>

        {/* Footer note */}
        <div
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-8 border-t"
          style={{ borderColor: "rgba(244,239,231,0.08)" }}
        >
          <p className="text-sm flex-1" style={{ color: "var(--color-ash)" }}>
            Turmas para todas as idades — do Baby Ballet ao adulto avançado.
            Fale conosco para saber disponibilidade e realizar sua aula experimental.
          </p>
          <a
            href={site.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-semibold transition-colors duration-200 hover:brightness-110"
            style={{
              backgroundColor: "var(--color-spot)",
              color: "var(--color-blackout)",
            }}
          >
            Consultar turmas
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Individual "ato" ──────────────────────────────────────────────────────────

type Mod = (typeof site.modalidades)[number];

function PlaybillItem({ mod, index }: { mod: Mod; index: number }) {
  const itemRef = useRef<HTMLLIElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Scroll reveal — stagger by index
      gsap.fromTo(
        itemRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }, itemRef);

    // Hover glow
    const el = itemRef.current;
    if (!el || !glowRef.current) return;

    const showGlow = () =>
      gsap.to(glowRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
    const hideGlow = () =>
      gsap.to(glowRef.current, { opacity: 0, duration: 0.4, ease: "power2.in" });

    el.addEventListener("mouseenter", showGlow);
    el.addEventListener("mouseleave", hideGlow);
    el.addEventListener("focusin", showGlow);
    el.addEventListener("focusout", hideGlow);

    return () => {
      ctx.revert();
      el.removeEventListener("mouseenter", showGlow);
      el.removeEventListener("mouseleave", hideGlow);
      el.removeEventListener("focusin", showGlow);
      el.removeEventListener("focusout", hideGlow);
      ScrollTrigger.refresh();
    };
  }, [index]);

  return (
    <li
      ref={itemRef}
      className="relative group py-8 lg:py-10"
      style={{ opacity: 0 }}
    >
      {/* Refletor glow — top edge */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(231,182,92,0.6) 50%, transparent 100%)",
          opacity: 0,
          boxShadow: "0 0 12px 2px rgba(231,182,92,0.25)",
        }}
      />

      <div className="flex gap-6 lg:gap-10 items-start">
        {/* Ato number */}
        <div className="shrink-0 w-12 lg:w-16 pt-1">
          <span
            className="block text-xs tracking-[0.15em] uppercase mb-1"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}
          >
            Ato
          </span>
          <span
            className="block text-2xl lg:text-3xl font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-vinho)",
            }}
          >
            {mod.numero}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold mb-3 leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-bone)",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            }}
          >
            {mod.nome}
          </h3>

          {/* Faixas etárias */}
          <ul className="flex flex-wrap gap-x-6 gap-y-1 mb-4">
            {mod.faixas.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}
              >
                <span
                  className="inline-block w-1 h-1 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--color-spot)" }}
                  aria-hidden="true"
                />
                {f}
              </li>
            ))}
          </ul>

          <p className="text-sm leading-relaxed max-w-xl" style={{ color: "var(--color-ash)" }}>
            {mod.descricao}
          </p>
        </div>

        {/* CTA — aparece no hover */}
        <div className="hidden lg:flex shrink-0 pt-1">
          <a
            href={site.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 text-xs tracking-widest uppercase px-4 py-2 border"
            style={{
              borderColor: "rgba(231,182,92,0.4)",
              color: "var(--color-spot)",
            }}
            tabIndex={0}
          >
            Inscrever
          </a>
        </div>
      </div>
    </li>
  );
}

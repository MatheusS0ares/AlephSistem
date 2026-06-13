"use client";

import { useRef, useEffect } from "react";
import { site } from "@/config/site";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

export default function Sobre() {
  const sectionRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lightRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
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
      id="sobre"
      className="relative py-28 lg:py-36 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-blackout) 0%, rgba(61,10,22,0.25) 50%, var(--color-blackout) 100%)",
      }}
    >
      {/* Ambient light */}
      <div
        ref={lightRef}
        className="absolute right-0 top-1/4 pointer-events-none"
        aria-hidden="true"
        style={{
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(ellipse at 80% 50%, rgba(110,16,35,0.18) 0%, transparent 70%)",
          opacity: 0,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — text */}
          <div>
            <ScrollReveal>
              <p className="eyebrow mb-3">Nossa história</p>
              <h2
                className="font-semibold leading-tight mb-8"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-bone)",
                  fontSize: "clamp(1.75rem, 4vw, 3rem)",
                }}
              >
                {site.sobre.titulo}
              </h2>
              <p
                className="text-base leading-relaxed mb-5"
                style={{ color: "var(--color-ash)" }}
              >
                {site.sobre.paragrafo1}
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--color-ash)" }}
              >
                {site.sobre.paragrafo2}
              </p>
            </ScrollReveal>
          </div>

          {/* Right — filosofia + equipe */}
          <div className="flex flex-col gap-10">
            {/* Filosofia */}
            <ScrollReveal delay={0.15}>
              <div>
                <h3
                  className="text-sm tracking-[0.15em] uppercase mb-5"
                  style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}
                >
                  Nossa filosofia
                </h3>
                <ul className="flex flex-col gap-4">
                  {site.sobre.filosofia.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span
                        className="shrink-0 mt-1.5 block w-4 h-px"
                        style={{ backgroundColor: "var(--color-spot)" }}
                        aria-hidden="true"
                      />
                      <p className="text-sm leading-relaxed" style={{ color: "var(--color-ash)" }}>
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {/* Equipe */}
            <ScrollReveal delay={0.25}>
              <div>
                <h3
                  className="text-sm tracking-[0.15em] uppercase mb-5"
                  style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}
                >
                  Corpo docente
                </h3>
                <ul className="flex flex-col divide-y" style={{ borderColor: "rgba(244,239,231,0.06)" }}>
                  {site.sobre.equipe.map((membro) => (
                    <li
                      key={membro.nome}
                      className="flex items-baseline justify-between gap-4 py-3"
                    >
                      <span
                        className="font-medium"
                        style={{ color: "var(--color-bone)", fontFamily: "var(--font-display)" }}
                      >
                        {membro.nome}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}
                      >
                        {membro.papel}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {/* Destaque */}
            <blockquote
              className="border-l-2 pl-5 italic"
              style={{ borderColor: "var(--color-vinho)" }}
            >
              <p style={{ color: "var(--color-ash)", fontFamily: "var(--font-display)" }}>
                "Fique perto de pessoas que dançam."
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

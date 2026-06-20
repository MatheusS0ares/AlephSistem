"use client";

import { useRef, useEffect, useState } from "react";
import { site } from "@/config/site";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

export default function Depoimentos() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  // Auto-advance every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((v) => (v + 1) % site.depoimentos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const dep = site.depoimentos[active];

  return (
    <section ref={sectionRef} id="depoimentos" className="py-28 lg:py-36 relative overflow-hidden"
      style={{ backgroundColor: "var(--color-blackout)" }}>

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(110,16,35,0.1) 0%, transparent 70%)" }} />

      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <p className="eyebrow mb-3 text-center">Depoimentos</p>
        <h2 className="font-semibold leading-tight text-center mb-16"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)", fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
          O que dizem sobre a SDE
        </h2>

        {/* Quote display */}
        <div className="relative text-center min-h-[220px] flex flex-col items-center justify-center">
          {/* Large quotation mark */}
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-8xl leading-none select-none pointer-events-none"
            style={{ color: "rgba(110,16,35,0.25)", fontFamily: "var(--font-display)" }} aria-hidden="true">"</span>

          <blockquote key={active} className="relative z-10 transition-all duration-500">
            <p className="text-xl md:text-2xl italic leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
              {dep.texto}
            </p>
            <footer className="flex flex-col items-center gap-1">
              <div className="w-6 h-px mb-3" style={{ backgroundColor: "var(--color-spot)" }} aria-hidden="true" />
              <cite className="not-italic font-semibold text-sm" style={{ color: "var(--color-bone)", fontFamily: "var(--font-display)" }}>
                {dep.nome}
              </cite>
              <span className="text-xs tracking-[0.15em] uppercase" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                {dep.papel}
              </span>
            </footer>
          </blockquote>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {site.depoimentos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="transition-all duration-300"
              style={{
                width: i === active ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: i === active ? "var(--color-spot)" : "rgba(140,128,137,0.4)",
              }}
              aria-label={`Depoimento ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="text-sm mb-4" style={{ color: "var(--color-ash)" }}>
            Quer fazer parte dessa história?
          </p>
          <a href="#matricula"
            className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
            Agende sua aula experimental
          </a>
        </div>
      </div>
    </section>
  );
}

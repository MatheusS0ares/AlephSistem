"use client";

import { useRef, useEffect } from "react";
import { site } from "@/config/site";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  "em-cartaz": { label: "Em cartaz", color: "var(--color-spot)" },
  "inscricoes-abertas": { label: "Inscrições abertas", color: "#7cfc8a" },
  "em-breve": { label: "Em breve", color: "var(--color-ash)" },
  historico: { label: "Histórico", color: "rgba(140,128,137,0.6)" },
};

export default function Espetaculos() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
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
      id="espetaculos"
      className="py-28 lg:py-36 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-blackout) 0%, var(--color-vinho-deep) 60%, var(--color-blackout) 100%)",
      }}
    >
      {/* Top amber line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(231,182,92,0.3) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14">
          <p className="eyebrow mb-3">Temporada</p>
          <h2
            className="font-semibold leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-bone)",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
            }}
          >
            Espetáculos & Mostras
          </h2>
        </div>

        {/* Cards grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {site.espetaculos.map((esp, idx) => {
            const statusInfo = STATUS_LABELS[esp.status] ?? STATUS_LABELS["em-breve"];
            const isHistorico = esp.status === "historico";

            return (
              <li
                key={esp.titulo}
                ref={(el) => {
                  if (el) cardsRef.current[idx] = el;
                }}
                className="relative flex flex-col overflow-hidden"
                style={{
                  opacity: 0,
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: isHistorico
                    ? "var(--bg-dark-card)"
                    : "var(--bg-vinho-card)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {/* Top color bar */}
                <div
                  className="h-1 w-full"
                  aria-hidden="true"
                  style={{
                    background: isHistorico
                      ? "rgba(140,128,137,0.3)"
                      : `linear-gradient(90deg, var(--color-vinho), var(--color-spot))`,
                  }}
                />

                <div className="p-6 flex flex-col flex-1 gap-4">
                  {/* Tipo + status */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span
                      className="text-xs tracking-[0.15em] uppercase"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}
                    >
                      {esp.tipo}
                    </span>
                    <span
                      className="text-xs tracking-[0.12em] uppercase px-2 py-0.5 border"
                      style={{
                        color: statusInfo.color,
                        borderColor: statusInfo.color,
                        fontFamily: "var(--font-mono)",
                        opacity: 0.85,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Título */}
                  <div>
                    <h3
                      className="font-bold leading-tight mb-1"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: isHistorico ? "var(--color-ash)" : "var(--color-bone)",
                        fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                      }}
                    >
                      {esp.titulo}
                    </h3>
                    {esp.subtitulo && (
                      <p
                        className="text-sm italic"
                        style={{ color: "var(--color-ash)" }}
                      >
                        {esp.subtitulo}
                      </p>
                    )}
                  </div>

                  {/* Data / Local */}
                  <dl className="flex flex-col gap-1 mt-auto">
                    {esp.data && (
                      <div className="flex gap-3 items-baseline">
                        <dt
                          className="text-xs tracking-widest uppercase shrink-0"
                          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}
                        >
                          Data
                        </dt>
                        <dd
                          className="text-sm"
                          style={{ color: "var(--color-bone)", fontFamily: "var(--font-mono)" }}
                        >
                          {esp.data}
                        </dd>
                      </div>
                    )}
                    {esp.local && (
                      <div className="flex gap-3 items-baseline">
                        <dt
                          className="text-xs tracking-widest uppercase shrink-0"
                          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}
                        >
                          Local
                        </dt>
                        <dd className="text-sm" style={{ color: "var(--color-bone)" }}>
                          {esp.local}
                        </dd>
                      </div>
                    )}
                    {esp.sessoes.length > 0 && (
                      <div className="flex gap-3 items-baseline">
                        <dt
                          className="text-xs tracking-widest uppercase shrink-0"
                          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}
                        >
                          Sessões
                        </dt>
                        <dd className="text-sm" style={{ color: "var(--color-bone)" }}>
                          {esp.sessoes.join(" · ")}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {/* CTA (não para histórico) */}
                  {!isHistorico && (
                    <a
                      href={site.contact.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 self-start text-xs tracking-widest uppercase px-4 py-2 border transition-colors duration-200 hover:bg-spot/10"
                      style={{
                        borderColor: "rgba(231,182,92,0.4)",
                        color: "var(--color-spot)",
                      }}
                    >
                      Saber mais
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-xs" style={{ color: "var(--color-ash)" }}>
          * Datas e edições sujeitas a confirmação pelo cliente.{" "}
          <span style={{ color: "rgba(140,128,137,0.6)" }}>// TODO-CLIENTE</span>
        </p>
      </div>
    </section>
  );
}

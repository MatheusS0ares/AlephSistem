"use client";

import { useRef, useEffect } from "react";
import { site } from "@/config/site";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

export default function GradeHoraria() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLTableRowElement[]>([]);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowsRef.current,
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
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

  type GradeItem = { hora: string; turma: string; diasSemana: string };
  // Group rows by diasSemana
  const grupos = (site.grade as readonly GradeItem[]).reduce<Record<string, GradeItem[]>>(
    (acc, item) => {
      const key = item.diasSemana;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {}
  );

  let rowIndex = 0;

  return (
    <section
      ref={sectionRef}
      id="grade"
      className="py-28 lg:py-36"
      style={{ backgroundColor: "var(--color-blackout)" }}
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12">
          <p className="eyebrow mb-3">Programação</p>
          <h2
            className="font-semibold leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-bone)",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
            }}
          >
            Grade Horária
          </h2>
        </div>

        {/* Tables por grupo de dia */}
        <div className="flex flex-col gap-12">
          {Object.entries(grupos).map(([dias, turmas]) => (
            <div key={dias}>
              {/* Dia label */}
              <div
                className="flex items-center gap-4 mb-4"
              >
                <span
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}
                >
                  {dias}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "rgba(231,182,92,0.2)" }}
                  aria-hidden="true"
                />
              </div>

              <div className="overflow-x-auto -mx-6 px-6">
                <table
                  className="w-full border-collapse"
                  aria-label={`Horários de ${dias}`}
                >
                  <thead>
                    <tr>
                      <th
                        className="text-left pb-3 text-xs tracking-[0.15em] uppercase w-24"
                        style={{
                          color: "var(--color-ash)",
                          fontFamily: "var(--font-mono)",
                          borderBottom: "1px solid rgba(244,239,231,0.08)",
                        }}
                      >
                        Horário
                      </th>
                      <th
                        className="text-left pb-3 text-xs tracking-[0.15em] uppercase pl-8"
                        style={{
                          color: "var(--color-ash)",
                          fontFamily: "var(--font-mono)",
                          borderBottom: "1px solid rgba(244,239,231,0.08)",
                        }}
                      >
                        Turma
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {turmas.map((item) => {
                      const ri = rowIndex++;
                      return (
                        <tr
                          key={`${item.hora}-${item.turma}`}
                          ref={(el) => {
                            if (el) rowsRef.current[ri] = el;
                          }}
                          className="group"
                          style={{ opacity: 0 }}
                        >
                          <td
                            className="py-4 align-top"
                            style={{
                              borderBottom: "1px solid rgba(244,239,231,0.05)",
                            }}
                          >
                            <span
                              className="text-base tabular-nums"
                              style={{
                                color: "var(--color-spot)",
                                fontFamily: "var(--font-mono)",
                              }}
                            >
                              {item.hora}
                            </span>
                          </td>
                          <td
                            className="py-4 pl-8 align-top"
                            style={{
                              borderBottom: "1px solid rgba(244,239,231,0.05)",
                              color: "var(--color-bone)",
                            }}
                          >
                            {item.turma}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-8 border-t"
          style={{ borderColor: "rgba(244,239,231,0.08)" }}
        >
          <p className="text-sm flex-1" style={{ color: "var(--color-ash)" }}>
            Grade sujeita a ajustes — confirme disponibilidade de vagas via WhatsApp.
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
            Ver vagas disponíveis
          </a>
        </div>
      </div>
    </section>
  );
}

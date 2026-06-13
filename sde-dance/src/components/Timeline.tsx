"use client";

import { useRef, useEffect } from "react";
import { site } from "@/config/site";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Vertical line draws down
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.4,
          ease: "power2.inOut",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // Items stagger in
      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, x: 24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
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

  const lastItem = site.timeline[site.timeline.length - 1];

  return (
    <section
      ref={sectionRef}
      id="historia"
      className="py-28 lg:py-36"
      style={{ backgroundColor: "var(--color-blackout)" }}
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14">
          <p className="eyebrow mb-3">Repertório</p>
          <h2
            className="font-semibold leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-bone)",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
            }}
          >
            10 Anos em Cena
          </h2>
          <p
            className="mt-4 max-w-xl text-base leading-relaxed"
            style={{ color: "var(--color-ash)" }}
          >
            10 anos de histórias — todas elas embaladas pela dança que conduz o dia a dia da SALA.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative flex">
          {/* Vertical line */}
          <div className="relative flex flex-col items-center mr-8 lg:mr-12">
            <div
              ref={lineRef}
              className="absolute top-2 bottom-2 w-px"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(to bottom, var(--color-spot) 0%, var(--color-vinho) 60%, transparent 100%)",
                transformOrigin: "top center",
              }}
            />
          </div>

          {/* Items */}
          <ol className="flex-1 flex flex-col gap-0">
            {site.timeline.map((item, idx) => {
              const isLast = idx === site.timeline.length - 1;
              return (
                <li
                  key={item.ano}
                  ref={(el) => {
                    if (el) itemsRef.current[idx] = el;
                  }}
                  className="relative flex items-start gap-6 pb-10"
                  style={{ opacity: 0 }}
                >
                  {/* Dot */}
                  <div
                    className="absolute -left-[2.55rem] lg:-left-[3.05rem] top-1.5 w-3 h-3 rounded-full border-2 shrink-0"
                    aria-hidden="true"
                    style={{
                      backgroundColor: isLast ? "var(--color-spot)" : "var(--color-vinho)",
                      borderColor: isLast ? "var(--color-spot)" : "var(--color-bone)",
                      boxShadow: isLast ? "0 0 8px rgba(231,182,92,0.6)" : "none",
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    {/* Ano */}
                    <span
                      className="block text-sm tabular-nums mb-1"
                      style={{
                        color: isLast ? "var(--color-spot)" : "var(--color-ash)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {item.ano}
                    </span>
                    {/* Marco */}
                    <p
                      className="text-base leading-snug"
                      style={{
                        color: isLast ? "var(--color-bone)" : "var(--color-ash)",
                        fontFamily: isLast ? "var(--font-display)" : undefined,
                        fontWeight: isLast ? 600 : 400,
                        fontSize: isLast ? "clamp(1.1rem, 2vw, 1.3rem)" : undefined,
                      }}
                    >
                      {item.marco}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Closing quote */}
        <blockquote
          className="mt-6 pl-8 border-l-2 italic"
          style={{
            borderColor: "var(--color-spot)",
            color: "var(--color-ash)",
          }}
        >
          <p className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
            "A dança supera todos os desafios."
          </p>
        </blockquote>
      </div>
    </section>
  );
}

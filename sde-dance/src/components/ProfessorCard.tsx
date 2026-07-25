"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import type { ProfData } from "@/lib/supabase/types";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

export default function ProfessorCard({ prof, index }: { prof: ProfData; index: number }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef  = useRef<HTMLDivElement>(null);
  const glowRef  = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  const isEven = index % 2 === 0;

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(photoRef.current,
        { opacity: 0, x: isEven ? -40 : 40 },
        { opacity: 1, x: 0, duration: 1.0, ease: "power3.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 75%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(textRef.current,
        { opacity: 0, x: isEven ? 40 : -40 },
        { opacity: 1, x: 0, duration: 1.0, delay: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 75%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(quoteRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: "power2.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 70%", toggleActions: "play none none none" } }
      );

      const card = cardRef.current;
      const glow = glowRef.current;
      if (!card || !glow) return;
      const showG = () => gsap.to(glow, { opacity: 1, scale: 1.05, duration: 0.4, ease: "power2.out" });
      const hideG = () => gsap.to(glow, { opacity: 0, scale: 1, duration: 0.5 });
      card.addEventListener("mouseenter", showG);
      card.addEventListener("mouseleave", hideG);
      return () => {
        card.removeEventListener("mouseenter", showG);
        card.removeEventListener("mouseleave", hideG);
      };
    }, cardRef);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, [index, isEven]);

  const initials = prof.nome.split(" ").map(w => w[0]).join("").slice(0, 2);

  return (
    <div ref={cardRef} className="relative border-b" style={{ borderColor: "rgba(244,239,231,0.06)" }}>
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true"
        style={{ background: isEven
          ? "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(110,16,35,0.12) 0%, transparent 70%)"
          : "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(110,16,35,0.12) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
          !isEven ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""
        }`}>

          {/* Photo */}
          <div ref={photoRef} className="flex justify-center lg:justify-start" style={{ opacity: 0 }}>
            <div className="relative">
              <div ref={glowRef} className="absolute -inset-4 rounded-full pointer-events-none" aria-hidden="true"
                style={{ opacity: 0, background: "radial-gradient(ellipse at center, rgba(231,182,92,0.15) 0%, transparent 70%)", filter: "blur(16px)" }} />
              <div className="relative" style={{ width: "clamp(260px, 36vw, 420px)", aspectRatio: "3/4" }}>
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l z-10" style={{ borderColor: "var(--color-spot)" }} aria-hidden="true" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r z-10" style={{ borderColor: "var(--color-spot)" }} aria-hidden="true" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l z-10" style={{ borderColor: "var(--color-spot)" }} aria-hidden="true" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r z-10" style={{ borderColor: "var(--color-spot)" }} aria-hidden="true" />
                {prof.foto_url ? (
                  <Image src={prof.foto_url} alt={`${prof.nome} — ${prof.papel}`} fill
                    className="object-cover object-top" sizes="(max-width: 1024px) 80vw, 36vw" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4"
                    style={{ background: "linear-gradient(160deg, var(--color-vinho-deep) 0%, var(--color-blackout) 100%)", border: "1px solid rgba(110,16,35,0.3)" }}>
                    <span className="select-none" aria-hidden="true"
                      style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 10vw, 7rem)", fontWeight: 900,
                        fontStyle: "italic", color: "transparent", WebkitTextStroke: "1px var(--color-spot)", lineHeight: 1 }}>
                      {initials}
                    </span>
                    <span className="text-[0.6rem] tracking-[0.3em] uppercase"
                      style={{ color: "rgba(140,128,137,0.5)", fontFamily: "var(--font-mono)" }}>foto em breve</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 whitespace-nowrap"
                style={{ backgroundColor: "var(--color-blackout)", border: "1px solid rgba(231,182,92,0.3)" }}>
                <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
                  {prof.papel}
                </span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div ref={textRef} className="flex flex-col gap-6 pt-6 lg:pt-0" style={{ opacity: 0 }}>
            <div>
              <h3 className="font-bold leading-none mb-2"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--color-bone)" }}>
                {prof.nome}
              </h3>
              {prof.modalidades.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {prof.modalidades.map((m) => (
                    <span key={m} className="text-xs px-3 py-1 border"
                      style={{ color: "var(--color-ash)", borderColor: "rgba(140,128,137,0.2)", fontFamily: "var(--font-mono)" }}>
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="w-12 h-px" style={{ backgroundColor: "var(--color-spot)" }} aria-hidden="true" />
            {prof.bio && (
              <p className="text-base leading-relaxed" style={{ color: "var(--color-ash)" }}>{prof.bio}</p>
            )}
            {prof.citacao && (
              <blockquote ref={quoteRef} className="relative pl-5 border-l-2 mt-2"
                style={{ borderColor: "var(--color-vinho)", opacity: 0 }}>
                <span className="absolute -top-4 -left-1 text-5xl leading-none select-none"
                  style={{ color: "var(--quote-mark-color)", fontFamily: "var(--font-display)" }} aria-hidden="true">&ldquo;</span>
                <p className="italic text-lg leading-snug"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>{prof.citacao}</p>
              </blockquote>
            )}
            {prof.instagram && (
              <a href={`https://instagram.com/${prof.instagram.replace("@", "")}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm transition-colors duration-200 self-start mt-2"
                style={{ color: "var(--color-spot)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                @{prof.instagram.replace("@", "")}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

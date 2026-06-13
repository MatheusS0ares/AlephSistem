"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { site } from "@/config/site";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

export default function Galeria() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion() || !gridRef.current) return;

    const items = Array.from(gridRef.current.children);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
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

  const hasImages = site.galeria.length > 0;

  return (
    <section
      ref={sectionRef}
      id="galeria"
      className="py-28 lg:py-36"
      style={{ backgroundColor: "var(--color-blackout)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12">
          <p className="eyebrow mb-3">Bastidores</p>
          <h2
            className="font-semibold leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-bone)",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
            }}
          >
            Galeria
          </h2>
        </div>

        {hasImages ? (
          <ul
            ref={gridRef}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            aria-label="Galeria de fotos SDE Dance"
          >
            {site.galeria.map((foto, i) => (
              <li
                key={foto.src}
                className="relative aspect-square overflow-hidden"
                style={{
                  opacity: 0,
                  backgroundColor: "rgba(61,10,22,0.3)",
                }}
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  loading={i < 4 ? "eager" : "lazy"}
                />
              </li>
            ))}
          </ul>
        ) : (
          /* Placeholder quando galeria está vazia */
          <div
            className="flex flex-col items-center justify-center py-20 border"
            style={{
              borderColor: "rgba(244,239,231,0.07)",
              borderStyle: "dashed",
            }}
          >
            <div
              className="w-12 h-12 mb-4 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(110,16,35,0.3)" }}
              aria-hidden="true"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: "var(--color-ash)" }}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>
            <p
              className="text-sm mb-1"
              style={{ color: "var(--color-ash)" }}
            >
              Galeria em preparação
            </p>
            <p
              className="text-xs"
              style={{ color: "rgba(140,128,137,0.5)", fontFamily: "var(--font-mono)" }}
            >
              {/* TODO-CLIENTE: adicionar fotos de espetáculos em site.ts → galeria[] */}
              // TODO-CLIENTE: fotos de espetáculos com autorização de imagem
            </p>
          </div>
        )}

        {/* Instagram CTA */}
        <div className="mt-10 text-center">
          <a
            href={site.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm transition-colors duration-200"
            style={{ color: "var(--color-spot)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            Mais fotos em {site.brand.handle}
          </a>
        </div>
      </div>
    </section>
  );
}

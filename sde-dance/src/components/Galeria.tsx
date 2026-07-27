"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { site } from "@/config/site";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

type FotoItem = { src: string; alt: string };

export default function Galeria({ images }: { images?: FotoItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

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

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const fotos = images ?? site.galeria;
  const hasImages = fotos.length > 0;

  return (
    <section
      ref={sectionRef}
      id="galeria"
      className="py-28 lg:py-36"
      style={{ backgroundColor: "var(--color-blackout)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
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
            {fotos.map((foto, i) => (
              <li
                key={foto.src}
                className="relative aspect-square overflow-hidden cursor-pointer group"
                style={{ opacity: 0, backgroundColor: "rgba(61,10,22,0.3)" }}
                onClick={() => setLightbox(foto)}
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={i < 4 ? "eager" : "lazy"}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(11,10,12,0.5)" }}
                  aria-hidden="true"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-bone)" }}>
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-20 border"
            style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}
          >
            <div
              className="w-12 h-12 mb-4 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(110,16,35,0.3)" }}
              aria-hidden="true"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-ash)" }}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>
            <p className="text-sm mb-1" style={{ color: "var(--color-ash)" }}>
              Galeria em preparação
            </p>
            <p className="text-xs" style={{ color: "rgba(140,128,137,0.5)", fontFamily: "var(--font-mono)" }}>
              // TODO-CLIENTE: fotos de espetáculos com autorização de imagem
            </p>
          </div>
        )}

        <div className="mt-10 text-center">
          <a
            href={site.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm transition-colors duration-200"
            style={{ color: "var(--color-spot)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            Mais fotos em {site.brand.handle}
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "var(--bg-lightbox)", backdropFilter: "blur(8px)" }}
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center border transition-colors duration-200 hover:border-spot"
            style={{ borderColor: "var(--border-bold)", color: "var(--color-ash)" }}
            aria-label="Fechar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
          <div
            className="relative max-w-4xl w-full max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
            style={{ aspectRatio: "auto" }}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={1200}
              height={800}
              className="w-full h-full object-contain"
              style={{ maxHeight: "85vh" }}
            />
            {lightbox.alt && (
              <p className="mt-3 text-center text-sm" style={{ color: "var(--color-ash)" }}>
                {lightbox.alt}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

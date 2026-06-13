"use client";

import { useRef, useEffect } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

interface MarqueeProps {
  items?: string[];
  speed?: number; // pixels per second
  className?: string;
}

const DEFAULT_ITEMS = [
  "DANÇA",
  "ARTE",
  "EXPRESSÃO",
  "SDE DANCE",
  "DESDE 2015",
  "GAMA · DF",
  "10 ANOS EM CENA",
  "SALA DE ENSAIO",
];

export default function Marquee({
  items = DEFAULT_ITEMS,
  speed = 60,
  className = "",
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = trackRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const totalWidth = el.scrollWidth / 2; // half because we duplicate
    const duration = totalWidth / speed;

    const tween = gsap.to(el, {
      x: `-=${totalWidth}`,
      duration,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    });

    return () => { tween.kill(); };
  }, [speed]);

  const all = [...items, ...items]; // duplicate for seamless loop

  return (
    <div
      className={`overflow-hidden py-4 border-y ${className}`}
      style={{ borderColor: "rgba(110,16,35,0.4)" }}
      aria-hidden="true"
    >
      <div ref={trackRef} className="flex gap-0 whitespace-nowrap will-change-transform">
        {all.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-8 px-8 text-xs tracking-[0.3em] uppercase select-none"
            style={{
              color: i % 2 === 0 ? "var(--color-ash)" : "var(--color-spot)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {item}
            <span
              className="inline-block w-1 h-1 rounded-full opacity-50"
              style={{ backgroundColor: "var(--color-spot)" }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

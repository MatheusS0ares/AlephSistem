"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.transform = `scaleX(${pct / 100})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9000] pointer-events-none h-[2px]" aria-hidden="true">
      <div ref={barRef} className="h-full w-full origin-left" style={{ background: "linear-gradient(90deg, var(--color-vinho) 0%, var(--color-spot) 100%)", transform: "scaleX(0)" }} />
    </div>
  );
}

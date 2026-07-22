"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  atraso = 0,
  className = "",
}: {
  children: React.ReactNode;
  atraso?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvo = ref.current;
    if (!alvo) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`revelar ${visivel ? "revelado" : ""} ${className}`}
      style={{ transitionDelay: visivel ? `${atraso}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

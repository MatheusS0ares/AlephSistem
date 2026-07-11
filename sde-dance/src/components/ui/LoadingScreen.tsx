"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("sde_loaded") || prefersReducedMotion()) {
      sessionStorage.setItem("sde_loaded", "1");
      setVisible(false);
      return;
    }

    const overlay = overlayRef.current;
    const logo = logoRef.current;
    const bar = barRef.current;
    if (!overlay || !logo || !bar) return;

    document.body.classList.add("loading");

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("sde_loaded", "1");
        document.body.classList.remove("loading");
        setVisible(false);
      },
    });

    tl.fromTo(logo, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: "power2.inOut", transformOrigin: "left" }, "-=0.2")
      .to(logo, { opacity: 0, y: -15, duration: 0.4, ease: "power2.in" }, "+=0.15")
      .to(overlay, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.2");

    return () => {
      document.body.classList.remove("loading");
      tl.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[99999] flex flex-col items-center justify-center" style={{ backgroundColor: "var(--color-blackout)" }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "var(--color-vinho)" }} />
      <div ref={logoRef} className="flex flex-col items-center" style={{ opacity: 0 }}>
        <span className="text-6xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)", letterSpacing: "0.2em" }}>SDE</span>
        <span className="text-[0.65rem] tracking-[0.45em] uppercase mt-1" style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>DANCE</span>
      </div>
      <div className="absolute bottom-12 w-32 h-px overflow-hidden" style={{ backgroundColor: "rgba(244,239,231,0.1)" }}>
        <div ref={barRef} className="h-full w-full" style={{ backgroundColor: "var(--color-spot)", transform: "scaleX(0)", transformOrigin: "left" }} />
      </div>
    </div>
  );
}

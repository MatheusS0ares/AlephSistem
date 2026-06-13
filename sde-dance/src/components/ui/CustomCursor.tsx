"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;
    if (typeof window === "undefined") return;
    // Only on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.style.cursor = "none";

    let mouseX = 0;
    let mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: "none" });
      gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.25, ease: "power2.out" });
    };

    const onEnterLink = () => {
      gsap.to(ring, { scale: 1.8, opacity: 0.5, duration: 0.25 });
      gsap.to(dot, { scale: 0.5, duration: 0.2 });
    };
    const onLeaveLink = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.25 });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    document.addEventListener("mousemove", onMove);

    const links = document.querySelectorAll("a, button");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: "var(--color-spot)",
          transform: "translate(-50%, -50%)",
          mixBlendMode: "difference",
        }}
        aria-hidden="true"
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border"
        style={{
          width: "36px",
          height: "36px",
          borderColor: "rgba(231,182,92,0.5)",
          transform: "translate(-50%, -50%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}

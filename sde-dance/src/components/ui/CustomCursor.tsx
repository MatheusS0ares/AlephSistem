"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/gsap";

const MAGNET_RADIUS = 80;
const MAGNET_STRENGTH = 0.35;

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.body.style.cursor = "none";
    let hovered: HTMLElement | null = null;

    const onMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      let ringX = mouseX;
      let ringY = mouseY;
      if (hovered) {
        const rect = hovered.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(cx - mouseX, cy - mouseY);
        if (dist < MAGNET_RADIUS) {
          ringX = mouseX + (cx - mouseX) * MAGNET_STRENGTH;
          ringY = mouseY + (cy - mouseY) * MAGNET_STRENGTH;
        }
      }
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: "none" });
      gsap.to(ring, { x: ringX, y: ringY, duration: 0.22, ease: "power2.out" });
    };

    const onEnterLink = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      hovered = el;
      const cursorLabel = el.dataset.cursor;
      if (cursorLabel) {
        label.textContent = cursorLabel;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.2 });
      }
      gsap.to(ring, { scale: 1.9, borderColor: "rgba(110,16,35,0.6)", backgroundColor: "rgba(110,16,35,0.2)", duration: 0.25 });
      gsap.to(dot, { scale: 0.4, duration: 0.2 });
    };

    const onLeaveLink = () => {
      hovered = null;
      gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.15 });
      label.textContent = "";
      gsap.to(ring, { scale: 1, borderColor: "rgba(231,182,92,0.5)", backgroundColor: "transparent", duration: 0.3 });
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
      <div ref={dotRef} className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full" style={{ width: "8px", height: "8px", backgroundColor: "var(--color-spot)", transform: "translate(-50%, -50%)", mixBlendMode: "difference" }} aria-hidden="true" />
      <div ref={ringRef} className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border flex items-center justify-center" style={{ width: "42px", height: "42px", borderColor: "rgba(231,182,92,0.5)", transform: "translate(-50%, -50%)" }} aria-hidden="true">
        <span ref={labelRef} className="text-[0.45rem] tracking-[0.2em] uppercase font-medium" style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)", opacity: 0, transform: "scale(0.8)" }} />
      </div>
    </>
  );
}

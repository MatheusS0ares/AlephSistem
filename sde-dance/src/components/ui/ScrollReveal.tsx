"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay before the reveal starts (seconds). */
  delay?: number;
  /** Stagger children elements (seconds). */
  stagger?: number;
  /** Y offset to animate from (px). */
  y?: number;
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  stagger = 0.12,
  y = 32,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el.children, { opacity: 1 });
      return;
    }

    const targets = el.children.length > 1 ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [delay, stagger, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

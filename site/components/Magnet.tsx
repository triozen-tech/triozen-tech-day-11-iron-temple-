"use client";

// Magnetic pull for the main CTAs: the button leans toward a pointer within reach and its label leans a little
// further (text parallax). Heavy, never springy: expo.out. Listens to the real pointer and to the record-mode fake
// pointer ("iron:pointer"), so the pull also shows on camera.
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function Magnet({ children, strength = 0.28, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current!;
    const label = el.querySelector<HTMLElement>("[data-magnet-label]");
    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "expo.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "expo.out" });
    const lx = label ? gsap.quickTo(label, "x", { duration: 0.6, ease: "expo.out" }) : null;
    const ly = label ? gsap.quickTo(label, "y", { duration: 0.6, ease: "expo.out" }) : null;
    const at = (x: number, y: number, on = true) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - (Number(gsap.getProperty(el, "x")) || 0);
      const cy = r.top + r.height / 2 - (Number(gsap.getProperty(el, "y")) || 0);
      const dx = x - cx;
      const dy = y - cy;
      const reach = Math.max(r.width, r.height) * 0.95;
      const inside = on && Math.hypot(dx, dy) < reach;
      xTo(inside ? dx * strength : 0);
      yTo(inside ? dy * strength : 0);
      lx?.(inside ? dx * strength * 0.5 : 0);
      ly?.(inside ? dy * strength * 0.5 : 0);
    };
    const real = (e: PointerEvent) => at(e.clientX, e.clientY);
    const fake = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number; on: boolean }>).detail;
      at(d.x, d.y, d.on);
    };
    window.addEventListener("pointermove", real, { passive: true });
    window.addEventListener("iron:pointer", fake);
    return () => {
      window.removeEventListener("pointermove", real);
      window.removeEventListener("iron:pointer", fake);
    };
  }, [strength]);

  return (
    <span ref={ref} data-magnetic className={`inline-block ${className}`}>
      {children}
    </span>
  );
}

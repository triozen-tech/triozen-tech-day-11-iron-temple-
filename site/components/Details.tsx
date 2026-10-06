"use client";

// Small page-wide details: the C12 bezel glint (CSS loop) runs faster while the page scrolls and eases back.
import { useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function Details() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let lastY = window.scrollY;
    let rate = 1;
    let glints: Animation[] = [];
    let found = 0;
    const tick = (_t: number, dtMs: number) => {
      const y = window.scrollY;
      const speed = Math.abs(y - lastY) / Math.max(1, dtMs / 1000); // px/s
      lastY = y;
      const want = 1 + Math.min(3, speed / 700);
      rate += (want - rate) * 0.08;
      // (re)collect the glint animations once a second: document.getAnimations() every frame is costly
      if (performance.now() - found > 1000) {
        found = performance.now();
        glints = document.getAnimations().filter((a) => (a as CSSAnimation).animationName === "glint-pass");
      }
      glints.forEach((a) => (a.playbackRate = rate));
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return null;
}

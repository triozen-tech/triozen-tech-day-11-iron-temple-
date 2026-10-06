"use client";

// A whole-word swap (never letter by letter, so no half-words): the old text lifts out (0.1 s), THEN the new one
// clip-wipes in left → right (0.15 s); the two are never on screen together. ?static=1: plain text.
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function SwapText({ text, className = "" }: { text: string; className?: string }) {
  const [shown, setShown] = useState({ now: text, old: "" });
  const now = useRef<HTMLSpanElement>(null);
  const old = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setShown((s) => (s.now === text ? s : { now: text, old: s.now }));
  }, [text]);

  useEffect(() => {
    if (!shown.old || prefersReducedMotion()) return;
    gsap
      .timeline()
      .set(now.current, { clipPath: "inset(0% 100% 0% 0%)" })
      .fromTo(old.current, { opacity: 1, y: 0 }, { opacity: 0, y: -6, duration: 0.1, ease: "power2.in" })
      .to(now.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.15, ease: "power2.out" });
  }, [shown]);

  return (
    <span className={`relative inline-grid ${className}`}>
      <span ref={old} aria-hidden className="col-start-1 row-start-1 opacity-0">
        {shown.old}
      </span>
      <span ref={now} className="col-start-1 row-start-1">
        {shown.now}
      </span>
    </span>
  );
}

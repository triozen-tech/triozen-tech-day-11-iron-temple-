"use client";

// Rolling characters: every changed character rolls inside its own clipped cell (old glyph out, new glyph in),
// staggered left → right. Two feels: "slot" = M283 slot cell roll (springy overshoot, nav REP cell) and
// "slide" = M133 sliding digits (a plain heavy slide, the membership total). Characters are matched from the RIGHT,
// so "₹3,499" → "₹29,999" adds a cell on the left instead of shifting every digit. ?static=1: plain text.
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const glyph = (c: string) => {
  const g = document.createElement("span");
  g.className = "block";
  g.textContent = c === " " ? " " : c;
  return g;
};
const cell = (c: string) => {
  const el = document.createElement("span");
  el.className = "relative inline-block overflow-hidden align-bottom";
  el.style.lineHeight = "inherit";
  el.appendChild(glyph(c));
  return el;
};

export default function RollText({ text, mode = "slot", className = "" }: { text: string; mode?: "slot" | "slide"; className?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const prev = useRef<string | null>(null);

  useEffect(() => {
    const el = root.current!;
    const old = prev.current;
    prev.current = text;
    if (old === null || prefersReducedMotion()) {
      el.replaceChildren(...text.split("").map(cell));
      return;
    }
    if (old === text) return;
    // grow/shrink on the left so the right-hand characters keep their cells
    const cells = Array.from(el.children) as HTMLElement[];
    while (cells.length < text.length) {
      const c = cell(" ");
      el.insertBefore(c, el.firstChild);
      cells.unshift(c);
    }
    while (cells.length > text.length) cells.shift()!.remove();
    const o = old.padStart(text.length, " ").slice(-text.length);
    let k = 0;
    text.split("").forEach((ch, i) => {
      if (o[i] === ch) return;
      const c = cells[i];
      const from = c.lastElementChild as HTMLElement;
      const to = glyph(ch);
      to.style.position = "absolute";
      to.style.left = "0";
      to.style.top = "0";
      c.appendChild(to);
      const delay = k++ * (mode === "slot" ? 0.05 : 0.06);
      const ease = mode === "slot" ? "back.out(1.6)" : "expo.out";
      const dur = mode === "slot" ? 0.5 : 0.7;
      gsap.to(from, { yPercent: -110, duration: dur * 0.7, ease: "power2.in", delay, onComplete: () => from.remove() });
      gsap.fromTo(to, { yPercent: 110 }, { yPercent: 0, duration: dur, ease, delay, onComplete: () => to.style.removeProperty("position") });
    });
  }, [text, mode]);

  return <span ref={root} className={`inline-flex ${className}`} aria-label={text} />;
}

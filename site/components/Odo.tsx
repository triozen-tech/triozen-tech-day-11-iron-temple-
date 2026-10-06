"use client";

// Number bump: an odometer count-in from 0 to the value, continuous (lesson 10), a higher digit only turns while
// the digits below roll 9 → 0, every digit cell sized by its FINAL digit (lesson 73). Non-digits (₹ , °) stay put;
// leading places the count has not reached yet are dimmed. Plays once: when it enters ("enter") or when the chalk
// plate lifts ("plate", the hero spec strip). ?static=1: the final number.
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { onPlateLifting } from "@/site/lib/plate";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const digitAt = (v: number, place: number) => {
  const base = Math.floor(v / place) % 10;
  const turn = place === 1 ? v % 1 : clamp((v % place) - (place - 1));
  return base + turn;
};

export default function Odo({ text, when = "enter", start = "top 88%", delay = 0, duration = 1.4, className = "" }: { text: string; when?: "enter" | "plate"; start?: string; delay?: number; duration?: number; className?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const value = Number(text.replace(/[^0-9]/g, "")) || 0;
  const chars = text.split("");
  // place value of each digit position (rightmost digit = 1)
  let p = 1;
  const places = [...chars].reverse().map((c) => (/[0-9]/.test(c) ? ((p *= 10), p / 10) : 0)).reverse();

  useEffect(() => {
    if (!value) return;
    const el = root.current!;
    const cols = Array.from(el.querySelectorAll<HTMLElement>("[data-place]"));
    const v = { n: 0 };
    const draw = () =>
      cols.forEach((c) => {
        const place = Number(c.dataset.place);
        (c.firstElementChild as HTMLElement).style.transform = `translateY(${((-digitAt(v.n, place) * 100) / 11).toFixed(3)}%)`;
        c.style.opacity = place > 1 && v.n < place ? "0.3" : "1";
      });
    // ?static=1: the final number at once
    if (prefersReducedMotion()) {
      v.n = value;
      draw();
      return;
    }
    draw();
    const play = () => gsap.to(v, { n: value, duration, delay, ease: "power3.out", onUpdate: draw });
    if (when === "plate") return onPlateLifting(play);
    const st = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: play });
    return () => st.kill();
  }, [value, when, start, delay, duration]);

  return (
    <span ref={root} className={`inline-flex items-baseline ${className}`} aria-label={text}>
      {chars.map((c, i) =>
        places[i] ? (
          <span key={i} data-place={places[i]} className="relative inline-block overflow-hidden align-baseline" style={{ height: "1.15em", lineHeight: 1.15 }}>
            <span className="absolute inset-x-0 top-0 flex flex-col text-center">
              {Array.from({ length: 11 }, (_, d) => (
                <span key={d} className="block" style={{ height: "1.15em" }}>
                  {d % 10}
                </span>
              ))}
            </span>
            <span className="invisible block">{c}</span>
          </span>
        ) : (
          // a space inside flex must be a non-breaking space or it collapses ("2,400SQFT", lesson 73)
          <span key={i}>{c === " " ? "\u00a0" : c}</span>
        ),
      )}
    </span>
  );
}

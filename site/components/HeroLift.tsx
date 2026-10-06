"use client";

// Hero · The lift (layout HR01 split hero + strip, restyled: the film is full-bleed, the headline sits on its dark
// left third, the logo strip became a ruled spec strip). Motion M142 (Round 2): HEAVY gains weight + width with the
// bar's height in the film (--heavy 0 → 1). ?static=1 shows the lockout still and HEAVY at full weight.
import { useCallback, useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onPlateLifting } from "@/site/lib/plate";
import LiftPin from "./LiftPin";
import type { Film } from "@/site/lib/film";
import { hero } from "@/site/content";
import Odo from "./Odo";
import Magnet from "./Magnet";

/** Video seconds are of the trimmed clip (raw 3.0–7.0 s): 0–1 bottom (the lifter is set and still: the intro plays it
 *  during the loader wipe, so the scroll gives it only 0.3 s), 1–2 the pull (the biggest share), 2–4 lockout hold. */
export const LIFT: Film = {
  frames: "/frames/iron-temple-lift",
  start: 0,
  segments: [
    { to: 1, secs: 0.3, label: "bottom" },
    { to: 2, secs: 2.8, label: "pull" },
    { to: 4, secs: 1.2, label: "lockout" },
  ],
  poster: 4,
};

/** 0 at the floor, 1 at lockout: the pull (1–2 s) carries the whole change. */
export const heavyAt = (t: number) => Math.min(1, Math.max(0, t - 1));

/** The slow push-in, done in code: a gentle scale that follows the shown video second (intro or scroll), so the
 *  camera keeps creeping in through the lockout hold too. 1 → 1.08 over the whole film. */
const pushAt = (t: number) => 1 + 0.08 * Math.min(1, Math.max(0, t / 4));

export default function HeroLift() {
  const words = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLElement[]>([]);
  const onTime = useCallback((t: number) => {
    words.current?.style.setProperty("--heavy", heavyAt(t).toFixed(4));
    if (!media.current.length) media.current = Array.from(document.querySelectorAll<HTMLElement>("#lift .lift-media"));
    const s = pushAt(t).toFixed(4);
    // origin on the lifter (centre-right, chest height) so the push lands on him, not on the empty left
    media.current.forEach((m) => (m.style.transform = `scale(${s})`));
  }, []);

  // entrance on the clock as the loader wipes off (≤ 3 staggered groups, lesson budget): LIFT rises out of its mask,
  // the line + copy follow, the spec strip cells come up in turn. It fills the film's still "bottom" second.
  const intro = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = intro.current!;
    const lift = el.querySelector("[data-in='lift']");
    const rest = el.querySelectorAll("[data-in='rest']");
    const cells = el.querySelectorAll("[data-in='cell']");
    gsap.set(lift, { yPercent: 105 });
    gsap.set(rest, { y: 34, opacity: 0 });
    gsap.set(cells, { yPercent: 100 });
    return onPlateLifting(() => {
      // starts as the chalk plate wipes off and runs ~1.5 s into the first record second
      const tl = gsap.timeline({ delay: 0.35 });
      tl.fromTo(lift, { yPercent: 105 }, { yPercent: 0, duration: 0.8, ease: "power2.out" }, 0)
        .fromTo(rest, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.14 }, 0.25)
        .fromTo(cells, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "power2.out", stagger: 0.12 }, 0.4);
    });
  }, []);

  return (
    <LiftPin
      id="lift"
      sectionName="The lift"
      film={LIFT}
      arrive={0}
      eager
      blockLoader
      onTime={onTime}
      intro={{ to: 2, secs: 4 }}
      canvasClass="lift-canvas lift-media absolute inset-0 h-full w-full origin-[66%_48%]"
      place={() => ({ fade: { l: 0.04, r: 0.04, t: 0.06, b: 0.1 } })}
      before={
        // the lockout still: poster while the frames load, and the ?static=1 picture
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/images/iron-temple/hero-end.webp" alt="" className="lift-media absolute inset-0 h-full w-full origin-[66%_48%] object-cover" />
      }
    >
      {/* soft dark pool behind the words only (lesson 16) */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[52%] bg-[linear-gradient(90deg,rgba(17,17,16,0.86),rgba(17,17,16,0.55)_55%,transparent)]" />

      <div ref={intro} className="contents">
      <div className="absolute inset-x-0 top-[96px] bottom-[96px] flex flex-col justify-center px-[64px]">
        <p data-in="rest" className="mono-s mb-7 text-muted">Iron Temple · Strength gym · Est. 2019</p>
        <div ref={words} className="hero-words" style={{ ["--heavy" as string]: 1 }}>
          <h1 className="text-[clamp(72px,10vw,150px)]">
            <span className="block overflow-hidden pb-[0.04em]">
              <span data-in="lift" className="stamp block">{hero.lines[0]}</span>
            </span>
            <span className="heavy-word block">{hero.lines[1]}</span>
            <span data-in="rest" className="stamp-n mt-4 block text-[0.42em] text-muted">{hero.lines[2]}</span>
          </h1>
        </div>
        <p data-in="rest" className="mt-8 max-w-[420px] text-[18px] leading-[1.5] text-fg/85">{hero.sub}</p>
      </div>

      {/* ruled spec strip */}
      <div className="absolute inset-x-0 bottom-0 flex h-[96px] overflow-hidden border-t-2 border-[var(--rule)] bg-[rgba(17,17,16,0.88)]">
        {hero.strip.map((s, i) => (
          <div key={s.k} data-in="cell" className="rule-r flex flex-1 flex-col justify-center px-6">
            <span className="mono-s text-muted">{s.k}</span>
            <span className="stamp-n mt-1 text-[26px]">{/[0-9]/.test(s.v) && !s.v.includes(":") ? <Odo text={s.v} when="plate" delay={0.6 + i * 0.12} /> : s.v}</span>
          </div>
        ))}
        <a href="#plans" data-in="cell" className="ibtn ibtn-blue h-full px-10 text-[15px]" data-cursor="Book" data-hover>
          <Magnet strength={0.22}>
            <span data-magnet-label className="inline-flex items-center gap-[14px]">
              {hero.cta} <span className="arrow" />
            </span>
          </Magnet>
        </a>
      </div>
      </div>
    </LiftPin>
  );
}

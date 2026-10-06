"use client";

// Loader I16 · corner counter becomes the wipe. A chalk plate covers the screen with a huge stencilled counter in the
// corner that follows the real load (the hero frames register with lib/loading). At 100 the digits slide up out of
// their mask and the plate wipes upward with a dusty edge onto the hero, which is already moving.
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { loading } from "@/lib/loading";
import { markPlateLifting } from "@/site/lib/plate";

export default function PlateLoader() {
  const root = useRef<HTMLDivElement>(null);
  const digits = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      loading.markFinished();
      markPlateLifting();
      return;
    }
    const el = root.current!;
    const shown = { v: 0 };
    let target = 0;
    let exiting = false;
    const t0 = performance.now();
    const MIN = 1600; // the counter takes at least this long: it climbs with the clock and never waits on 100
    const draw = () => {
      if (digits.current) digits.current.textContent = String(Math.round(shown.v)).padStart(3, "0");
    };
    // the counter eases toward the real progress every frame (never steps: lesson 10)
    // the counter follows the smaller of the real load and the clock (linear over MIN), so it climbs smoothly from
    // the first frame and reaches 100 exactly as it may exit: it never sits on 100 waiting (lessons 3, 10)
    const tick = () => {
      const clock = Math.min(100, ((performance.now() - t0) / MIN) * 100);
      const goal = Math.min(target, clock);
      shown.v += (goal - shown.v) * 0.25;
      if (goal >= 100 && shown.v > 99.5) shown.v = 100;
      draw();
      if (shown.v >= 100) exit();
    };
    gsap.ticker.add(tick);
    const hard = window.setTimeout(() => (target = 100), 9000);

    const exit = () => {
      if (exiting) return;
      exiting = true;
      gsap.ticker.remove(tick);
      window.clearTimeout(hard);
      gsap
        .timeline()
        .to(digits.current, { yPercent: -110, duration: 0.45, ease: "power3.in" })
        .add(() => markPlateLifting(), "-=0.1") // the hero starts moving as the plate starts to lift (lesson 4)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "expo.inOut" }, "<")
        .add(() => loading.markFinished(), "-=0.55")
        .add(() => setGone(true));
    };

    const unsub = loading.subscribe((p, done) => {
      target = done ? 100 : Math.min(99, p * 100);
    });
    return () => {
      unsub();
      gsap.ticker.remove(tick);
      window.clearTimeout(hard);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      data-loader
      aria-hidden
      className="plate-loader fixed inset-0 z-[100] bg-[var(--chalk)] text-[var(--chalk-ink)]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="loader-dust absolute inset-0" />
      <div className="absolute left-[64px] top-[56px]">
        <p className="stamp text-[44px]">Iron Temple</p>
        <p className="mono-s mt-3 text-[#5b5850]">Strength gym · loading the bar</p>
      </div>
      <div className="absolute bottom-[40px] right-[56px] overflow-hidden leading-none">
        <span ref={digits} className="stamp block text-[260px] tabular-nums">
          000
        </span>
      </div>
      <div className="absolute bottom-[56px] left-[64px] mono-s text-[#5b5850]">Warming up</div>
    </div>
  );
}

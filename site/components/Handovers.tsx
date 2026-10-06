"use client";

// Transitions between sections (site/DESIGN.md → Transitions). One place for every boundary:
//   X14 hero → rules        atmospheric bleed: chalk haze rises off the film's floor, holds, clears onto the rules
//   X1  rules → programmes  overlap slide: the rules stick (bottom aligned) and dim while the programmes slide up over
//   X28 programmes → floor  staircase columns: seven iron rack uprights drop in a staircase and lift away
//   X5  floor → bar         hard cut: the floor sticks; the bar's stage appears at once when it reaches the top
//                           (LoadTheBar hides its stage until then) with the first plate pair already moving
//   X12 bar → coaches       fade through black: the light goes out over the bar, the coaches come up under new light
//   X2  coaches → plans     colour wash: iron washes to chalk before the plans arrive
//   X13 plans → timetable   inversion cut: the board opens as the negative of the chalk band and flips back
//   X27 timetable → join    colour stripe sweep: five plate-coloured panels sweep across and leave the blue band
//   X40 join → footer       footer revealed under the page (CSS sticky in Page.tsx + PileFooter)
// Every overlay is scroll-scrubbed over its whole range (lesson 9) and hidden outside it. ?static=1: none.
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

// the blue (20 kg) panel goes last, so the sweep hands over straight onto the blue band
const STRIPES = ["#e8e6e0", "#2f7d4a", "#e2b42b", "#c8322a", "#2f55e4"];
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const seg = (q: number, a: number, b: number) => clamp((q - a) / (b - a));

export default function Handovers() {
  const haze = useRef<HTMLDivElement>(null);
  const cols = useRef<HTMLDivElement>(null);
  const black = useRef<HTMLDivElement>(null);
  const chalk = useRef<HTMLDivElement>(null);
  const stripes = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const $ = (s: string) => document.querySelector<HTMLElement>(s)!;
    const rules = $("#rules");
    const floor = $("#floor");
    const coaches = $("#coaches");
    const tt = $("#timetable");
    const show = (el: HTMLElement, on: boolean) => (el.style.visibility = on ? "visible" : "hidden");
    const triggers: ScrollTrigger[] = [];

    // X1 + X5: bottom-aligned sticky (the section holds still once its bottom meets the screen bottom)
    const stickBottom = (el: HTMLElement) => {
      const set = () => {
        el.style.position = "sticky";
        el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
      };
      set();
      window.addEventListener("resize", set);
      return () => window.removeEventListener("resize", set);
    };
    const off1 = stickBottom(rules);
    const off2 = stickBottom(floor);

    // X1: the rules dim as the programmes cover them
    triggers.push(
      ScrollTrigger.create({
        trigger: "#programmes",
        start: "top bottom",
        end: "top top",
        onUpdate: (s) => (rules.style.filter = `brightness(${(1 - 0.55 * s.progress).toFixed(3)})`),
        onLeaveBack: () => (rules.style.filter = ""),
      }),
    );

    // X14: haze rises 0 → 40%, holds to 60%, clears by 100% of the rules' arrival
    const hz = haze.current!;
    triggers.push(
      ScrollTrigger.create({
        trigger: rules,
        start: "top bottom",
        end: "top 25%",
        onUpdate: (s) => {
          const q = s.progress;
          const o = q < 0.4 ? q / 0.4 : q < 0.6 ? 1 : 1 - (q - 0.6) / 0.4;
          hz.style.opacity = (0.5 * o).toFixed(3);
          hz.style.transform = `translateY(${(30 - 60 * q).toFixed(1)}%)`;
          show(hz, o > 0.001);
        },
        onLeave: () => show(hz, false),
        onLeaveBack: () => show(hz, false),
      }),
    );

    // X28: seven columns drop in a staircase (left → right), then retract upward the same way
    const cs = Array.from(cols.current!.children) as HTMLElement[];
    triggers.push(
      ScrollTrigger.create({
        trigger: floor,
        start: "top bottom",
        end: "top 15%",
        onUpdate: (s) => {
          const q = s.progress;
          let any = false;
          cs.forEach((c, i) => {
            const down = seg(q, i * 0.035, i * 0.035 + 0.26);
            const up = seg(q, 0.42 + i * 0.035, 0.42 + i * 0.035 + 0.26);
            const cover = down * (1 - up);
            c.style.transform = `translateY(${(-100 * (1 - down)).toFixed(2)}%) scaleY(${(1 - up).toFixed(4)})`;
            if (cover > 0.001) any = true;
          });
          show(cols.current!, any);
        },
        onLeave: () => show(cols.current!, false),
        onLeaveBack: () => show(cols.current!, false),
      }),
    );

    // X12: black rises over the lifted bar, the coaches come up through it under their own light
    const bk = black.current!;
    const coachInner = coaches.querySelector<HTMLElement>("[data-light]");
    triggers.push(
      ScrollTrigger.create({
        trigger: coaches,
        start: "top bottom",
        end: "top top",
        onUpdate: (s) => {
          const q = s.progress;
          bk.style.opacity = seg(q, 0, 0.45).toFixed(3);
          show(bk, q > 0.001 && q < 0.999);
          if (coachInner) coachInner.style.filter = `brightness(${(0.3 + 0.7 * seg(q, 0.2, 0.85)).toFixed(3)})`;
        },
        onLeave: () => show(bk, false),
        onLeaveBack: () => show(bk, false),
      }),
    );

    // X2: chalk washes over the coaches before the plans arrive
    const ck = chalk.current!;
    triggers.push(
      ScrollTrigger.create({
        trigger: "#plans",
        start: "top bottom",
        end: "top top",
        onUpdate: (s) => {
          const q = s.progress;
          ck.style.opacity = seg(q, 0, 0.5).toFixed(3);
          show(ck, q > 0.001 && q < 0.999);
        },
        onLeave: () => show(ck, false),
        onLeaveBack: () => show(ck, false),
      }),
    );

    // X13: the board arrives as the photographic negative (light, like the chalk above it), cuts back to dark in
    // a short stretch, with a 2° tip back settling
    triggers.push(
      ScrollTrigger.create({
        trigger: tt,
        start: "top bottom",
        end: "top 20%",
        onUpdate: (s) => {
          const q = s.progress;
          const inv = 1 - seg(q, 0.55, 0.7);
          tt.style.filter = inv > 0.001 ? `invert(${inv.toFixed(3)})` : "";
          tt.style.transform = `perspective(1400px) rotateX(${(2 * (1 - seg(q, 0.55, 1))).toFixed(3)}deg)`;
          tt.style.transformOrigin = "50% 0%";
        },
        onLeave: () => {
          tt.style.filter = "";
          tt.style.transform = "";
        },
      }),
    );

    // X27: five plate-coloured panels race across, overlapping (each passes in 0.19 of the range, 0.03 apart:
    // ≈ 0.6 s on the record clock), so every frame is full of colour, never a mostly blank sheet
    const ps = Array.from(stripes.current!.children) as HTMLElement[];
    triggers.push(
      ScrollTrigger.create({
        trigger: "#join",
        start: "top bottom",
        end: "top top",
        onUpdate: (s) => {
          const q = s.progress;
          let any = false;
          ps.forEach((p, i) => {
            const f = seg(q, 0.3 + i * 0.03, 0.49 + i * 0.03);
            p.style.transform = `translateX(${(-101 + 202 * f).toFixed(2)}%) skewX(-8deg)`;
            if (f > 0 && f < 1) any = true;
          });
          show(stripes.current!, any);
        },
        onLeave: () => show(stripes.current!, false),
        onLeaveBack: () => show(stripes.current!, false),
      }),
    );

    ScrollTrigger.refresh();
    return () => {
      off1();
      off2();
      triggers.forEach((t) => t.kill());
      gsap.set([rules, floor, tt], { clearProps: "position,top,filter,transform" });
    };
  }, []);

  return (
    <>
      {/* X14 chalk haze (light only, never darkens: lesson 72) */}
      <div ref={haze} aria-hidden className="bleed-haze pointer-events-none fixed inset-0 z-[35]" style={{ visibility: "hidden", opacity: 0 }} />
      {/* X28 rack uprights */}
      <div ref={cols} aria-hidden className="pointer-events-none fixed inset-0 z-[35] flex" style={{ visibility: "hidden" }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="upright relative h-full flex-1 origin-top" style={{ transform: "translateY(-100%)" }} />
        ))}
      </div>
      {/* X12 black, under the coaches (z 20) and over the bar (z 2) */}
      <div ref={black} aria-hidden className="pointer-events-none fixed inset-0 z-[15] bg-[#050505]" style={{ visibility: "hidden", opacity: 0 }} />
      {/* X2 chalk, over the coaches (z 20) and under the plans (z 30) */}
      <div ref={chalk} aria-hidden className="pointer-events-none fixed inset-0 z-[25] bg-[var(--chalk)]" style={{ visibility: "hidden", opacity: 0 }} />
      {/* X27 plate stripes */}
      <div ref={stripes} aria-hidden className="pointer-events-none fixed inset-0 z-[45] overflow-hidden" style={{ visibility: "hidden" }}>
        {STRIPES.map((c) => (
          <div key={c} className="absolute inset-y-0 -left-[10%] w-[120%]" style={{ background: c, transform: "translateX(-101%)" }} />
        ))}
      </div>
    </>
  );
}

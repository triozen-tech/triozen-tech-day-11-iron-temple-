"use client";

// Signature · Load the bar (layout CP02 size line-up on a baseline, restyled: the plate line-up is the legend on the
// floor line, and the plates are loaded onto a barbell above it). Everything is drawn in code so the bar can bend.
// Motion M253: pinned; with the scroll each plate PAIR slides in from both screen edges at once and slams onto the
// sleeves (accelerating into the hit) → 2px stage jolt + chalk puff + bar whip; the kilo readout rolls continuously
// 20 → 170 (odometer, lesson 73); collars lock; the bar lifts off the floor with a chalk burst.
// One scroll value p (0..1 of the pin, linear, finishing exactly at the end: lesson 9) drives the state; a ticker adds
// the time-based life (whip, chalk, dust in the light). ?static=1: p = 1 (loaded, collars on, lifted).
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { loadBar, plates } from "@/site/content";
import { MM, PlateDefs, PlateEdge } from "./Plates";

const W = 1440;
const H = 470;
const FLOOR = H - 46;
const CY = FLOOR - (450 * MM) / 2; // bar centre line: the 450 mm bumpers stand on the floor
// bar geometry (mm → px): 2200 mm total, 415 mm sleeves, 30 mm inner collars
const BAR = 2200 * MM;
const X0 = (W - BAR) / 2;
const SLEEVE = 415 * MM;
const FLANGE = 30 * MM;
const PIVOT_L = X0 + SLEEVE + FLANGE; // where the shaft meets the inner collar
const PIVOT_R = X0 + BAR - SLEEVE - FLANGE;
const SHAFT_H = 12;
const SLEEVE_H = 22;
const LIFT_PX = 46;
/** pin length (vh) and its record seconds (55 vh per second, like the films) */
const PIN_VH = 330;
const PIN_SECS = 5.6;

/** x of each plate's centre on the left sleeve (the first plate sits against the inner collar). */
const SEATS = (() => {
  let x = PIVOT_L - FLANGE;
  return plates.map((p) => {
    const w = p.thick * MM;
    const c = x - w / 2 - 1;
    x -= w + 2;
    return c;
  });
})();
const COLLAR_X = SEATS[plates.length - 1] - (plates[plates.length - 1].thick * MM) / 2 - 18;
/** two low jack stands under the shaft, just inside the collars: the empty bar never floats */
const STANDS = [PIVOT_L + 64, PIVOT_R - 64];

/** A jack stand (iron, chalk-smudged): wide foot on the floor, a square post, a V saddle under the shaft. */
function Stand({ x }: { x: number }) {
  const top = CY + SHAFT_H / 2 + 1; // the saddle meets the underside of the shaft
  const foot = FLOOR;
  return (
    <g aria-hidden>
      <path d={`M ${x - 46} ${foot} L ${x - 14} ${foot - 34} L ${x + 14} ${foot - 34} L ${x + 46} ${foot} Z`} fill="#262523" stroke="#3d3b37" strokeWidth="1.5" />
      <rect x={x - 9} y={top + 14} width={18} height={foot - 34 - top - 14} fill="url(#it-steel)" opacity="0.75" />
      <rect x={x - 9} y={top + 14} width={18} height={foot - 34 - top - 14} fill="#1e1d1b" opacity="0.55" />
      {[0.25, 0.5, 0.75].map((f) => (
        <circle key={f} cx={x} cy={top + 14 + (foot - 48 - top) * f} r="2.6" fill="#0d0d0c" />
      ))}
      <path d={`M ${x - 22} ${top} L ${x - 9} ${top + 16} L ${x + 9} ${top + 16} L ${x + 22} ${top} L ${x + 15} ${top} L ${x + 5} ${top + 9} L ${x - 5} ${top + 9} L ${x - 15} ${top} Z`} fill="#33312e" stroke="#4a4843" strokeWidth="1" />
      {/* chalk smudges where hands grab it */}
      <rect x={x - 8} y={top + 30} width={10} height={18} fill="#e4e1da" opacity="0.22" />
      <rect x={x - 30} y={foot - 12} width={22} height={6} fill="#e4e1da" opacity="0.16" />
    </g>
  );
}

// timeline of the pin (fractions of p)
const P0 = 0.03;
const PAIR = 0.14; // each pair's window: slide (first 70%) then the hit and settle
const SLIDE = 0.7;
const COLLARS = [P0 + PAIR * plates.length, P0 + PAIR * plates.length + 0.07] as const; // 0.73 → 0.80
const LIFT = [COLLARS[1], 1] as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const kgBefore = (i: number) => loadBar.barKg + 2 * plates.slice(0, i).reduce((s, p) => s + p.kg, 0);
const KG_END = kgBefore(plates.length);

type State = { pos: number[]; collar: number; lift: number; kg: number };
function stateAt(p: number): State {
  const pos = plates.map((_, i) => {
    const u = clamp((p - (P0 + i * PAIR)) / PAIR);
    return Math.pow(clamp(u / SLIDE), 2.2); // accelerates into the sleeve: a slam, not a glide
  });
  let kg = loadBar.barKg;
  plates.forEach((pl, i) => (kg += 2 * pl.kg * clamp((p - (P0 + i * PAIR)) / (PAIR * SLIDE))));
  const collar = Math.pow(clamp((p - COLLARS[0]) / (COLLARS[1] - COLLARS[0])), 2);
  const lu = clamp((p - LIFT[0]) / (LIFT[1] - LIFT[0]));
  const lift = 1 - Math.pow(1 - lu, 2); // power2.out, ends exactly at p = 1
  return { pos, collar, lift, kg };
}

/** Odometer column for one place (1, 10, 100): continuous, a higher digit only turns while the lower ones roll 9 → 0. */
function digitAt(v: number, place: number) {
  const base = Math.floor(v / place) % 10;
  const turn = place === 1 ? v % 1 : clamp((v % place) - (place - 1));
  return base + turn;
}

type Puff = { x: number; y: number; vx: number; vy: number; r: number; a: number; life: number; age: number };
type Speck = { u: number; y: number; s: number; ph: number; a: number; z: number };

export default function LoadTheBar() {
  const outer = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const jolt = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const readout = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const sv = svg.current!;
    const sides = Array.from(sv.querySelectorAll<SVGGElement>("[data-sleeve]"));
    const plateEls = sides.map((g) => Array.from(g.querySelectorAll<SVGGElement>("[data-plate]")));
    const collarEls = sides.map((g) => g.querySelector<SVGRectElement>("[data-collar]")!);
    const shaft = Array.from(sv.querySelectorAll<SVGPathElement>("[data-shaft]"));
    const shadow = sv.querySelector<SVGEllipseElement>("[data-shadow]")!;
    const cols = Array.from(readout.current!.querySelectorAll<HTMLElement>("[data-col]"));
    const legend = Array.from(stage.current!.querySelectorAll<HTMLElement>("[data-legend]"));
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;

    let st = stateAt(0);
    const whip = { a: 0, t0: 0 };
    const puffs: Puff[] = [];
    // chalk specks: 1–2 px, sharp, drifting slowly, only inside the top-light beam (u = place across the beam)
    const specks: Speck[] = Array.from({ length: 22 }, (_, k) => ({ u: ((k * 37) % 97) / 97 - 0.5, y: ((k * 53) % 89) / 89, s: 0.006 + (k % 5) * 0.0025, ph: k * 1.9, a: 0.5 + (k % 4) * 0.12, z: k % 3 === 0 ? 2 : 1 }));
    let geo = { sx: 1, top: 0, left: 0, w: 1, h: 1, dpr: 1 };

    const measure = () => {
      const sr = stage.current!.getBoundingClientRect();
      const r = sv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.round(sr.width * dpr);
      cv.height = Math.round(sr.height * dpr);
      geo = { sx: r.width / W, top: r.top - sr.top, left: r.left - sr.left, w: sr.width, h: sr.height, dpr };
    };
    /** viewBox point → canvas CSS px */
    const at = (x: number, y: number) => ({ x: geo.left + x * geo.sx, y: geo.top + y * geo.sx });

    const puff = (x: number, y: number, n: number, spread: number, up: number) => {
      for (let k = 0; k < n; k++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 40 + Math.random() * spread;
        puffs.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.6 - up * Math.random(), r: 10 + Math.random() * 26, a: 0.22 + Math.random() * 0.2, life: 0.9 + Math.random() * 0.9, age: 0 });
      }
    };

    const hitPlate = (i: number) => {
      gsap.fromTo(jolt.current, { y: 3 }, { y: 0, duration: 0.4, ease: "expo.out", overwrite: true });
      whip.a = 0.55 + i * 0.08;
      whip.t0 = performance.now();
      const half = (plates[i].dia * MM) / 2;
      [SEATS[i], W - SEATS[i]].forEach((x) => {
        const c = at(x, CY - half * 0.2);
        puff(c.x, c.y, 10, 90, 60);
      });
    };
    const hitFloor = () => {
      whip.a = 1.1;
      whip.t0 = performance.now();
      [SEATS[1], W - SEATS[1]].forEach((x) => {
        const c = at(x, FLOOR);
        puff(c.x, c.y, 26, 220, 30);
      });
    };

    const draw = (now: number) => {
      const wt = (now - whip.t0) / 1000;
      const w = whip.a * Math.exp(-wt * 3.2) * Math.sin(wt * 17);
      const loadBend = (st.kg - loadBar.barKg) / (KG_END - loadBar.barKg);
      const bend = loadBend * (1 + 0.6 * st.lift) + w * (0.3 + loadBend);
      const deg = bend * 1.5;
      const lift = st.lift * LIFT_PX;
      const y = CY - lift;
      const d = `M ${PIVOT_L} ${y} Q ${W / 2} ${y - bend * 10} ${PIVOT_R} ${y}`;
      shaft.forEach((s) => s.setAttribute("d", d));
      sides.forEach((g, k) => {
        const side = k === 0 ? -1 : 1;
        g.setAttribute("transform", `translate(0 ${-lift}) rotate(${side * deg} ${side < 0 ? PIVOT_L : PIVOT_R} ${CY})${side > 0 ? ` translate(${W} 0) scale(-1 1)` : ""}`);
        plateEls[k].forEach((el, i) => {
          const off = -(SEATS[i] + 160) * (1 - st.pos[i]);
          el.setAttribute("transform", `translate(${off.toFixed(2)} 0)`);
          el.style.opacity = st.pos[i] > 0 ? "1" : "0";
        });
        collarEls[k].setAttribute("transform", `translate(${(-70 * (1 - st.collar)).toFixed(2)} 0)`);
        collarEls[k].style.opacity = st.collar > 0 ? "1" : "0";
      });
      shadow.setAttribute("rx", String(BAR * 0.42 * (1 - st.lift * 0.12)));
      shadow.style.opacity = String(0.5 - st.lift * 0.2);
      // readout: three odometer columns (hundreds dim until it turns to 1)
      const v = st.kg;
      [100, 10, 1].forEach((place, k) => {
        const col = cols[k];
        (col.firstElementChild as HTMLElement).style.transform = `translateY(${(-digitAt(v, place) * 100) / 11}%)`;
        if (place === 100) col.style.opacity = String(0.22 + 0.78 * clamp((v - 90) / 10));
      });
      legend.forEach((el, i) => {
        el.style.opacity = String(0.42 + 0.58 * st.pos[i]);
        const tag = el.querySelector<HTMLElement>("[data-tag]");
        if (tag) tag.textContent = st.pos[i] >= 1 ? "Pair · on" : "Pair · ready";
      });
    };

    let last = 0;
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      draw(now);
      // canvas: dust in the top light (always drifting, coarse enough to register on camera) + chalk puffs
      ctx.setTransform(geo.dpr, 0, 0, geo.dpr, 0, 0);
      ctx.clearRect(0, 0, geo.w, geo.h);
      const t = now / 1000;
      // the beam: a cone from the light at the top centre, 22% wide at the top → 52% wide at 72% height
      const beamH = geo.h * 0.72;
      const haze = ctx.createRadialGradient(geo.w / 2, 0, 0, geo.w / 2, 0, beamH);
      const breathe = 0.05 + 0.02 * Math.sin(t * 0.9);
      haze.addColorStop(0, `rgba(236,233,226,${breathe.toFixed(3)})`);
      haze.addColorStop(1, "rgba(236,233,226,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, geo.w, beamH);
      for (const sp of specks) {
        const f = ((((sp.y + t * sp.s) % 1) + 1) % 1); // drifts slowly down through the beam
        const yy = f * beamH;
        const half = geo.w * (0.11 + 0.15 * f);
        const x = geo.w / 2 + sp.u * 2 * half * 0.92 + 6 * Math.sin(t * 0.6 + sp.ph);
        const fade = Math.min(1, f * 6, (1 - f) * 4); // fade in under the light, out at the beam's foot
        ctx.fillStyle = `rgba(240,237,230,${(sp.a * fade).toFixed(3)})`;
        ctx.fillRect(Math.round(x), Math.round(yy), sp.z, sp.z);
      }
      for (let k = puffs.length - 1; k >= 0; k--) {
        const p = puffs[k];
        p.age += dt;
        if (p.age > p.life) {
          puffs.splice(k, 1);
          continue;
        }
        p.vx *= 0.94;
        p.vy = p.vy * 0.94 - 14 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const life = p.age / p.life;
        const r = p.r * (1 + life * 1.6);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, `rgba(240,237,230,${(p.a * (1 - life)).toFixed(3)})`);
        g.addColorStop(1, "rgba(240,237,230,0)");
        ctx.fillStyle = g;
        ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage.current!);

    if (prefersReducedMotion()) {
      st = stateAt(1);
      draw(0);
      return () => ro.disconnect();
    }

    let prev = st;
    const apply = (p: number) => {
      const next = stateAt(p);
      // real-time hits fire when a plate CROSSES its seat going forward (lesson 13)
      next.pos.forEach((v, i) => {
        if (v >= 1 && prev.pos[i] < 1) hitPlate(i);
      });
      if (next.collar >= 1 && prev.collar < 1) gsap.fromTo(jolt.current, { y: 2 }, { y: 0, duration: 0.3, ease: "expo.out", overwrite: true });
      if (next.lift > 0.12 && prev.lift <= 0.12) hitFloor();
      prev = next;
      st = next;
    };
    // X5 hard cut: the stage stays hidden while the section slides up over the (sticky) floor, and appears at once
    // when the section reaches the top, with a 3px stamp jolt; the first pair is already moving (P0 = 0.03)
    const stageEl = stage.current!;
    const cut = ScrollTrigger.create({
      trigger: outer.current!,
      start: "top top",
      onToggle: () => {},
      onEnter: () => {
        stageEl.style.visibility = "visible";
        gsap.fromTo(jolt.current, { y: 3 }, { y: 0, duration: 0.35, ease: "expo.out", overwrite: true });
      },
      onLeaveBack: () => (stageEl.style.visibility = "hidden"),
    });
    stageEl.style.visibility = cut.progress > 0 || outer.current!.getBoundingClientRect().top <= 0 ? "visible" : "hidden";

    const trig = ScrollTrigger.create({
      trigger: outer.current!,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => apply(s.progress),
      onRefresh: (s) => {
        prev = st = stateAt(s.progress);
      },
    });
    prev = st = stateAt(trig.progress);

    // the ticker only runs while the section is near the screen
    let running = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        last = 0;
        gsap.ticker.add(tick);
      } else if (!e.isIntersecting && running) {
        running = false;
        gsap.ticker.remove(tick);
      }
    });
    io.observe(outer.current!);
    draw(0);

    return () => {
      cut.kill();
      stageEl.style.visibility = "";
      trig.kill();
      io.disconnect();
      ro.disconnect();
      gsap.ticker.remove(tick);
    };
  }, []);

  const final = String(KG_END).padStart(3, " ").split("");

  return (
    <section
      ref={outer}
      id="load"
      data-section="Load the bar"
      className="pin-outer relative z-[2]"
      style={{ height: `calc(100svh + ${PIN_VH}vh)` }}
      data-record-time={1.4}
      data-record-label="load: arrive"
      data-cursor="Load"
    >
      <div aria-hidden className="rec-stop pointer-events-none absolute left-0 h-px w-px" style={{ top: `${PIN_VH}vh` }} data-record-time={PIN_SECS} data-record-label="load: bar lifted" />
      <div ref={stage} className="pin-stage flex flex-col bg-bg">
        {/* hard top light over the stage */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[70%] w-[70%] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(236,233,226,0.14),transparent_70%)]" />

        <div ref={jolt} className="relative flex flex-1 flex-col">
          <div className="relative flex items-start justify-between px-[64px] pt-[104px]">
            <div>
              <p className="mono-s text-muted">The signature · scroll to load</p>
              <h2 className="stamp mt-4 text-[80px]">
                {loadBar.title[0]}
                <br />
                {loadBar.title[1]}
              </h2>
            </div>
            <div className="text-right">
              <p className="mono-s text-muted">On the bar</p>
              <p ref={readout} className="stamp mt-2 flex items-baseline justify-end text-[150px] leading-[0.85]" aria-label={`${KG_END} kilograms`}>
                {final.map((ch, k) => (
                  // each column is sized by its FINAL digit (lesson 73); the strip 0–9 + 0 rolls inside it
                  <span key={k} data-col className="relative inline-block overflow-hidden" style={{ height: "1em", lineHeight: 1 }}>
                    <span className="absolute left-0 right-0 top-0 flex flex-col">
                      {Array.from({ length: 11 }, (_, d) => (
                        <span key={d} className="block h-[1em] text-center">
                          {d % 10}
                        </span>
                      ))}
                    </span>
                    <span className="invisible block">{ch === " " ? "0" : ch}</span>
                  </span>
                ))}
                <span className="ml-3 text-[0.32em]">KG</span>
              </p>
              <p className="mono-s mt-3 text-muted">{loadBar.end}</p>
            </div>
          </div>

          <div className="relative mt-auto">
            <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="relative block w-full" aria-label={`Barbell loaded to ${KG_END} kilograms`}>
              <PlateDefs id="it" />
              <rect x="0" y={FLOOR} width={W} height="2" fill="var(--rule)" />
              <ellipse data-shadow cx={W / 2} cy={FLOOR} rx={BAR * 0.42} ry="10" fill="#000" opacity="0.5" />
              {STANDS.map((x) => (
                <Stand key={x} x={x} />
              ))}
              {/* shaft: knurled, bending (three strokes: edge, knurl, sheen) */}
              <path data-shaft stroke="#2a2926" strokeWidth={SHAFT_H + 2} fill="none" d={`M ${PIVOT_L} ${CY} L ${PIVOT_R} ${CY}`} />
              <path data-shaft stroke="url(#it-knurl)" strokeWidth={SHAFT_H} fill="none" d={`M ${PIVOT_L} ${CY} L ${PIVOT_R} ${CY}`} />
              <path data-shaft stroke="url(#it-sleeve)" strokeOpacity="0.35" strokeWidth={SHAFT_H} fill="none" d={`M ${PIVOT_L} ${CY} L ${PIVOT_R} ${CY}`} />
              {[-1, 1].map((side) => (
                <g key={side} data-sleeve={side < 0 ? "l" : "r"}>
                  <rect x={X0} y={CY - SLEEVE_H / 2} width={SLEEVE} height={SLEEVE_H} fill="url(#it-sleeve)" />
                  <rect x={PIVOT_L - FLANGE} y={CY - 26} width={FLANGE} height={52} rx={3} fill="url(#it-steel)" />
                  {plates.map((p, i) => (
                    <g key={p.kg} data-plate={i}>
                      <PlateEdge p={p} cx={SEATS[i]} cy={CY} mirrored={side > 0} />
                    </g>
                  ))}
                  <rect data-collar x={COLLAR_X} y={CY - 18} width={14} height={36} rx={3} fill="url(#it-steel)" />
                </g>
              ))}
            </svg>
          </div>

          {/* the line-up: plate pairs on the baseline, lit as they go on */}
          <div className="rule-t relative grid grid-cols-[repeat(6,1fr)] px-[64px]">
            <div className="rule-r flex h-[84px] flex-col justify-center pr-6">
              <span className="mono-s text-muted">Bar</span>
              <span className="stamp-n text-[24px]">{loadBar.barKg} kg</span>
            </div>
            {plates.map((p, i) => (
              <div key={p.kg} className={`flex h-[84px] items-center gap-4 px-6 ${i < plates.length - 1 ? "rule-r" : ""}`} data-legend={i}>
                <span className="h-[44px] w-[12px]" style={{ background: p.color }} />
                <div>
                  <span data-tag className="mono-s text-muted">
                    Pair · on
                  </span>
                  <span className="stamp-n block text-[24px]">2 × {p.kg} kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      </div>
    </section>
  );
}

"use client";

// Footer (layout FO10 physics pile footer, restyled: the same code-drawn plates as the signature, seen face-on, plus
// stencilled chalk word discs, drop and pile on the floor line under a stamped wordmark + three mono link columns).
// Motion M236 (Round 3 tunes it): the pile plays on the clock once on screen (lesson 77). ?static=1: the settled pile.
import { useEffect, useRef } from "react";
import { isRecording, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { footer, plates, studio } from "@/site/content";
import { PlateFace } from "./Plates";

type Body = { x: number; y: number; vx: number; vy: number; r: number; rot: number };
type Item = { kind: "plate"; p: number; r: number } | { kind: "word"; w: string; r: number };

// seeded random: the same pile on every load (and in ?static=1)
const rand = (s: number) => {
  const x = Math.sin(s * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};
const ITEMS: Item[] = Array.from({ length: 26 }, (_, k): Item => {
  if (k % 4 === 3) return { kind: "word", w: footer.words[(k >> 2) % footer.words.length], r: 46 };
  const p = Math.floor(rand(k + 11) * plates.length);
  return { kind: "plate", p, r: plates[p].dia === 450 ? 54 + Math.round(rand(k) * 10) : 40 };
});

const spawn = (w: number): Body[] =>
  ITEMS.map((s, k) => ({ x: s.r + rand(k + 40) * (w - 2 * s.r), y: -s.r - k * 52 - rand(k + 80) * 60, vx: (rand(k + 7) - 0.5) * 120, vy: 0, r: s.r, rot: rand(k + 3) * 360 }));

function step(b: Body[], w: number, h: number, dt: number) {
  const G = 2600;
  for (const p of b) {
    p.vy += G * dt;
    p.vx *= 0.995;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += ((p.vx * dt) / p.r) * 57.3;
  }
  for (let it = 0; it < 3; it++) {
    for (let i = 0; i < b.length; i++) {
      const a = b[i];
      for (let j = i + 1; j < b.length; j++) {
        const c = b[j];
        const dx = c.x - a.x;
        const dy = c.y - a.y;
        const min = a.r + c.r;
        const d2 = dx * dx + dy * dy;
        if (d2 >= min * min || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const nx = dx / d;
        const ny = dy / d;
        const over = (min - d) / 2;
        a.x -= nx * over;
        a.y -= ny * over;
        c.x += nx * over;
        c.y += ny * over;
        const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (rv < 0) {
          const imp = -0.6 * rv; // heavy: rubber plates barely bounce
          a.vx -= imp * nx;
          a.vy -= imp * ny;
          c.vx += imp * nx;
          c.vy += imp * ny;
        }
      }
    }
    for (const p of b) {
      if (p.y + p.r > h) {
        p.y = h - p.r;
        if (p.vy > 0) p.vy *= -0.18;
        p.vx *= 0.88;
      }
      if (p.x - p.r < 0) {
        p.x = p.r;
        p.vx = Math.abs(p.vx) * 0.4;
      }
      if (p.x + p.r > w) {
        p.x = w - p.r;
        p.vx = -Math.abs(p.vx) * 0.4;
      }
    }
  }
}

export default function PileFooter() {
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const size = () => ({ w: el.clientWidth, h: el.clientHeight });
    const paint = () =>
      bodies.current.forEach((p, k) => {
        const n = els.current[k];
        if (n) n.style.transform = `translate(${(p.x - p.r).toFixed(1)}px, ${(p.y - p.r).toFixed(1)}px) rotate(${p.rot.toFixed(1)}deg)`;
      });
    const { w, h } = size();
    bodies.current = spawn(w);
    if (prefersReducedMotion()) {
      for (let k = 0; k < 1200; k++) step(bodies.current, w, h, 1 / 120);
      paint();
      return;
    }
    paint();
    let raf = 0;
    let last = 0;
    let started = false;
    let hop = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.033, (now - (last || now)) / 1000);
      last = now;
      const { w: ww, h: hh } = size();
      // two plates hop every ~0.45 s so the resting pile (the reel's last screen) is never still (lesson 35)
      hop += dt;
      if (hop > 0.45) {
        hop = 0;
        const free = bodies.current.filter((p) => p.y > hh * 0.45);
        for (let n = 0; n < 2; n++) {
          const p = free[Math.floor(Math.random() * free.length)];
          if (p) {
            p.vy = -820 - Math.random() * 260;
            p.vx = (Math.random() - 0.5) * 460;
          }
        }
      }
      for (let k = 0; k < 3; k++) step(bodies.current, ww, hh, dt / 3);
      paint();
    };
    // the footer is revealed UNDER the page (X40, sticky): it is always "in view" geometrically, so the pile plays by
    // scroll position (lesson 66): it starts once the join band's bottom clears the screen bottom, on the clock (77)
    const st = ScrollTrigger.create({
      trigger: "#join",
      start: "bottom 98%",
      // runs from here to the very bottom of the page (it must not stop when the scroll reaches its end)
      onEnter: () => {
        cancelAnimationFrame(raf);
        last = 0;
        if (!started) {
          started = true;
          bodies.current = spawn(size().w);
          if (isRecording()) window.setTimeout(sweep, 1300);
        }
        raf = requestAnimationFrame(loop);
      },
      onLeaveBack: () => cancelAnimationFrame(raf),
      onEnterBack: () => {
        cancelAnimationFrame(raf);
        last = 0;
        raf = requestAnimationFrame(loop);
      },
    });
    // ?record=1: a fake pointer sweeps once through the pile and shoves the plates it passes
    function sweep() {
      const { w: ww, h: hh } = size();
      const t0 = performance.now();
      const push = () => {
        const f = (performance.now() - t0) / 900;
        if (f > 1) return;
        const px = ww * (0.1 + 0.8 * f);
        const py = hh * 0.72;
        for (const p of bodies.current) {
          const dx = p.x - px;
          const dy = p.y - py;
          const d = Math.hypot(dx, dy);
          if (d < p.r + 60) {
            p.vx += (dx / (d || 1)) * 260 + 220;
            p.vy -= 380;
          }
        }
        requestAnimationFrame(push);
      };
      push();
    }
    return () => {
      st.kill();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <footer id="footer" data-section="Footer" className="sticky bottom-0 z-[1] overflow-hidden bg-bg [html.is-static_&]:relative">
      <div className="grid grid-cols-[1fr_auto] gap-10 px-[64px] pt-[96px]">
        <div>
          <p className="stamp text-[120px]">Iron Temple</p>
          <p className="mono-s mt-4 text-muted">Strength gym · 05:00–23:00 · 7 days</p>
        </div>
        <div className="grid grid-cols-3 gap-12 pt-4">
          {footer.cols.map((c) => (
            <div key={c.t}>
              <p className="mono-s text-muted">{c.t}</p>
              <ul className="mt-4 space-y-2">
                {c.l.map((l) => (
                  <li key={l}>
                    <a href="#" onClick={(e) => e.preventDefault()} className="fl-link text-[16px] text-fg/85 hover:text-fg" data-hover>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* the pile */}
      <div ref={box} data-pile className="relative mt-6 h-[300px]">
        {ITEMS.map((s, k) => (
          <div
            key={k}
            ref={(n) => {
              els.current[k] = n;
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{ width: s.r * 2, height: s.r * 2 }}
          >
            {s.kind === "plate" ? (
              <PlateFace p={plates[s.p]} size={s.r * 2} id={`pf${k}`} />
            ) : (
              <div className="grid h-full w-full place-items-center rounded-full border-2 border-[#b9b5ad] bg-[var(--chalk)] text-[var(--chalk-ink)]">
                <span className="stamp text-[15px]">{s.w}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rule-t flex h-[56px] items-center justify-between px-[64px]">
        <span className="mono-s text-muted">Concept website by {studio}</span>
        <span className="mono-s text-muted">Iron Temple is a fictional gym · prices are samples</span>
      </div>
    </footer>
  );
}

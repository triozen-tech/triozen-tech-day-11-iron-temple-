"use client";

// The floor (layout GL17 perspective floor grid, restyled: six square zone photos with a ruled label strip under
// each, beside a stamped title). Motion M430 (Round 3): the grid lies in deep perspective like a floor plan seen
// from the door and unfurls flat as the section passes (--unfurl 1 → 0, columns at different parallax offsets).
// ?static=1: flat.
import { useEffect, useRef } from "react";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { floor } from "@/site/content";
import Odo from "./Odo";

export default function FloorPlan() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const g = grid.current!;
    const tiles = Array.from(g.querySelectorAll<HTMLElement>("[data-col]"));
    const set = (p: number) => {
      const u = 1 - p; // 1 = lying on the floor, 0 = flat, facing you
      g.style.setProperty("--unfurl", u.toFixed(4));
      // columns at different parallax offsets while they rise
      tiles.forEach((t) => {
        const c = Number(t.dataset.col);
        t.style.transform = `translateY(${((c - 1) * 90 * Math.min(1, u * 1.6)).toFixed(1)}px) scale(${(1 + 0.04 * u).toFixed(4)})`;
      });
    };
    if (prefersReducedMotion()) return set(1);
    // the unfurl runs from the floor's arrival to the hard cut into the bar (X5): the floor sticks for that last
    // screen, so it is never a still picture on camera
    const st = ScrollTrigger.create({
      trigger: root.current!,
      start: "top bottom",
      endTrigger: "#load",
      end: "top top",
      onUpdate: (s) => set(s.progress),
      onRefresh: (s) => set(s.progress),
    });
    set(st.progress);
    return () => st.kill();
  }, []);

  return (
    <section ref={root} id="floor" data-section="The floor" className="relative bg-bg px-[64px] pb-[72px] pt-[120px]" data-record-time={1.8} data-record-label="floor">
      <div className="grid grid-cols-[400px_1fr] gap-[40px]">
        <div className="flex flex-col justify-between">
          <div>
            <p className="mono-s text-muted">The floor · 2,400 sq ft</p>
            <h2 className="stamp mt-4 text-[76px]">
              The
              <br />
              floor.
            </h2>
            <p className="mt-6 max-w-[300px] text-[20px] leading-[1.4] text-fg/80">{floor.sub}</p>
          </div>
          <p className="mono-s text-muted">Open 05:00–23:00 · 7 days</p>
        </div>
        <div className="floor-persp" style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
          <div
            ref={grid}
            className="floor-grid grid grid-cols-3 gap-[20px]"
            style={{
              transformOrigin: "50% 100%",
              transform: "rotateX(calc(58deg * var(--unfurl, 0))) rotateZ(calc(-30deg * var(--unfurl, 0)))",
            }}
          >
            {floor.zones.map((z, i) => (
              <figure key={z.name} className="floor-tile" data-col={i % 3}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={z.img} alt={z.name} className="block aspect-square w-full object-cover" />
                <figcaption className="flex h-[56px] items-center justify-between border-x-2 border-b-2 border-[var(--rule)] bg-surface px-4">
                  <span className="mono-s">{z.name}</span>
                  <span className="flex items-baseline gap-2">
                    <span className="stamp-n text-[24px]">{/[0-9]/.test(z.n) ? <Odo text={z.n} start="top 32%" delay={i * 0.08} duration={1.1} /> : z.n}</span>
                    <span className="mono-s text-muted">{z.unit}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

// Join band (layout CT01 accent band, giant CTA line, restyled: the plate-blue band, two stamped lines, one chalk
// button). Motion M289 (Round 3): hard stacked shadows extrude the words into a solid block. The words carry the
// final extrude in ?static=1 (text-shadow set by --ex = 1).
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { join } from "@/site/content";
import Magnet from "./Magnet";

export default function JoinBand() {
  const words = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const h = words.current!;
    const v = { ex: 0 };
    // the words shift up-left while the hard stacked shadows grow down-right: they extrude into a solid block,
    // then the block breathes slowly (never frozen on the band)
    const set = () => {
      h.style.setProperty("--ex", v.ex.toFixed(3));
      h.style.transform = `translate(${(-7 * v.ex).toFixed(2)}px, ${(-7 * v.ex).toFixed(2)}px)`;
    };
    set();
    const tl = gsap.timeline({ paused: true });
    tl.to(v, { ex: 1, duration: 0.9, ease: "expo.out", onUpdate: set }).to(v, { ex: 0.78, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1, onUpdate: set });
    const st = ScrollTrigger.create({ trigger: h, start: "top 80%", once: true, onEnter: () => tl.play() });
    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <section id="join" data-section="Join" className="band-blue relative z-[32] overflow-hidden px-[64px] py-[120px]" data-record-time={1.8} data-record-label="join">
      <div className="flex items-end justify-between gap-10">
        <h2 ref={words} className="extrude stamp text-[150px]" style={{ ["--ex" as string]: 1 }}>
          {join.lines[0]}
          <br />
          {join.lines[1]}
        </h2>
        <div className="flex flex-col items-end gap-5 pb-4">
          <p className="mono-s max-w-[260px] text-right text-fg">{join.sub}</p>
          <Magnet strength={0.3}>
            <a href="#plans" className="ibtn ibtn-chalk press3d-chalk px-10" data-cursor="Book" data-hover data-press data-join-cta>
              <span data-magnet-label className="inline-flex items-center gap-[14px]">
                {join.cta} <span className="arrow" />
              </span>
            </a>
          </Magnet>
        </div>
      </div>
    </section>
  );
}

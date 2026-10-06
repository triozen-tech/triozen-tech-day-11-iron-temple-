"use client";

// House rules (layout SY04 manifesto, restyled as five numbered rules in black expanded caps on iron).
// Motion M90 (Round 3): two blocks (chalk, then blue 0.15 s behind) sweep across each line and leave it.
// The curtain blocks are in the markup now, parked off (scaleX 0), so ?static=1 shows every rule.
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { rules } from "@/site/content";

export default function HouseRules() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lines = Array.from(root.current!.querySelectorAll<HTMLElement>(".curtain-line"));
    const ctx = gsap.context(() => {
      lines.forEach((line) => {
        const word = line.querySelector(".stamp")!;
        const a = line.querySelector(".curtain-a")!;
        const b = line.querySelector(".curtain-b")!;
        gsap.set(word, { opacity: 0 });
        const tl = gsap.timeline({ paused: true });
        // two blocks sweep in from the left (chalk, then blue 0.15 s behind), the words appear under them,
        // then both sweep off to the right
        tl.fromTo(a, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.32, ease: "power3.in" }, 0)
          .fromTo(b, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.32, ease: "power3.in" }, 0.15)
          .set(word, { opacity: 1 }, 0.47)
          .set([a, b], { transformOrigin: "100% 50%" }, 0.47)
          .to(a, { scaleX: 0, duration: 0.42, ease: "expo.out" }, 0.47)
          .to(b, { scaleX: 0, duration: 0.42, ease: "expo.out" }, 0.6);
        ScrollTrigger.create({ trigger: line, start: "top 88%", once: true, onEnter: () => tl.play() });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="rules" data-section="House rules" className="relative bg-bg px-[64px] pb-[120px] pt-[140px]" data-record-time={2.0} data-record-label="rules">
      <div className="rule-b mb-10 flex items-end justify-between pb-5">
        <p className="mono-s text-muted">{rules.label}</p>
        <p className="mono-s text-muted">Posted by the platforms · read before you lift</p>
      </div>
      <ol>
        {rules.items.map((r, i) => (
          <li key={r} className="rule-b grid grid-cols-[120px_1fr] items-center py-5">
            <span className="mono text-[22px] text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="curtain-line relative inline-block justify-self-start">
              <span className="stamp block text-[clamp(56px,6.6vw,104px)]">{r}</span>
              <span aria-hidden className="curtain curtain-a absolute inset-0 origin-left scale-x-0 bg-[var(--chalk)]" />
              <span aria-hidden className="curtain curtain-b absolute inset-0 origin-left scale-x-0 bg-[var(--plate-blue)]" />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

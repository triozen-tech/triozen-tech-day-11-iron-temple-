"use client";

// Nav (layout NV14 ruled-cell navbar, restyled as a gym scoreboard). The REP cell counts the page's real sections
// ([data-section]) and shows which one is on screen. Motion M283: every changed digit / letter rolls in its own
// clipped cell with a springy overshoot (RollText "slot").
import { useEffect, useState } from "react";
import { nav } from "@/site/content";
import RollText from "./RollText";

const pad = (n: number) => String(n).padStart(2, "0");


export default function ScoreNav() {
  const [rep, setRep] = useState({ i: 1, n: 0, name: "" });

  useEffect(() => {
    const secs = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const n = secs.length;
    const update = () => {
      const mid = window.innerHeight * 0.5;
      let i = 0;
      secs.forEach((s, k) => {
        if (s.getBoundingClientRect().top <= mid) i = k;
      });
      const name = secs[i]?.getAttribute("data-section") ?? "";
      setRep((r) => (r.i === i + 1 && r.n === n && r.name === name ? r : { i: i + 1, n, name }));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[64px] border-b-2 border-[var(--rule)] bg-[#111110] text-fg">
      <a href="#lift" className="rule-r flex items-center px-6">
        <span className="stamp text-[20px] tracking-[-0.02em]">{nav.brand}</span>
      </a>
      {nav.links.map((l) => (
        <a key={l.href} href={l.href} className="nav-cell rule-r mono-s flex items-center px-6 text-fg/80 hover:bg-[var(--chalk)] hover:text-[var(--chalk-ink)]">
          {l.label}
        </a>
      ))}
      <div className="flex-1" />
      <div className="rule-l flex min-w-[260px] items-center gap-4 px-6" aria-label={`Section ${rep.i} of ${rep.n}`}>
        <span className="mono-s text-muted">Rep</span>
        <span className="mono text-[18px] tabular-nums">
          <RollText text={pad(rep.i)} />
          <span className="text-muted"> / </span>
          <RollText text={pad(rep.n)} />
        </span>
        <RollText text={rep.name.toUpperCase()} className="mono-s overflow-hidden whitespace-nowrap text-muted" />
      </div>
      <a href="#plans" className="ibtn ibtn-blue press3d h-full rounded-none px-8" data-cursor="Book" data-hover data-press data-nav-book>
        {nav.cta}
      </a>
    </header>
  );
}

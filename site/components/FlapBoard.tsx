"use client";

// Timetable + booking (layout EV06 month-grid calendar, restyled as ONE week on a dark split-flap board: day columns
// × time rows, class name + spots left in each cell, a booking ticket on the right).
// Motion M371 (Round 3): class names flip through glyphs into their cells, column by column; in ?record=1 a scripted
// cursor books THU 06:00 Barbell Club (spots 3 → 2, the ticket prints PLATFORM 4 · BOOKED).
// Round 1 / ?static=1: the board is filled, Thu 06:00 is picked, the ticket shows it ready to book.
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { timetable } from "@/site/content";
import RollText from "./RollText";
import SwapText from "./SwapText";

const FLAP_GLYPHS = "ABCDEFGHKLMNOPRSTUVWXYZ0123456789";
const scramble = (len: number) => Array.from({ length: len }, () => (Math.random() < 0.15 ? " " : FLAP_GLYPHS[Math.floor(Math.random() * FLAP_GLYPHS.length)])).join("");

export default function FlapBoard() {
  const { days, times, classes, pick, ticket } = timetable;
  const at = (d: number, t: number) => classes.find((c) => c[0] === d && c[1] === t);
  const picked = at(pick.day, pick.time)!;
  const root = useRef<HTMLElement>(null);
  const [booked, setBooked] = useState(false);
  const spots = picked[3] - (booked ? 1 : 0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current!;
    // M371 split-flap: names flip through 3 random glyph rows (60 ms a flip, a half-fold on X) and land,
    // column by column like a departures board. Each cell ≤ 0.25 s of glyphs (lesson 63).
    const names = Array.from(el.querySelectorAll<HTMLElement>(".flap-name"));
    const real = names.map((n) => n.textContent ?? "");
    const flip = gsap.timeline({ paused: true });
    names.forEach((n, k) => {
      const col = Number(n.closest<HTMLElement>("[data-cell]")!.dataset.cell!.split("-")[0]);
      const t0 = col * 0.09 + (k % 3) * 0.02;
      for (let f = 0; f < 3; f++) {
        flip.call(() => (n.textContent = scramble(real[k].length)), [], t0 + f * 0.06);
        flip.fromTo(n, { rotationX: -80 }, { rotationX: 0, duration: 0.06, ease: "none" }, t0 + f * 0.06);
      }
      flip.call(() => (n.textContent = real[k]), [], t0 + 0.18);
      flip.fromTo(n, { rotationX: -80 }, { rotationX: 0, duration: 0.12, ease: "power2.out" }, t0 + 0.18);
    });
    const st = ScrollTrigger.create({ trigger: el, start: "top 72%", once: true, onEnter: () => flip.play() });

    return () => {
      st.kill();
      flip.kill();
    };
  }, [pick.day, pick.time]);

  return (
    <section ref={root} id="timetable" data-section="Timetable" className="relative z-[30] bg-bg px-[64px] pb-[110px] pt-[120px]" data-record-time={2.0} data-record-hold={0.3} data-record-label="timetable">
      <div className="rule-b mb-8 flex items-end justify-between pb-6">
        <h2 className="stamp text-[80px]">
          {timetable.title[0]}
          <br />
          {timetable.title[1]}
        </h2>
        <p className="mono-s pb-2 text-muted">Week 41 · live spots · tap a class to book</p>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-[32px]">
        <div className="board bg-[#0c0c0b] p-3" role="table" aria-label="Weekly timetable">
          <div className="grid grid-cols-[72px_repeat(7,1fr)] gap-[4px]">
            <span />
            {days.map((d) => (
              <span key={d} className="mono-s py-2 text-center text-muted">
                {d}
              </span>
            ))}
            {times.map((t, ti) => (
              <div key={t} className="contents">
                <span className="mono flex items-center text-[15px] text-muted">{t}</span>
                {days.map((d, di) => {
                  const c = at(di, ti);
                  const isPick = di === pick.day && ti === pick.time;
                  return (
                    <div
                      key={d + t}
                      className={`flap flex h-[76px] flex-col justify-center px-3 ${isPick ? "is-pick" : ""}`}
                      data-cell={`${di}-${ti}`}
                      data-cursor={c ? "Book" : undefined}
                      data-press={c ? "" : undefined}
                    >
                      {c ? (
                        <>
                          <span className="stamp-n flap-name relative z-[1] block text-[16px] leading-[1.05]" style={{ fontStretch: "85%", transformOrigin: "50% 50%" }}>
                            {c[2]}
                          </span>
                          <span className={`mono-s relative z-[1] mt-1 ${c[3] <= 2 ? "text-[var(--plate-yellow)]" : "text-muted"}`}>
                            {isPick ? <RollText text={`${spots} spots`} mode="slot" /> : `${c[3]} spots`}
                          </span>
                        </>
                      ) : (
                        <span className="mono-s relative z-[1] text-[#3f3d39]">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* booking ticket */}
        <aside className="ticket self-start bg-[var(--chalk)] p-7 text-[var(--chalk-ink)]">
          <p className="mono-s text-[#5b5850]">Booking</p>
          <p className="stamp mt-3 text-[38px]">{picked[2]}</p>
          <dl className="mt-6 space-y-3 border-t-2 border-[#b9b5ad] pt-5">
            <div className="flex justify-between">
              <dt className="mono-s text-[#5b5850]">Day</dt>
              <dd className="mono-s">{days[pick.day]} · {times[pick.time]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="mono-s text-[#5b5850]">Coach</dt>
              <dd className="mono-s">{ticket.coach}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="mono-s text-[#5b5850]">Spots left</dt>
              <dd className="mono-s" data-spots>
                <RollText text={String(spots)} mode="slot" />
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => setBooked(true)}
            className={`ibtn mt-7 w-full justify-between transition-colors duration-300 ${booked ? "bg-[var(--chalk-ink)] text-[var(--chalk)]" : "ibtn-blue"}`}
            data-book
            data-hover
            data-press
            data-click
          >
            <SwapText text={booked ? `${ticket.platform} · Booked` : `Book ${ticket.platform}`} />
            <span className={booked ? "text-[18px]" : "arrow"}>{booked ? "✓" : ""}</span>
          </button>
        </aside>
      </div>
    </section>
  );
}

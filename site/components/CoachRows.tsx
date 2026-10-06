"use client";

// Coaches (layout TM02 staff directory rows with a cursor portrait, restyled: ruled rows of name + best lifts, and the
// "portrait" that follows the pointer is each coach's gear in a 3:4 steel-bezel frame; no faces).
// Motion M160 (Round 3): the gear photo follows the pointer; in ?record=1 a scripted pointer walks the rows.
// Round 1 / ?static=1: the first row is active and the frame rests beside it.
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { coaches } from "@/site/content";

export default function CoachRows() {
  const [active, setActive] = useState(0);
  const table = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tb = table.current!;
    const fr = frame.current!;
    const rows = Array.from(tb.querySelectorAll<HTMLElement>(".coach-row"));
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0, init: false };
    let cur = 0;
    // where the frame rests beside row k: right column, centred on the row (clamped inside the table)
    const restAt = (k: number, px?: number) => {
      const row = rows[k];
      const fh = fr.offsetHeight;
      target.y = Math.max(0, Math.min(tb.clientHeight - fh, row.offsetTop + row.offsetHeight / 2 - fh / 2));
      target.x = px ?? tb.clientWidth - fr.offsetWidth - 110;
    };
    const pick = (k: number) => {
      if (k === cur) return;
      cur = k;
      setActive(k);
    };
    restAt(0);
    // the real pointer: the frame follows it inside the right column, the row under it lights
    const onMove = (e: PointerEvent) => {
      const b = tb.getBoundingClientRect();
      const y = e.clientY - b.top;
      const k = rows.findIndex((r) => y >= r.offsetTop && y < r.offsetTop + r.offsetHeight);
      if (k >= 0) pick(k);
      const fx = Math.max(tb.clientWidth * 0.55, Math.min(tb.clientWidth - fr.offsetWidth, e.clientX - b.left - fr.offsetWidth / 2));
      target.x = fx;
      target.y = Math.max(0, Math.min(tb.clientHeight - fr.offsetHeight, y - fr.offsetHeight / 2));
    };
    tb.addEventListener("pointermove", onMove);
    // ease the frame toward its target every frame (frame-rate independent), with a small lean while it travels
    const tick = (_t: number, dtMs: number) => {
      const k = 1 - Math.pow(0.002, dtMs / 1000);
      if (!pos.init) Object.assign(pos, { x: target.x, y: target.y, init: true });
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      fr.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0) rotate(${((target.y - pos.y) * 0.02).toFixed(2)}deg)`;
    };
    // the frame only eases while the coaches are near the screen
    let running = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) gsap.ticker.add(tick);
      if (!e.isIntersecting && running) gsap.ticker.remove(tick);
      running = e.isIntersecting;
    });
    io.observe(tb);

    // ?record=1: the fake pointer (site/lib/fakePointer.ts, scripted in RecordScripts) drives it like a real one
    const onFake = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number; on: boolean }>).detail;
      const b = tb.getBoundingClientRect();
      if (d.on && d.y > b.top && d.y < b.bottom) onMove({ clientX: d.x, clientY: d.y } as PointerEvent);
    };
    window.addEventListener("iron:pointer", onFake);
    return () => {
      tb.removeEventListener("pointermove", onMove);
      window.removeEventListener("iron:pointer", onFake);
      io.disconnect();
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <section id="coaches" data-section="Coaches" className="relative z-[20] bg-bg px-[64px] pb-[120px] pt-[120px]" data-record-time={2.0} data-record-hold={0.8} data-record-label="coaches">
      {/* the new hard light the coaches come up under (X12) */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[60%] w-[60%] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(236,233,226,0.1),transparent_70%)]" />
      <div data-light className="relative">
      <div className="rule-b flex items-end justify-between pb-6">
        <h2 className="stamp text-[88px]">
          {coaches.title[0]}
          <br />
          <span className="text-muted">{coaches.title[1]}</span>
        </h2>
        <p className="max-w-[340px] pb-2 text-[18px] leading-[1.45] text-fg/80">{coaches.sub}</p>
      </div>

      <div ref={table} className="coach-table relative">
        <div className="grid h-[48px] grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,1fr)_minmax(0,5fr)] items-center">
          <span className="mono-s text-muted">Coach · best lifts (kg)</span>
          <span className="mono-s text-muted">Discipline</span>
          <span className="mono-s text-muted">Years</span>
          <span />
        </div>
        {coaches.items.map((c, k) => (
          <div
            key={c.name}
            data-row={k}
            className={`coach-row grid h-[120px] transition-colors duration-300 grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,1fr)_minmax(0,5fr)] items-center border-t-2 border-[var(--rule)] ${k === coaches.items.length - 1 ? "border-b-2" : ""} ${k === active ? "is-active" : ""}`}
            data-cursor="Gear"
          >
            <div className="pl-4">
              <span className="stamp block text-[40px]">{c.name}</span>
              <span className="mono-s mt-2 block text-muted">{c.lifts}</span>
            </div>
            <span className="text-[18px]">{c.role}</span>
            <span className="mono text-[18px]">{c.years}</span>
            <span />
          </div>
        ))}

        {/* the gear frame (3:4) that follows the pointer, riding in the right column */}
        <div
          aria-hidden
          ref={frame}
          className="coach-frame pointer-events-none absolute left-0 top-0 z-10 w-[300px] [html.is-static_&]:left-auto [html.is-static_&]:right-[110px] [html.is-static_&]:top-[40px]"
        >
          <div className="bezel">
            <div className="bezel-inner relative aspect-[3/4]">
              {coaches.items.map((c, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={c.name} src={c.gear} alt="" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${k === active ? "opacity-100" : "opacity-0"}`} />
              ))}
              <span className="mono-s absolute bottom-0 left-0 right-0 bg-[rgba(17,17,16,0.85)] px-4 py-3">
                {coaches.items[active].name.split(" ")[0]}&apos;s kit
              </span>
            </div>
            <span className="glint" />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

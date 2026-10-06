"use client";

// ?record=1 only (lesson 75): every hover / click detail plays once by itself, with one fake pointer
// (site/lib/fakePointer.ts) that behaves like a real hover: labels from data-cursor, .is-hover, magnets, presses.
// Each step starts from a ScrollTrigger (or the plate lifting), so it also fills the arrival, and lands inside the
// section's hold (lesson 74). Normal mode: nothing here runs.
import { useEffect } from "react";
import { gsap, isRecording, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { onPlateLifting } from "@/site/lib/plate";
import { at, pointerHide, pointerPress, pointerTo } from "@/site/lib/fakePointer";

export default function RecordScripts() {
  useEffect(() => {
    if (!isRecording() || prefersReducedMotion()) return;
    const tls: gsap.core.Timeline[] = [];
    const sts: ScrollTrigger[] = [];
    const script = (build: (tl: gsap.core.Timeline) => void) => {
      const tl = gsap.timeline({ paused: true });
      build(tl);
      tls.push(tl);
      return tl;
    };
    const on = (vars: ScrollTrigger.Vars, tl: gsap.core.Timeline) => sts.push(ScrollTrigger.create({ once: true, ...vars, onEnter: () => tl.play() }));

    // hero: the pointer visits the nav's Book cell (chalk wipe), presses it (U120), and leaves
    const nav = script((tl) =>
      tl
        .add(pointerTo(at("[data-nav-book]", 0.42, 0.55), 0.6))
        .add(() => pointerPress(), "+=0.3")
        .add(pointerTo(() => ({ x: window.innerWidth * 0.78, y: window.innerHeight * 0.42 }), 0.5), "+=0.25")
        .add(() => pointerHide()),
    );
    const offPlate = onPlateLifting(() => gsap.delayedCall(2.4, () => nav.play()));

    // signature: "Load" label rides over the bar while the plates go on, drifting slowly
    const load = script((tl) =>
      tl
        .add(pointerTo(at("#load svg", 0.5, 0.5), 0.5))
        .add(pointerTo(at("#load svg", 0.6, 0.46), 2.4, "sine.inOut"))
        .add(pointerTo(at("#load svg", 0.42, 0.52), 2.4, "sine.inOut")),
    );
    on({ trigger: "#load", start: "top top" }, load);
    sts.push(ScrollTrigger.create({ trigger: "#load", start: "bottom bottom", once: true, onEnter: () => pointerHide() }));

    // coaches: the pointer walks down the four rows ("Gear"), the gear frame follows it
    const rows = () => Array.from(document.querySelectorAll<HTMLElement>("#coaches .coach-row"));
    const coach = script((tl) => {
      for (let k = 0; k < 4; k++) tl.add(pointerTo(() => at(rows()[k], 0.62 + (k % 2) * 0.08, 0.5)(), 0.36), k === 0 ? 0 : "+=0.1");
      tl.add(() => pointerHide(), "+=0.2");
    });
    on({ trigger: "#coaches .coach-table", start: "top 95%" }, coach);

    // membership: picks Quarterly, then Lifer (the total's digits slide), then leans on Join now (magnet + wipe)
    const plans = script((tl) =>
      tl
        .add(pointerTo(at("[data-plan='quarter']", 0.3, 0.5), 0.36))
        .add(() => pointerPress(), "+=0.04")
        .add(pointerTo(at("[data-plan='lifer']", 0.34, 0.5), 0.3), "+=0.22")
        .add(() => pointerPress(), "+=0.04")
        .add(pointerTo(at("[data-join]", 0.62, 0.5), 0.34), "+=0.22")
        .add(() => pointerHide(), "+=0.3"),
    );
    on({ trigger: "#plans", start: "top 72%" }, plans);

    // timetable: books THU 06:00 Barbell Club ("Book" label on the cell), then the ticket's button
    const book = script((tl) =>
      tl
        .add(pointerTo(at("[data-cell='3-0']", 0.5, 0.55), 0.5))
        .add(() => pointerPress(), "+=0.08")
        .add(pointerTo(at("[data-book]", 0.4, 0.5), 0.42), "+=0.12")
        .add(() => pointerPress(), "+=0.08")
        .add(() => pointerHide(), "+=0.35"),
    );
    on({ trigger: "#timetable", start: "top 62%" }, book);

    // join band: the pointer pulls the magnetic CTA, the chalk-ink fill wipes, a press
    const join = script((tl) =>
      tl
        .add(pointerTo(at("[data-join-cta]", 0.64, 0.5), 0.45))
        .add(() => pointerPress(), "+=0.25")
        .add(() => pointerHide(), "+=0.2"),
    );
    on({ trigger: "#join", start: "top 10%" }, join);

    // footer: sweeps through the plate pile (PileFooter shoves the plates at the same moment), then rests on a
    // link whose underline draws
    const foot = script((tl) =>
      tl
        .add(pointerTo(at("[data-pile]", 0.1, 0.72), 0.3))
        .add(pointerTo(at("[data-pile]", 0.9, 0.72), 0.9, "none"))
        .add(pointerTo(at("footer .fl-link", 0.5, 0.5), 0.5), "+=0.1"),
    );
    sts.push(ScrollTrigger.create({ trigger: "#join", start: "bottom 98%", once: true, onEnter: () => gsap.delayedCall(1.3, () => foot.play()) }));

    return () => {
      offPlate();
      tls.forEach((t) => t.kill());
      sts.forEach((s) => s.kill());
    };
  }, []);
  return null;
}

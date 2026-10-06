"use client";

// ?record=1 only: one scripted pointer that behaves like a real hover (lesson 75: hands-free demos in record mode
// only). Wherever it is, it finds the element under it and
//   · shows that element's data-cursor label (the engine cursor is hidden while recording)
//   · puts .is-hover on the nearest [data-hover] (buttons, links: the chalk wipe, the underline draw)
//   · tells magnets where it is (event "iron:pointer"), so magnetic buttons lean toward it
// press() sinks the nearest [data-press] (the 3D press) and plays a ring pulse.
// The visual (ring + label pill) lives in site/components/FakeCursor.tsx.
import { gsap } from "@/lib/gsap";

type Pt = { x: number; y: number };
const state = { x: -100, y: -100, on: false, label: "", hover: null as HTMLElement | null, anchor: null as null | (() => Pt), from: { x: 0, y: 0 }, k: 1 };
let el: HTMLElement | null = null;
let labelEl: HTMLElement | null = null;

export function attachFakeCursor(root: HTMLElement, label: HTMLElement) {
  el = root;
  labelEl = label;
}

const sense = () => {
  if (!el) return;
  if (state.anchor) {
    const t = state.anchor();
    state.x = state.from.x + (t.x - state.from.x) * state.k;
    state.y = state.from.y + (t.y - state.from.y) * state.k;
  }
  el.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
  const under = state.on ? document.elementFromPoint(state.x, state.y) : null;
  const lab = (under?.closest("[data-cursor]") as HTMLElement | null)?.dataset.cursor ?? "";
  if (lab !== state.label && labelEl) {
    state.label = lab;
    labelEl.textContent = lab;
    gsap.to(labelEl, { opacity: lab ? 1 : 0, scale: lab ? 1 : 0.9, duration: 0.2, ease: "power2.out", overwrite: true });
  }
  const hov = (under?.closest("[data-hover]") as HTMLElement | null) ?? null;
  if (hov !== state.hover) {
    state.hover?.classList.remove("is-hover");
    hov?.classList.add("is-hover");
    state.hover = hov;
  }
  window.dispatchEvent(new CustomEvent("iron:pointer", { detail: { x: state.x, y: state.y, on: state.on } }));
};

/** Glide to a point (viewport px) over `dur` seconds. */
export function pointerTo(p: Pt | (() => Pt), dur = 0.5, ease = "power2.inOut") {
  // built when the page mounts (before the cursor element exists): everything is resolved when it PLAYS.
  // The target is followed LIVE (the page keeps scrolling under it) and stays anchored after arrival, like a hand
  // resting on a button, until the next move.
  const tl = gsap.timeline();
  tl.call(() => {
    if (!el) return;
    const target = typeof p === "function" ? p : () => p;
    if (!state.on) {
      state.on = true;
      const t = target();
      state.x = t.x + 160;
      state.y = t.y + 120;
      gsap.to(el, { opacity: 1, duration: 0.15 });
    }
    state.anchor = target;
    state.from = { x: state.x, y: state.y };
    state.k = 0;
    gsap.to(state, { k: 1, duration: dur, ease, overwrite: true });
  });
  tl.to({}, { duration: dur });
  return tl;
}

/** Centre of an element (or a point inside it, fx/fy as fractions). */
export const at = (sel: string | HTMLElement, fx = 0.5, fy = 0.5) => () => {
  const t = typeof sel === "string" ? document.querySelector<HTMLElement>(sel) : sel;
  const r = t?.getBoundingClientRect();
  return r ? { x: r.left + r.width * fx, y: r.top + r.height * fy } : { x: state.x, y: state.y };
};

/** Press whatever is under the pointer: the ring pulses and the nearest [data-press] sinks and springs back. */
export function pointerPress() {
  if (!el) return;
  gsap.fromTo(el.firstElementChild, { scale: 1 }, { scale: 0.7, duration: 0.09, yoyo: true, repeat: 1, ease: "power2.out" });
  const under = document.elementFromPoint(state.x, state.y)?.closest<HTMLElement>("[data-press]");
  if (under) {
    under.classList.add("is-press");
    window.setTimeout(() => under.classList.remove("is-press"), 160);
    if (under.hasAttribute("data-click")) under.click();
  }
}

export function pointerHide() {
  if (!el) return;
  state.anchor = null;
  state.on = false;
  sense();
  gsap.to(el, { opacity: 0, duration: 0.25 });
}

/** Keep sensing while the page scrolls under a resting pointer (the label/hover follow what passes beneath). */
export function pointerSense() {
  if (state.on) sense();
}

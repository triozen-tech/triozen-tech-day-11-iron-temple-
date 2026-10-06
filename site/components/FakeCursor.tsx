"use client";

// The record-mode pointer (site/lib/fakePointer.ts): a chalk ring + a label pill, like the engine cursor that is
// hidden while recording. Mounted only in ?record=1.
import { useEffect, useRef, useState } from "react";
import { gsap, isRecording, prefersReducedMotion } from "@/lib/gsap";
import { attachFakeCursor, pointerSense } from "@/site/lib/fakePointer";

export default function FakeCursor() {
  const [on, setOn] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isRecording() && !prefersReducedMotion()) setOn(true);
  }, []);

  useEffect(() => {
    if (!on) return;
    attachFakeCursor(root.current!, label.current!);
    gsap.ticker.add(pointerSense);
    return () => gsap.ticker.remove(pointerSense);
  }, [on]);

  if (!on) return null;
  return (
    // clipped to the viewport: a fixed element hanging past the screen edge makes the capture taller (1278×900)
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
      <div ref={root} className="absolute left-0 top-0 opacity-0">
        <div className="-ml-[14px] -mt-[14px] h-[28px] w-[28px] rounded-full border-2 border-[var(--chalk)] bg-[rgba(236,233,226,0.18)] shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
        <span ref={label} className="mono-s absolute left-[20px] top-[14px] whitespace-nowrap bg-[var(--plate-blue)] px-3 py-1.5 text-[var(--text)] opacity-0">
          {""}
        </span>
      </div>
    </div>
  );
}

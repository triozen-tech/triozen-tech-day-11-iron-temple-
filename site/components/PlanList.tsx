"use client";

// Membership (layout PR14 radio plan list, restyled on the chalk band: ruled plan rows with square radios on the
// left, a total card with a big ₹ price on the right). Motion M133 (Round 3): the selected plan steps down the list
// in ?record=1 and the total's digits slide to the new price. ?static=1: Monthly selected.
import { useRef, useState } from "react";
import { plans } from "@/site/content";
import RollText from "./RollText";
import SwapText from "./SwapText";
import Odo from "./Odo";
import Magnet from "./Magnet";

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function PlanList() {
  const [sel, setSel] = useState(plans.selected);
  const plan = plans.items.find((p) => p.id === sel)!;
  const root = useRef<HTMLElement>(null);

  return (
    <section ref={root} id="plans" data-section="Membership" className="band-chalk relative z-[30] px-[64px] pb-[110px] pt-[120px]" data-record-time={2.0} data-record-hold={0.6} data-record-label="plans">
      <div className="grid grid-cols-[1fr_440px] gap-[64px]">
        <div>
          <div className="rule-b pb-6">
            <h2 className="stamp text-[80px]">
              {plans.title[0]}
              <br />
              {plans.title[1]}
            </h2>
          </div>
          <div role="radiogroup" aria-label="Membership plans">
            {plans.items.map((p) => {
              const on = p.id === sel;
              return (
                <button
                  key={p.id}
                  role="radio"
                  aria-checked={on}
                  onClick={() => setSel(p.id)}
                  data-press
                  data-click
                  data-plan={p.id}
                  className={`plan-row grid h-[92px] transition-colors duration-300 w-full grid-cols-[56px_1fr_auto] items-center border-b-2 border-[var(--rule)] text-left ${on ? "is-on" : ""}`}
                >
                  <span className={`grid h-[26px] w-[26px] place-items-center border-2 border-[var(--chalk-ink)]`}>
                    <span className={`h-[12px] w-[12px] transition-transform duration-300 ${on ? "scale-100 bg-[var(--plate-blue)]" : "scale-0 bg-[var(--plate-blue)]"}`} />
                  </span>
                  <span>
                    <span className="stamp-n block text-[30px]">{p.name}</span>
                    <span className="mono-s mt-1 block text-[#5b5850]">{p.note}</span>
                  </span>
                  <span className="text-right">
                    <span className="stamp-n block text-[30px] tabular-nums">
                      <Odo text={inr(p.price)} start="top 85%" duration={1.2} />
                    </span>
                    <span className="mono-s block text-[#5b5850]">{p.per}</span>
                  </span>
                </button>
              );
            })}
            <div className="grid h-[72px] grid-cols-[56px_1fr_auto] items-center text-[#5b5850]">
              <span className="mono text-[20px]">+</span>
              <span className="stamp-n text-[22px]">{plans.addon.name}</span>
              <span className="mono-s">
                {plans.addon.price} · {plans.addon.per}
              </span>
            </div>
            <p className="mono-s mt-2 text-[#5b5850]">{plans.small}</p>
          </div>
        </div>

        {/* total card */}
        <aside className="self-start bg-[var(--chalk-ink)] p-9 text-[var(--text)]">
          <p className="mono-s text-muted">Your plan</p>
          <p className="stamp-n mt-3 text-[34px]">
            <SwapText text={plan.name} />
          </p>
          <div className="mt-8 border-t-2 border-[var(--rule)] pt-6">
            <p className="mono-s text-muted">Total today</p>
            <p className="stamp mt-2 text-[72px] leading-[1] tabular-nums" data-total>
              <RollText text={inr(plan.price)} mode="slide" />
            </p>
            <p className="mono-s mt-1 text-muted">
              <SwapText text={`${plan.per} · no joining fee`} />
            </p>
          </div>
          <ul className="mono-s mt-8 space-y-3 text-fg/80">
            <li>· Full floor, 05:00–23:00</li>
            <li>· Chalk, bands, belts on the house</li>
            <li>· Induction with a coach</li>
          </ul>
          <Magnet strength={0.12} className="mt-9 w-full">
            <a href="#timetable" className="ibtn ibtn-blue w-full justify-between" data-hover data-join>
              {plans.cta} <span className="arrow" />
            </a>
          </Magnet>
        </aside>
      </div>
    </section>
  );
}

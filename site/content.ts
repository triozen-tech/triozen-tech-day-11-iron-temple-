// All text + data for Iron Temple (fictional strength gym, concept site, prices in ₹).

export const IMG = "/images/iron-temple";

export const studio = "Triozen Tech";

export const nav = {
  brand: "Iron Temple",
  links: [
    { label: "Programmes", href: "#programmes" },
    { label: "Floor", href: "#floor" },
    { label: "Coaches", href: "#coaches" },
    { label: "Plans", href: "#plans" },
    { label: "Timetable", href: "#timetable" },
  ],
  cta: "Book a trial",
};

export const hero = {
  lines: ["Lift", "Heavy.", "Rest. Repeat."],
  sub: "A strength gym for people who came to lift. Six platforms, real coaching, chalk on the house.",
  strip: [
    { k: "Floor", v: "2,400 sq ft" },
    { k: "Platforms", v: "6" },
    { k: "Racks", v: "10" },
    { k: "Dumbbells", v: "to 60 kg" },
    { k: "Open", v: "05:00–23:00" },
  ],
  cta: "Book a trial",
};

export const rules = {
  label: "House rules",
  items: ["Chalk is free.", "Re-rack your weight.", "No mirrors on the platform.", "Coaches watch every rep.", "Earn the plates."],
};

export const programmes = {
  title: ["Four ways", "to get strong."],
  items: [
    { name: "Strength", img: "/images/iron-temple/prog-strength.webp", weeks: "12 weeks", sessions: "4 / week", focus: "Squat · Bench · Deadlift", note: "Linear blocks, tested every 4th week." },
    { name: "Olympic Lifting", img: "/images/iron-temple/prog-oly.webp", weeks: "10 weeks", sessions: "3 / week", focus: "Snatch · Clean & jerk", note: "Technique first, then load." },
    { name: "Hypertrophy", img: "/images/iron-temple/prog-hypertrophy.webp", weeks: "8 weeks", sessions: "5 / week", focus: "Volume · Tempo · Pump", note: "Built for size, logged to the gram." },
    { name: "Conditioning", img: "/images/iron-temple/prog-conditioning.webp", weeks: "6 weeks", sessions: "3 / week", focus: "Sled · Rower · Carries", note: "An engine for the heavy days." },
  ],
  tag: "Included in Monthly and up",
};

export const floor = {
  title: ["The floor."],
  sub: "Built for lifting, not for selfies.",
  zones: [
    { name: "Platforms", img: "/images/iron-temple/floor-platforms.webp", n: "6", unit: "oak" },
    { name: "Rack row", img: "/images/iron-temple/floor-racks.webp", n: "10", unit: "racks" },
    { name: "Dumbbells", img: "/images/iron-temple/floor-dumbbells.webp", n: "60", unit: "kg" },
    { name: "Sled turf", img: "/images/iron-temple/floor-turf.webp", n: "30", unit: "m" },
    { name: "Chalk", img: "/images/iron-temple/floor-chalk.webp", n: "∞", unit: "free" },
    { name: "Recovery", img: "/images/iron-temple/floor-recovery.webp", n: "4", unit: "°C" },
  ],
};

/** Competition plates (IWF colours). thick/height in mm: bumpers share one 450 mm diameter. */
export const plates = [
  { kg: 25, color: "#C8322A", ink: "#F2EEE6", thick: 64, dia: 450 },
  { kg: 20, color: "#2F55E4", ink: "#F2EEE6", thick: 54, dia: 450 },
  { kg: 15, color: "#E2B42B", ink: "#151413", thick: 44, dia: 450 },
  { kg: 10, color: "#2F7D4A", ink: "#F2EEE6", thick: 36, dia: 450 },
  { kg: 5, color: "#E8E6E0", ink: "#151413", thick: 28, dia: 325 },
] as const;

export const loadBar = {
  label: "Load the bar",
  title: ["Load", "the bar."],
  barKg: 20,
  end: "Week one.",
  sub: "Every member starts on the empty bar. We add the plates when you're ready for them.",
};

export const coaches = {
  title: ["Coaches.", "No ego."],
  sub: "Every coach still competes. Their gear tells you more than a headshot would.",
  items: [
    { name: "Arjun Rao", role: "Head of strength", lifts: "DL 260 · SQ 205 · BP 140", gear: "/images/iron-temple/coach-belt.webp", years: "14 yrs" },
    { name: "Meera Iyer", role: "Olympic lifting", lifts: "SN 82 · C&J 104", gear: "/images/iron-temple/coach-shoes.webp", years: "9 yrs" },
    { name: "Kabir Sethi", role: "Powerlifting", lifts: "DL 290 · SQ 240 · BP 165", gear: "/images/iron-temple/coach-wraps.webp", years: "11 yrs" },
    { name: "Tara Menon", role: "Programming + conditioning", lifts: "DL 180 · Row 2k 7:02", gear: "/images/iron-temple/coach-logbook.webp", years: "8 yrs" },
  ],
};

export const plans = {
  title: ["Pick your", "membership."],
  items: [
    { id: "day", name: "Day pass", price: 499, per: "one day", note: "Full floor, chalk included" },
    { id: "month", name: "Monthly", price: 3499, per: "per month", note: "Floor + all programmes" },
    { id: "quarter", name: "Quarterly", price: 8999, per: "3 months", note: "Save ₹1,498 · one form check a month" },
    { id: "lifer", name: "Annual “Lifer”", price: 29999, per: "12 months", note: "Save ₹11,989 · locker + 4 coached sessions" },
  ],
  addon: { name: "Coaching add-on", price: "₹1,200", per: "per 1:1 session" },
  selected: "month",
  cta: "Join now",
  small: "No joining fee. Freeze up to 30 days a year.",
};

export const timetable = {
  title: ["This week", "on the floor."],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  times: ["06:00", "07:30", "12:30", "18:00", "19:30"],
  // [day index, time index, class, spots]
  classes: [
    [0, 0, "Barbell Club", 4], [2, 0, "Barbell Club", 2], [4, 0, "Barbell Club", 5], [3, 0, "Barbell Club", 3],
    [1, 1, "Oly Technique", 6], [3, 1, "Oly Technique", 3], [5, 1, "Strongman", 8],
    [0, 2, "Engine", 9], [2, 2, "Engine", 7], [4, 2, "Mobility", 10],
    [0, 3, "Oly Technique", 2], [1, 3, "Barbell Club", 1], [2, 3, "Strongman", 6], [3, 3, "Engine", 5], [4, 3, "Barbell Club", 4],
    [0, 4, "Mobility", 12], [2, 4, "Mobility", 11], [5, 3, "Open Platform", 6], [6, 1, "Mobility", 12],
  ] as [number, number, string, number][],
  pick: { day: 3, time: 0 },
  ticket: { platform: "Platform 4", coach: "Arjun Rao" },
};

export const join = { lines: ["First session", "on us."], cta: "Book a trial", sub: "Bring shoes. We have the chalk." };

export const footer = {
  cols: [
    { t: "Train", l: ["Programmes", "Timetable", "Coaching", "Open platform"] },
    { t: "Visit", l: ["The floor", "Hours 05:00–23:00", "Parking", "Day pass"] },
    { t: "Members", l: ["Plans", "Freeze membership", "Locker hire", "Contact"] },
  ],
  words: ["CHALK", "REST", "REPEAT", "LIFT", "EAT"],
};

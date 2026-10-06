import type { SiteMeta, Theme } from "@/lib/site";

// Iron Temple · Day 11 · fictional strength gym (concept site). Direction: site/DESIGN.md.

export const meta: SiteMeta = {
  name: "Iron Temple",
  title: "Iron Temple · Strength gym",
  description: "A strength gym for people who came to lift. Six platforms, real coaching, chalk on the house. Concept website.",
  loaderText: "Iron Temple",
  // the site has its own loader (site/components/PlateLoader.tsx, I16): the engine loader is off
  loader: false,
  cursor: true,
  record: { duration: 36 },
};

export const theme: Theme = {
  bg: "#111110",
  surface: "#1B1A18",
  text: "#ECE9E2",
  muted: "#9B978E",
  accent: "#2F55E4",
  accentText: "#ECE9E2",
  line: "#34322E",
  fontDisplay: "'Archivo Variable', 'Archivo', sans-serif",
  fontBody: "'Archivo Variable', 'Archivo', sans-serif",
  radius: 0,
  uppercaseHeadings: true,
  heroText: "#ECE9E2",
};

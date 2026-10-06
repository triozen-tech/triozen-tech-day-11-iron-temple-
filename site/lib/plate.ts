"use client";

// The site's own "the loader is lifting" signal. The engine loader is off (site.ts loader: false), and then the engine
// marks the site ready at mount, long before PlateLoader has gone. Anything that must start as the hero is revealed
// (the film's intro, the hero entrance) listens here instead of onSiteReady.
let lifted = false;

export function markPlateLifting() {
  if (lifted) return;
  lifted = true;
  window.dispatchEvent(new Event("iron:plate"));
}

/** Run once the chalk plate starts wiping off (immediately if it already has). */
export function onPlateLifting(fn: () => void) {
  if (lifted) {
    fn();
    return () => {};
  }
  const h = () => fn();
  window.addEventListener("iron:plate", h, { once: true });
  return () => window.removeEventListener("iron:plate", h);
}

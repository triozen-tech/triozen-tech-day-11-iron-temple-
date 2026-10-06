// Code-drawn competition plates + barbell (SVG). One source for the signature (Load the bar) and the footer pile.
// Matte rubber: a shared feTurbulence grain + a hard top-light highlight; steel hubs; kg stencilled on the rim.
import { plates } from "@/site/content";

export type PlateSpec = (typeof plates)[number];

/** px per mm on the bar stage (the bar is 2200 mm long) */
export const MM = 0.56;

/** <defs> every plate/bar SVG needs once: rubber grain, steel gradients, top light. */
export function PlateDefs({ id = "it" }: { id?: string }) {
  return (
    <defs>
      <filter id={`${id}-rubber`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="7" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 0.62" result="g" />
        <feComposite in="g" in2="SourceGraphic" operator="in" result="gi" />
        <feBlend in="SourceGraphic" in2="gi" mode="multiply" />
      </filter>
      <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d9d6d0" />
        <stop offset="0.35" stopColor="#9a968f" />
        <stop offset="0.55" stopColor="#55524d" />
        <stop offset="1" stopColor="#2b2a27" />
      </linearGradient>
      <linearGradient id={`${id}-sleeve`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#efece6" />
        <stop offset="0.3" stopColor="#b8b4ad" />
        <stop offset="0.7" stopColor="#5e5b56" />
        <stop offset="1" stopColor="#34322e" />
      </linearGradient>
      <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
        <stop offset="0.18" stopColor="#fff" stopOpacity="0.06" />
        <stop offset="0.7" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.45" />
      </linearGradient>
      <pattern id={`${id}-knurl`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="5" height="5" fill="#5f5c57" />
        <rect width="1.4" height="5" fill="#2a2926" />
        <rect width="5" height="1.4" fill="#8d8a84" />
      </pattern>
      <radialGradient id={`${id}-face`} cx="0.42" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.4" />
      </radialGradient>
    </defs>
  );
}

/** A plate seen edge-on, centred on (cx, cy): thick × diameter rectangle with rounded rubber edges + steel hub band. */
export function PlateEdge({ p, cx, cy, id = "it", mm = MM, mirrored = false }: { p: PlateSpec; cx: number; cy: number; id?: string; mm?: number; mirrored?: boolean }) {
  const w = p.thick * mm;
  const h = p.dia * mm;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const rr = Math.min(10, w * 0.28);
  const hubH = 56 * mm;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rr} fill={p.color} filter={`url(#${id}-rubber)`} />
      {/* raised rim lines */}
      <rect x={x + 2} y={y + h * 0.06} width={w - 4} height={2} fill="#000" opacity="0.28" />
      <rect x={x + 2} y={y + h * 0.94 - 2} width={w - 4} height={2} fill="#000" opacity="0.28" />
      {/* steel hub band through the middle */}
      <rect x={x - 1} y={cy - hubH / 2} width={w + 2} height={hubH} fill={`url(#${id}-steel)`} />
      {/* top light */}
      <rect x={x} y={y} width={w} height={h} rx={rr} fill={`url(#${id}-top)`} />
      {/* kg stencilled up the rim */}
      <text
        x={cx}
        y={y + h * 0.27}
        fill={p.ink}
        opacity="0.9"
        fontFamily="var(--mono)"
        fontWeight={500}
        fontSize={Math.max(12, Math.min(14, w * 0.6))}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`${mirrored ? `translate(${2 * cx} 0) scale(-1 1) ` : ""}rotate(-90 ${cx} ${y + h * 0.27})`}
        letterSpacing="1"
      >
        {p.kg} KG
      </text>
    </g>
  );
}

/** A plate seen face-on (footer pile): rubber disc, raised ring, steel hub, kg stencil. Fills its own square SVG. */
export function PlateFace({ p, size, id = "pf" }: { p: PlateSpec; size: number; id?: string }) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="block">
      <PlateDefs id={id} />
      <circle cx={r} cy={r} r={r - 1} fill={p.color} filter={`url(#${id}-rubber)`} />
      <circle cx={r} cy={r} r={r * 0.78} fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth={Math.max(1.5, size * 0.02)} />
      <circle cx={r} cy={r} r={r * 0.26} fill={`url(#${id}-steel)`} />
      <circle cx={r} cy={r} r={r * 0.11} fill="#151413" />
      <circle cx={r} cy={r} r={r - 1} fill={`url(#${id}-face)`} />
      <text
        x={r}
        y={r * 0.5}
        fill={p.ink}
        fontFamily="var(--mono)"
        fontWeight={500}
        fontSize={Math.max(12, size * 0.12)}
        textAnchor="middle"
        dominantBaseline="middle"
        letterSpacing="1"
      >
        {p.kg} KG
      </text>
    </svg>
  );
}

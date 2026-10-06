// S7 seam: sections meet on a thick rule plus a strip of barbell knurling.
export default function Seam({ light = false }: { light?: boolean }) {
  return <div aria-hidden className={`knurl ${light ? "knurl-light" : ""} relative z-[2]`} />;
}

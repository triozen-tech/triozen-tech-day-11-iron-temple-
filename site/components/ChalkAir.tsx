// Page-wide chalk air (lessons 70/71): a fixed, faint, screen-blended layer of chalk haze whose light wavers on an
// irregular LINEAR CSS loop from the first paint, so short holds never freeze on camera. It only adds light.
export default function ChalkAir() {
  return (
    <div aria-hidden className="chalk-air pointer-events-none fixed inset-0 z-[40] overflow-hidden">
      <div className="chalk-air-a absolute inset-[-10%]" />
      <div className="chalk-air-b absolute inset-[-10%]" />
    </div>
  );
}

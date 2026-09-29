/** Animated film grain at 2% opacity, laid over photos and dark panels (Framer "Grain"). */
export function Grain() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animate-grain absolute -inset-[200%] bg-[url(/assets/grain.png)] opacity-[0.02] motion-reduce:animate-none" />
    </div>
  );
}

const ITEMS = [
  "Certified Pre-Owned",
  "GJ-06 On-Road Quotes",
  "Doorstep Test Drives",
  "Paperless Finance",
  "200-Point Inspection",
  "Instant RC Transfer",
];

export function BrandMarquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-line bg-coal py-7">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-coal to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-coal to-transparent" />
      <div className="flex w-max animate-marquee items-center">
        {row.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className={`px-10 font-display text-2xl font-extrabold uppercase tracking-tight md:text-4xl ${i % 2 ? "text-outline" : "text-ivory"}`}>{t}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" aria-hidden="true">
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

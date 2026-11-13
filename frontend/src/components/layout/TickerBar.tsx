const TICKER = "Authorized luxury & certified pre-owned showroom · Instant Gujarat RTO (GJ-06) on-road quotes · Doorstep test drive in Vadodara · 100% paperless finance";

export function TickerBar() {
  return (
    <div className="relative z-[60] overflow-hidden bg-[#141110] py-2">
      <div className="flex w-max animate-marquee whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.3em] text-[#F1EBE0]">
        {[0, 1].map((k) => (
          <span key={k} aria-hidden={k === 1} className="px-10">
            {TICKER} <span className="text-[#E10600]">✦</span> {TICKER} <span className="text-[#E10600]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

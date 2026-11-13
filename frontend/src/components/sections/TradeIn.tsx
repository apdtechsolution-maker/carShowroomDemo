"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MessageCircle, RotateCcw } from "lucide-react";
import { TRADE_BASE, tradeInValue, type Condition } from "@/lib/pricing";
import { formatINR, waLink } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { btnPrimary, btnWhatsApp } from "@/components/ui/buttons";

const IMG = "https://images.pexels.com/photos/11877386/pexels-photo-11877386.jpeg?auto=compress&cs=tinysrgb&w=1400";
const BRANDS = Object.keys(TRADE_BASE);
const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
const CONDITIONS: { id: Condition; desc: string }[] = [
  { id: "Mint", desc: "Showroom-fresh, full service history" },
  { id: "Good", desc: "Minor wear, well maintained" },
  { id: "Fair", desc: "Visible wear, needs some work" },
];
const STEPS = ["Brand", "Year", "Kilometres", "Condition"];

export function TradeIn() {
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState("Hyundai");
  const [year, setYear] = useState(2021);
  const [km, setKm] = useState(40000);
  const [condition, setCondition] = useState<Condition>("Good");
  const [result, setResult] = useState<ReturnType<typeof tradeInValue> | null>(null);
  const [busy, setBusy] = useState(false);

  const valuate = async () => {
    setBusy(true);
    const v = tradeInValue(brand, year, km, condition);
    try {
      await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand, year, km, condition }) });
    } catch {
      /* valuation still shown offline */
    }
    await new Promise((r) => setTimeout(r, 600));
    setResult(v);
    setBusy(false);
  };

  const reset = () => {
    setResult(null);
    setStep(0);
  };

  const msg = result
    ? `*Free Home Inspection — Trade-In*\n${brand} ${year} · ${km.toLocaleString("en-IN")} km · ${condition}\nEstimate: ${formatINR(result.low)} – ${formatINR(result.high)}\nPlease schedule my inspection.`
    : "Hello APEX MOTORS, I'd like a free home inspection for my car.";

  const chip = (active: boolean) =>
    `rounded-2xl border px-4 py-3.5 text-[13px] font-semibold transition-all duration-300 ${active ? "border-gold bg-gold text-ink" : "border-line text-ivory/80 hover:border-ivory/40"}`;

  return (
    <section id="trade-in" className="relative scroll-mt-20 bg-ink py-28 lg:py-36">
      <div className="mx-auto grid max-w-[1480px] gap-14 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div className="flex flex-col">
          <SectionHeading
            index="04"
            eyebrow="Sell / Trade-In"
            title="Your car's worth,"
            accent="in 60 seconds."
            description="Four quick answers for an instant valuation, then a free 200-point home inspection anywhere in Vadodara."
          />
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            whileInView={{ clipPath: "inset(0% 0 0 0)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
            className="relative mt-12 hidden flex-1 overflow-hidden rounded-[32px] lg:block"
          >
            <img src={IMG} alt="Luxury car interior" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A08]/85 to-transparent" />
            <p className="absolute bottom-7 left-7 right-7 font-serif text-2xl italic text-[#F1EBE0]">“Best price in Vadodara and the paperwork was done the same day.”</p>
          </motion.div>
        </div>

        <div className="rounded-[32px] border border-line bg-coal p-5 sm:p-8 md:p-10 min-w-0">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {STEPS.map((s, i) => (
              <button key={s} type="button" onClick={() => !result && setStep(i)} className="text-left min-w-0">
                <div className="h-0.5 overflow-hidden rounded-full bg-line">
                  <motion.div className="h-full bg-gold" animate={{ width: result || i <= step ? "100%" : "0%" }} transition={{ duration: 0.6 }} />
                </div>
                <p className={`mt-2.5 sm:mt-3 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.2em] truncate ${i <= step || result ? "text-ivory" : "text-mute"}`}>
                  <span className="font-mono text-gold">0{i + 1}</span> <span className="hidden xs:inline">{s}</span>
                </p>
              </button>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 min-h-[340px]">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="flex h-full flex-col">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Estimated trade-in value</p>
                  <div className="mt-4 flex flex-wrap items-baseline gap-2 font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-ivory">
                    <span>{formatINR(result.low)}</span>
                    <span className="font-serif font-normal italic text-mute text-lg sm:text-2xl">to</span>
                    <span>{formatINR(result.high)}</span>
                  </div>
                  <p className="mt-4 text-sm text-mute">{brand} · {year} · {km.toLocaleString("en-IN")} km · {condition} condition</p>
                  <div className="mt-10 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" className={btnWhatsApp}>
                      <MessageCircle className="h-4 w-4" /> Book Free Home Inspection
                    </a>
                    <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-mute hover:text-ivory">
                      <RotateCcw className="h-4 w-4" /> Restart
                    </button>
                  </div>
                  <p className="mt-6 text-[11px] text-mute">Indicative. Final offer follows the 200-point inspection.</p>
                </motion.div>
              ) : (
                <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                  <h3 className="font-display text-2xl font-extrabold uppercase text-ivory">
                    {["Which brand?", "Which year?", "How far driven?", "Overall condition?"][step]}
                  </h3>
                  {step === 0 && (
                    <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {BRANDS.map((x) => <button key={x} type="button" onClick={() => setBrand(x)} className={chip(brand === x)}>{x}</button>)}
                    </div>
                  )}
                  {step === 1 && (
                    <div className="mt-7 grid grid-cols-2 xs:grid-cols-4 gap-2 sm:gap-2.5">
                      {YEARS.map((y) => <button key={y} type="button" onClick={() => setYear(y)} className={`${chip(year === y)} font-mono text-center`}>{y}</button>)}
                    </div>
                  )}
                  {step === 2 && (
                    <div className="mt-8 sm:mt-10">
                      <p className="font-display text-4xl sm:text-5xl md:text-6xl font-black tabular-nums text-ivory">{km.toLocaleString("en-IN")}<span className="ml-2 text-base sm:text-lg text-gold">km</span></p>
                      <input className="mt-6 sm:mt-10" type="range" min={5000} max={120000} step={1000} value={km} onChange={(e) => setKm(Number(e.target.value))} aria-label="Kilometres" />
                      <div className="mt-3 flex justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-mute"><span>5,000</span><span>1,20,000</span></div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="mt-7 grid gap-3">
                      {CONDITIONS.map((c) => (
                        <button key={c.id} type="button" onClick={() => setCondition(c.id)} className={`flex items-center justify-between rounded-2xl border p-5 text-left transition ${condition === c.id ? "border-gold bg-gold/10" : "border-line hover:border-ivory/30"}`}>
                          <span>
                            <span className="block font-display text-lg font-bold uppercase text-ivory">{c.id}</span>
                            <span className="text-[13px] text-mute">{c.desc}</span>
                          </span>
                          <span className={`h-4 w-4 rounded-full border-2 ${condition === c.id ? "border-gold bg-gold" : "border-line"}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!result && (
            <div className="mt-8 flex items-center justify-between border-t border-line pt-7">
              <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-mute transition hover:text-ivory disabled:opacity-30">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < 3 ? (
                <button type="button" onClick={() => setStep((s) => s + 1)} className={btnPrimary}>
                  Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <button type="button" onClick={valuate} disabled={busy} className={btnPrimary}>
                  {busy ? "Valuing…" : "Reveal my valuation"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

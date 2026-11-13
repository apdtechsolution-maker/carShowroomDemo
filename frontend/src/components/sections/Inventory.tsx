"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Calculator, Check, Plus, SlidersHorizontal } from "lucide-react";
import { BODY_TYPES, CARS, FUEL_TYPES, type BodyType, type Car, type FuelType } from "@/lib/inventory";
import { emiFor, onRoadBreakup } from "@/lib/pricing";
import { formatINR } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltImage } from "@/components/ui/TiltImage";
import { CompareModal } from "./CompareModal";
import type { QuickSearch } from "./Hero";

const BUDGET_MIN = 1000000;
const BUDGET_MAX = 25000000;

interface InventoryProps {
  search: (QuickSearch & { nonce: number }) | null;
  onCalculate: (car: Car) => void;
  onBook: (car: Car) => void;
}

function lakhLabel(v: number) {
  return v >= 10000000 ? `₹${(v / 10000000).toFixed(2).replace(/\.?0+$/, "")} Cr` : `₹${Math.round(v / 100000)} L`;
}

export function Inventory({ search, onCalculate, onBook }: InventoryProps) {
  const [body, setBody] = useState<"All" | BodyType>("All");
  const [fuel, setFuel] = useState<"All" | FuelType>("All");
  const [budget, setBudget] = useState(BUDGET_MAX);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    if (!search) return;
    setBody(search.body);
    setBudget(search.budget);
    setFuel("All");
  }, [search]);

  const filtered = useMemo(
    () => CARS.filter((c) => (body === "All" || c.body === body) && (fuel === "All" || c.fuel === fuel) && c.exShowroom <= budget),
    [body, fuel, budget],
  );

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      const next = [...prev, id];
      if (next.length === 2) setCompareOpen(true);
      return next;
    });
  };

  const compared = compareIds.map((id) => CARS.find((c) => c.id === id)).filter((c): c is Car => Boolean(c));

  return (
    <section id="inventory" className="relative scroll-mt-20 bg-ink py-28 lg:py-36">
      <div className="mx-auto max-w-[1480px] px-5 lg:px-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            index="02"
            eyebrow="Verified Inventory"
            title="Find your"
            accent="next drive."
            description="Every car is inspected, documented and ready for registration. Filter by body, fuel and budget, then compare any two side by side."
          />
          <p className="font-display text-6xl font-black text-outline lg:text-8xl">
            {String(filtered.length).padStart(2, "0")}
          </p>
        </div>

        {/* Filters */}
        <div className="mt-14 border-y border-line py-6">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
            {BODY_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setBody(t)}
                className={`relative shrink-0 rounded-full px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
                  body === t ? "text-ink" : "text-mute hover:text-ivory"
                }`}
              >
                {body === t && <motion.span layoutId="body-pill" className="absolute inset-0 rounded-full bg-ivory" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="mr-2 h-4 w-4 text-gold" />
              {FUEL_TYPES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFuel(f)}
                  className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                    fuel === f ? "border-gold bg-gold/10 text-gold" : "border-line text-mute hover:border-ivory/30 hover:text-ivory"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-mute">₹10 L</span>
              <input type="range" min={BUDGET_MIN} max={BUDGET_MAX} step={100000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} aria-label="Budget" />
              <span className="shrink-0 rounded-full bg-gold/10 px-4 py-1.5 font-mono text-[12px] text-gold">≤ {lakhLabel(budget)}</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((car, i) => {
              const emi = emiFor(onRoadBreakup(car.exShowroom, car.fuel).total * 0.8, 9.5, 60);
              const selected = compareIds.includes(car.id);
              const disabled = !selected && compareIds.length >= 2;
              return (
                <motion.article
                  key={car.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group"
                >
                  <TiltImage src={car.image} alt={car.name} className="aspect-[4/5] rounded-[26px] bg-coal" imgClassName="group-hover:scale-110">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A08]/90 via-transparent to-[#0C0A08]/40" />
                    <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                      <span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] backdrop-blur-md ${car.preOwned ? "bg-gold text-ink" : "bg-[#13100E]/60 text-[#F1EBE0]"}`}>
                        {car.preOwned ? `Certified · ${car.km.toLocaleString("en-IN")} km` : "New · 0 km"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleCompare(car.id)}
                        disabled={disabled}
                        aria-pressed={selected}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] backdrop-blur-md transition ${
                          selected ? "bg-ivory text-ink" : "bg-[#13100E]/60 text-[#F1EBE0] hover:bg-[#13100E]/80"
                        } disabled:opacity-40`}
                      >
                        {selected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                        Compare
                      </button>
                    </div>

                    {/* Hover reveal actions */}
                    <div className="absolute inset-x-4 bottom-4 flex translate-y-4 gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
                      <button type="button" onClick={() => onBook(car)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ivory py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink transition hover:bg-gold">
                        Test Drive <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => onCalculate(car)} aria-label="On-road price" className="grid h-11 w-11 place-items-center rounded-full border border-[#F1EBE0]/30 bg-[#13100E]/60 text-[#F1EBE0] backdrop-blur-md transition hover:bg-ivory hover:text-ink">
                        <Calculator className="h-4 w-4" />
                      </button>
                    </div>
                  </TiltImage>

                  <div className="mt-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">{car.year} · {car.body}</p>
                      <h3 className="mt-1.5 font-display text-lg font-bold uppercase leading-tight text-ivory">{car.name}</h3>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-mute">
                    <span>{car.fuel}</span>
                    <span className="text-line">|</span>
                    <span>{car.transmission}</span>
                    <span className="text-line">|</span>
                    <span>{car.bhp} BHP</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-mute">Ex-showroom</p>
                      <p className="font-display text-lg font-bold text-ivory">{formatINR(car.exShowroom)}</p>
                    </div>
                    <p className="text-right font-mono text-[11px] text-gold">
                      {formatINR(emi)}
                      <span className="text-mute">/mo*</span>
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="mt-12 rounded-[28px] border border-dashed border-line p-14 text-center">
            <p className="font-display text-xl font-bold uppercase text-ivory">No matches</p>
            <p className="mt-2 text-sm text-mute">Raise the budget or choose another body type.</p>
          </div>
        )}
        <p className="mt-12 text-[11px] text-mute">* Indicative EMI on 80% of GJ-06 on-road price, 60 months @ 9.5% p.a. Images are representative.</p>
      </div>

      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed bottom-6 left-1/2 z-[70] flex w-[min(92vw,600px)] -translate-x-1/2 items-center gap-4 rounded-full border border-line bg-panel/90 py-2 pl-3 pr-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            <div className="flex -space-x-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-11 w-11 overflow-hidden rounded-full border-2 border-panel bg-coal">
                  {compared[i] ? <img src={compared[i].image} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-mute"><Plus className="h-4 w-4" /></div>}
                </div>
              ))}
            </div>
            <p className="min-w-0 flex-1 truncate text-[12px] text-ivory">
              {compared.length === 2 ? compared.map((c) => c.name.split(" ").slice(0, 2).join(" ")).join(" vs ") : "Select one more car to compare"}
            </p>
            <button type="button" onClick={() => setCompareIds([])} className="text-[10px] font-bold uppercase tracking-[0.16em] text-mute hover:text-ivory">Clear</button>
            <button type="button" disabled={compareIds.length < 2} onClick={() => setCompareOpen(true)} className="rounded-full bg-gold px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink disabled:opacity-40">
              Compare
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{compareOpen && compared.length === 2 && <CompareModal cars={compared} onClose={() => setCompareOpen(false)} />}</AnimatePresence>
    </section>
  );
}

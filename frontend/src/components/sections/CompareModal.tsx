"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Car } from "@/lib/inventory";
import { onRoadBreakup } from "@/lib/pricing";
import { formatINR } from "@/lib/site";

interface Row {
  label: string;
  get: (c: Car) => string;
  score?: (c: Car) => number;
}

const ROWS: Row[] = [
  { label: "Power", get: (c) => `${c.bhp} BHP`, score: (c) => c.bhp },
  { label: "Mileage / Range", get: (c) => c.efficiency },
  { label: "Boot space", get: (c) => `${c.bootLitres} L`, score: (c) => c.bootLitres },
  { label: "Safety rating", get: (c) => c.safety },
  { label: "Seats", get: (c) => `${c.seats}`, score: (c) => c.seats },
  { label: "Transmission", get: (c) => c.transmission },
  { label: "Ex-showroom", get: (c) => formatINR(c.exShowroom) },
  { label: "On-road (GJ-06)", get: (c) => formatINR(onRoadBreakup(c.exShowroom, c.fuel).total) },
];

export function CompareModal({ cars, onClose }: { cars: Car[]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[90] grid place-items-center bg-ink/85 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Compare vehicles">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[32px] border border-line bg-coal shadow-[0_50px_140px_-40px_rgba(26,20,14,0.5)]"
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-[#13100E]/70 text-[#F1EBE0] backdrop-blur-md transition hover:rotate-90 hover:bg-[#F1EBE0] hover:text-[#13100E]">
          <X className="h-4 w-4" />
        </button>
        <div className="grid grid-cols-2">
          {cars.map((c, i) => (
            <div key={c.id} className="relative h-56 overflow-hidden sm:h-72">
              <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A08] via-[#0C0A08]/40 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">{c.body}</p>
                <p className="mt-1 font-display text-base font-extrabold uppercase leading-tight text-[#F1EBE0] sm:text-xl">{c.name}</p>
              </div>
              {i === 0 && <span className="absolute -right-6 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-[#F1EBE0]/20 bg-[#E10600] font-serif text-lg italic text-[#F1EBE0]">vs</span>}
            </div>
          ))}
        </div>
        <div className="px-6 pb-8 sm:px-10">
          {ROWS.map((row, ri) => {
            const scores = row.score ? cars.map(row.score) : null;
            const best = scores ? Math.max(...scores) : null;
            return (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + ri * 0.04 }}
                className="grid grid-cols-[1fr_1.2fr_1.2fr] items-center gap-4 border-b border-line py-4 text-sm"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mute">{row.label}</span>
                {cars.map((c, i) => (
                  <span key={c.id} className={`font-semibold ${scores && scores[i] === best && scores[0] !== scores[1] ? "text-gold" : "text-ivory"}`}>
                    {row.get(c)}
                  </span>
                ))}
              </motion.div>
            );
          })}
          <p className="mt-5 text-[11px] text-mute">On-road includes estimated GJ-06 road tax, registration, zero-dep insurance and FASTag. The red accent marks the stronger figure.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

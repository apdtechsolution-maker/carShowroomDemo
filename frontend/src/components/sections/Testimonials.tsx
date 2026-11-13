"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

const QUOTES = [
  { q: "They brought the Sovereign S to my office for a test drive, and the on-road price on WhatsApp matched the final invoice to the rupee.", n: "Rohan Mehta", r: "Sovereign Executive S · Alkapuri" },
  { q: "My old SUV was valued at home, the loan was approved in under an hour, and I drove the Summit Hybrid home the same evening.", n: "Dr. Kavya Shah", r: "Summit Aviator Hybrid · Gotri" },
  { q: "The certified GT came with a full history file and a 5-year warranty. It felt like buying new, at a pre-owned price.", n: "Aditya Patel", r: "Stealth GT Pre-Owned · Manjalpur" },
];

const STATS = [
  { v: 3200, s: "+", l: "Cars delivered" },
  { v: 12, s: "", l: "Finance partners" },
  { v: 200, s: "", l: "Inspection points" },
  { v: 48, s: "h", l: "Avg. RC transfer" },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % QUOTES.length), 7000);
    return () => clearInterval(t);
  }, [i]);
  const q = QUOTES[i];

  return (
    <section className="relative bg-ink py-28 lg:py-36">
      <div className="mx-auto max-w-[1200px] px-5 text-center lg:px-10">
        <p className="font-serif text-[9rem] leading-[0.5] text-gold/40">“</p>
        <div className="relative mt-4 min-h-[220px] sm:min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 24, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -24, filter: "blur(8px)" }} transition={{ duration: 0.7 }}>
              <p className="font-serif text-[clamp(1.5rem,3.2vw,2.6rem)] leading-snug text-ivory">{q.q}</p>
              <p className="mt-8 font-display text-sm font-bold uppercase tracking-[0.2em] text-ivory">{q.n}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{q.r}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-10 flex items-center justify-center gap-5">
          <button type="button" aria-label="Previous" onClick={() => setI((x) => (x - 1 + QUOTES.length) % QUOTES.length)} className="grid h-12 w-12 place-items-center rounded-full border border-line text-ivory transition hover:bg-ivory hover:text-ink"><ArrowLeft className="h-4 w-4" /></button>
          <div className="flex gap-2">
            {QUOTES.map((_, k) => (
              <span key={k} className="h-0.5 w-10 overflow-hidden rounded-full bg-line">
                {k === i && <motion.span key={i} className="block h-full bg-gold" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 7, ease: "linear" }} />}
              </span>
            ))}
          </div>
          <button type="button" aria-label="Next" onClick={() => setI((x) => (x + 1) % QUOTES.length)} className="grid h-12 w-12 place-items-center rounded-full border border-line text-ivory transition hover:bg-ivory hover:text-ink"><ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mx-auto mt-24 grid max-w-[1480px] grid-cols-2 border-y border-line lg:grid-cols-4">
        {STATS.map((s, k) => (
          <div key={s.l} className={`px-6 py-10 text-center ${k % 2 ? "border-l border-line" : ""} ${k >= 2 ? "max-lg:border-t lg:border-l" : ""} ${k === 1 ? "" : ""}`}>
            <p className="font-display text-5xl font-black text-ivory"><CountUp to={s.v} duration={2400} />{s.s}</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-mute">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

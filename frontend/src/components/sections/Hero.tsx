"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { BODY_TYPES, type BodyType } from "@/lib/inventory";
import { btnGhost, btnPrimary } from "@/components/ui/buttons";
import { CountUp } from "@/components/ui/CountUp";

const VIDEO = "https://videos.pexels.com/video-files/14052063/14052063-hd_1920_1080_25fps.mp4";
const POSTER = "/images/hero.jpg";
const EASE = [0.22, 1, 0.36, 1] as const;

const BUDGETS = [
  { label: "Any budget", value: 25000000 },
  { label: "Under ₹30 Lakh", value: 3000000 },
  { label: "Under ₹50 Lakh", value: 5000000 },
  { label: "Under ₹1 Crore", value: 10000000 },
  { label: "Under ₹1.5 Crore", value: 15000000 },
];

export interface QuickSearch {
  body: "All" | BodyType;
  budget: number;
}

interface HeroProps {
  onBook: () => void;
  onCalculate: () => void;
  onSearch: (q: QuickSearch) => void;
}

const LINES = ["Engineered", "for pure"];

export function Hero({ onBook, onCalculate, onSearch }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const [body, setBody] = useState<"All" | BodyType>("All");
  const [budget, setBudget] = useState(BUDGETS[0].value);
  const [glow, setGlow] = useState({ x: 50, y: 40, o: 0 });

  return (
    <section ref={ref} id="top" className="grain relative overflow-hidden bg-ink">
      <div className="mx-auto grid max-w-[1480px] items-center gap-8 px-5 pt-32 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-10 lg:pt-44">
        {/* ---------- Editorial column ---------- */}
        <div className="flex flex-col justify-center pb-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-gold"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            2026 Apex GT-R Coupé · In stock at Vadodara Lounge
          </motion.div>

          <h1 className="mt-8 font-display text-[clamp(2.9rem,7vw,6.4rem)] font-black uppercase leading-[0.88] tracking-[-0.02em] text-ivory">
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.45 + i * 0.12, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden pb-3">
              <motion.span
                className="block font-serif text-[1.05em] font-normal normal-case italic tracking-normal text-gold-soft"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.7, ease: EASE }}
              >
                adrenaline.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1, ease: EASE }}
            className="mt-6 max-w-md text-[15px] leading-relaxed text-mute"
          >
            Gujarat’s luxury and performance lounge. Hand-picked new and certified pre-owned cars, exact GJ-06 on-road pricing, and test drives at your doorstep.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <button type="button" onClick={onBook} className={btnPrimary}>
              Book VIP Test Drive
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </button>
            <button type="button" onClick={onCalculate} className={btnGhost}>
              GJ-06 On-Road Price
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25, ease: EASE }}
            className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4"
          >
            <Stat label="0–100 km/h" value={<CountUp to={2.9} decimals={1} suffix="s" />} />
            <Stat label="Power" value={<CountUp to={640} />} unit="BHP" />
            <Stat label="Top speed" value={<CountUp to={330} />} unit="km/h" />
            <Stat label="Ex-showroom" value={<span>₹1.48</span>} unit="Cr" />
          </motion.div>
        </div>

        {/* ---------- Cinematic screen panel ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setGlow({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, o: 1 });
          }}
          onMouseLeave={() => setGlow((g) => ({ ...g, o: 0 }))}
          className="relative overflow-hidden rounded-[32px] border border-line bg-[#12100C] shadow-[0_50px_120px_-40px_rgba(26,20,14,0.55)]"
        >
          <div className="relative h-[52vh] min-h-[400px] lg:h-[calc(100svh-17rem)]">
            <motion.div style={{ scale: videoScale }} className="absolute inset-0">
              <video className="h-full w-full object-cover" src={VIDEO} poster={POSTER} autoPlay muted loop playsInline preload="auto" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A08]/85 via-transparent to-[#0C0A08]/40" />
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-700"
              style={{ opacity: glow.o, background: `radial-gradient(560px circle at ${glow.x}% ${glow.y}%, rgba(240,120,50,0.28), transparent 65%)` }}
            />
            <div className="pointer-events-none absolute inset-y-0 left-1/4 w-1/2 animate-sweep bg-gradient-to-r from-transparent via-gold-soft/10 to-transparent blur-2xl" />

            <span className="absolute left-5 top-5 rounded-full border border-[#F1EBE0]/20 bg-[#13100E]/60 px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#F1EBE0] backdrop-blur-md">
              ● Now at the lounge
            </span>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F1EBE0]/65">Apex GT-R Coupé · 2026</p>
                <p className="mt-1.5 font-display text-xl font-black uppercase text-[#F1EBE0] md:text-2xl">Ready for your test drive</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#F1EBE0]/55">Ex-showroom</p>
                <p className="font-mono text-lg font-bold text-[#FF8A5C] md:text-xl">₹1,48,00,000</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---------- Quick search ---------- */}
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.35, ease: EASE }}
        onSubmit={(e) => {
          e.preventDefault();
          onSearch({ body, budget });
        }}
        className="relative z-10 mx-auto mb-16 mt-4 w-[calc(100%-2.5rem)] max-w-[1480px] grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line backdrop-blur-2xl sm:grid-cols-[1fr_1fr_auto] lg:mx-auto lg:w-[calc(100%-5rem)]"
      >
        <label className="flex flex-col gap-1 bg-panel px-6 py-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-mute">Body type</span>
          <select value={body} onChange={(e) => setBody(e.target.value as "All" | BodyType)} className="bg-transparent text-sm font-semibold text-ivory outline-none">
            {BODY_TYPES.map((b) => (
              <option key={b} value={b}>{b === "All" ? "All vehicles" : b}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 bg-panel px-6 py-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-mute">Budget</span>
          <select value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="bg-transparent text-sm font-semibold text-ivory outline-none">
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="flex items-center justify-center gap-3 bg-gold px-10 py-5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition hover:bg-ember">
          <Search className="h-4 w-4" />
          Search Inventory
        </button>
      </motion.form>

      <a href="#collection" aria-label="Scroll down" className="absolute bottom-8 right-8 z-10 hidden flex-col items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-mute lg:flex">
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span className="relative h-16 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 h-1/2 animate-road bg-gold" />
        </span>
        <ChevronDown className="h-3 w-3" />
      </a>
    </section>
  );
}

function Stat({ label, value, unit }: { label: string; value: React.ReactNode; unit?: string }) {
  return (
    <div className="border-t border-line pt-3">
      <p className="font-display text-3xl font-extrabold tabular-nums text-ivory">
        {value}
        {unit && <span className="ml-1 text-sm font-semibold text-gold">{unit}</span>}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-mute">{label}</p>
    </div>
  );
}

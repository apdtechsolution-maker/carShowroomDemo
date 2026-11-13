"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { Power } from "lucide-react";

function Wheel({ cx, cy, r, spinning }: { cx: number; cy: number; r: number; spinning: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#120E09" stroke="#3A3126" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r * 0.62} fill="#1E1810" stroke="#4A3E2C" strokeWidth="1.5" />
      <g className={spinning ? "animate-wheel" : ""} style={{ transformOrigin: `${cx}px ${cy}px` }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 5;
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * r * 0.18}
              y1={cy + Math.sin(a) * r * 0.18}
              x2={cx + Math.cos(a) * r * 0.58}
              y2={cy + Math.sin(a) * r * 0.58}
              stroke="#E10600"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.85"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r * 0.16} fill="#F0552B" />
      </g>
    </g>
  );
}

function CarSvg({ spinning, revving }: { spinning: boolean; revving: boolean }) {
  return (
    <svg viewBox="0 0 640 230" className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]" aria-hidden="true">
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0EAE0" />
          <stop offset="0.35" stopColor="#C7BFAE" />
          <stop offset="0.72" stopColor="#6E6455" />
          <stop offset="1" stopColor="#201A12" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFA45C" stopOpacity="0.55" />
          <stop offset="1" stopColor="#171008" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F0552B" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F0552B" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* headlight beam */}
      <path d="M596 140 L640 118 L640 168 Z" fill="url(#beamGrad)" className="animate-beam" style={{ transformOrigin: "596px 140px" }} />

      {/* body */}
      <path
        d="M26 160 C26 141 42 130 68 126 L120 116 C152 95 198 81 248 79 L338 79 C384 81 416 95 446 116 L552 130 C584 136 600 146 600 160 L600 170 C600 176 596 180 588 180 L38 180 C30 180 26 174 26 166 Z"
        fill="url(#bodyGrad)"
      />
      {/* glass canopy */}
      <path d="M198 112 C224 93 260 85 302 85 L340 85 C374 87 398 97 420 112 Z" fill="url(#glassGrad)" />
      {/* shoulder accent */}
      <path d="M56 142 L566 142" stroke="#E10600" strokeWidth="2" opacity="0.75" />
      <path d="M120 116 C160 104 200 98 250 96" stroke="#F1EBE0" strokeWidth="1.5" opacity="0.35" fill="none" />
      {/* headlight + taillight */}
      <path d="M560 132 L596 139 L596 148 L556 143 Z" fill="#FFE3C2" />
      <rect x="26" y="134" width="30" height="9" rx="4" fill="#E10600" />
      {/* side intake */}
      <path d="M330 150 L400 150 L392 166 L336 166 Z" fill="#171008" opacity="0.55" />
      {/* rear wing */}
      <path d="M40 112 L120 106 L120 114 L44 120 Z" fill="#241C12" />

      {/* exhaust glow */}
      <circle cx="34" cy="166" r={revving ? 12 : 5} fill="#E10600" opacity={revving ? 0.85 : 0.35} className="animate-beam" />

      <Wheel cx={158} cy={180} r={44} spinning={spinning} />
      <Wheel cx={478} cy={180} r={44} spinning={spinning} />
    </svg>
  );
}

export function DriveStrip() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const carX = useTransform(smooth, [0.1, 0.9], ["-6%", "46%"]);
  const speed = useTransform(smooth, [0.1, 0.9], [0, 330]);
  const speedLabel = useTransform(speed, (v) => String(Math.round(v)));
  const roadShift = useTransform(smooth, [0, 1], ["0%", "-100%"]);
  const inView = useInView(ref, { margin: "-20%" });
  const [revving, setRevving] = useState(false);

  const startEngine = () => {
    if (revving) return;
    setRevving(true);
    window.setTimeout(() => setRevving(false), 2400);
  };

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-[#F1EBE0]/10 bg-[#12100C] py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(to right, #F1EBE0 1px, transparent 1px)", backgroundSize: "80px 100%" }} />
      <div className="relative mx-auto max-w-[1480px] px-5 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-gold">The Apex Drive</p>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.92] text-[#F1EBE0]">
              Scroll to <span className="font-serif font-normal normal-case italic text-gold-soft">accelerate.</span>
            </h2>
          </div>
          <div className="flex items-end gap-8">
            <div>
              <p className="font-display text-6xl font-black tabular-nums leading-none text-[#F1EBE0]">
                <motion.span>{speedLabel}</motion.span>
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9E9484]">km/h · live</p>
            </div>
            <button
              type="button"
              onClick={startEngine}
              className="group inline-flex items-center gap-3 rounded-full border border-gold/50 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              <Power className={`h-4 w-4 transition-transform duration-500 ${revving ? "scale-125" : "group-hover:scale-110"}`} />
              {revving ? "Engine running" : "Start engine"}
            </button>
          </div>
        </div>
      </div>

      {/* Stage */}
      <div className="relative mt-14 h-[300px] sm:h-[380px]">
        {/* moving road */}
        <div className="absolute inset-x-0 bottom-10 h-px bg-[#F1EBE0]/12" />
        <motion.div style={{ x: roadShift }} className="absolute inset-x-0 bottom-10 flex w-[200%] gap-16">
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="h-px w-24 shrink-0 bg-gold/40" />
          ))}
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0C0A08] to-transparent" />

        {/* speed streaks */}
        <motion.div style={{ opacity: smooth }} className="absolute inset-0">
          {[18, 34, 52, 68, 82].map((top, i) => (
            <motion.span
              key={top}
              className="absolute h-px bg-gradient-to-r from-transparent via-gold-soft/50 to-transparent"
              style={{ top: `${top}%`, left: 0, right: 0 }}
              animate={{ x: ["-30%", "30%"] }}
              transition={{ duration: 1.6 + i * 0.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        {/* ghost word */}
        <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[26vw] font-black leading-none text-outline-light opacity-40">
          DRIVE
        </p>

        {/* car */}
        <motion.div style={{ x: carX }} className="absolute bottom-16 left-0 w-[86vw] max-w-[720px] sm:w-[62vw]">
          <motion.div animate={revving ? { y: [0, -3, 2, -2, 0], rotate: [0, -0.4, 0.3, 0] } : { y: 0 }} transition={{ duration: 0.35, repeat: revving ? Infinity : 0 }}>
            <CarSvg spinning={inView || revving} revving={revving} />
          </motion.div>
        </motion.div>

        {/* tachometer */}
        <div className="absolute right-5 top-0 hidden w-52 sm:block lg:right-10">
          <svg viewBox="0 0 200 120" className="w-full">
            <path d="M 22 108 A 78 78 0 1 1 178 108" fill="none" stroke="rgba(241,235,224,0.1)" strokeWidth="4" pathLength={1} />
            <motion.path
              d="M 22 108 A 78 78 0 1 1 178 108"
              fill="none"
              stroke="#E10600"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength={1}
              animate={{ pathLength: revving ? [0.08, 1, 0.22] : 0.08 }}
              transition={{ duration: revving ? 1.6 : 0.6, ease: "easeInOut" }}
            />
            {Array.from({ length: 9 }).map((_, i) => {
              const a = ((-120 + i * 30 - 90) * Math.PI) / 180;
              return <line key={i} x1={100 + Math.cos(a) * 62} y1={82 + Math.sin(a) * 62} x2={100 + Math.cos(a) * 70} y2={82 + Math.sin(a) * 70} stroke="rgba(241,235,224,0.3)" strokeWidth="1.5" />;
            })}
            <motion.g animate={{ rotate: revving ? [0, 118, 26] : 0 }} transition={{ duration: revving ? 1.6 : 0.6, ease: "easeInOut" }} style={{ transformOrigin: "100px 82px" }}>
              <line x1="100" y1="82" x2="100" y2="30" stroke="#F1EBE0" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
            <circle cx="100" cy="82" r="4" fill="#E10600" />
          </svg>
          <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-[#9E9484]">
            {revving ? "8,000 rpm" : "idle · 800 rpm"}
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { CountUp } from "@/components/ui/CountUp";

const IMG = "https://images.pexels.com/photos/29566864/pexels-photo-29566864.jpeg?auto=compress&cs=tinysrgb&w=1920";

const GAUGES = [
  { label: "Peak power", value: 640, max: 800, unit: "BHP", decimals: 0 },
  { label: "Torque", value: 820, max: 1000, unit: "Nm", decimals: 0 },
  { label: "Top speed", value: 330, max: 360, unit: "km/h", decimals: 0 },
  { label: "0–100 km/h", value: 2.9, max: 6, unit: "sec", decimals: 1, invert: true },
];

function Gauge({ label, value, max, unit, decimals, invert }: (typeof GAUGES)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const pct = invert ? 1 - value / max + 0.35 : value / max;

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <svg viewBox="0 0 200 130" className="w-full max-w-[220px]">
        <path d="M 25 115 A 80 80 0 1 1 175 115" fill="none" stroke="rgba(26,20,14,0.10)" strokeWidth="3" pathLength={1} />
        <motion.path
          d="M 25 115 A 80 80 0 1 1 175 115"
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: Math.min(1, pct) } : {}}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {Array.from({ length: 21 }).map((_, i) => {
          const a = ((-125 + i * 12.5 - 90) * Math.PI) / 180;
          const r1 = i % 5 === 0 ? 60 : 65;
          return <line key={i} x1={100 + Math.cos(a) * r1} y1={88 + Math.sin(a) * r1} x2={100 + Math.cos(a) * 70} y2={88 + Math.sin(a) * 70} stroke="rgba(26,20,14,0.35)" strokeWidth="1" />;
        })}
        <defs>
          <linearGradient id="gauge-grad" x1="0" x2="1">
            <stop offset="0" stopColor="#9E9484" />
            <stop offset="1" stopColor="#E10600" />
          </linearGradient>
        </defs>
      </svg>
      <div className="-mt-16 text-center">
        <p className="font-display text-4xl font-black tabular-nums text-ivory">
          <CountUp to={value} decimals={decimals} duration={2200} />
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">{unit}</p>
      </div>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.26em] text-mute">{label}</p>
    </div>
  );
}

export function Performance() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="grain relative overflow-hidden bg-coal py-28 lg:py-36">
      <motion.img style={{ y: bgY }} src={IMG} alt="" aria-hidden="true" className="absolute inset-0 h-[124%] w-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-coal via-coal/80 to-coal" />
      <div className="relative mx-auto max-w-[1480px] px-5 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-gold">Live telemetry · Apex GT-R</p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-[clamp(2rem,5vw,4.25rem)] font-black uppercase leading-[0.95] text-ivory"
          >
            Numbers that{" "}
            <span className="font-serif font-normal normal-case italic text-gold-soft">move you.</span>
          </motion.h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] text-mute">
            Dual-motor all-wheel drive with hybrid torque fill. Every figure is verified on our in-house dyno before delivery.
          </p>
        </div>
        <div className="mt-20 grid grid-cols-2 gap-y-16 lg:grid-cols-4">
          {GAUGES.map((g) => (
            <Gauge key={g.label} {...g} />
          ))}
        </div>
      </div>
    </section>
  );
}

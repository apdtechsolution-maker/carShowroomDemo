"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1] as const;

/** Opening sequence: speedometer sweeps 0 → 330 km/h, then the curtains split. */
export function IntroLoader() {
  const [show, setShow] = useState(true);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("apex-intro")) {
      setShow(false);
      return;
    }
    document.body.style.overflow = "hidden";
    const start = performance.now();
    const duration = 1700;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setSpeed(Math.round(330 * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
      else
        window.setTimeout(() => {
          sessionStorage.setItem("apex-intro", "1");
          setShow(false);
          document.body.style.overflow = "";
        }, 350);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, []);

  const progress = speed / 330;
  const angle = -120 + progress * 240;

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[200]" exit={{ opacity: 1 }} transition={{ duration: 1 }}>
          <motion.div exit={{ y: "-100%" }} transition={{ duration: 0.9, ease: EASE }} className="absolute inset-x-0 top-0 h-1/2 bg-[#13100E]" />
          <motion.div exit={{ y: "100%" }} transition={{ duration: 0.9, ease: EASE }} className="absolute inset-x-0 bottom-0 h-1/2 bg-[#13100E]" />
          <motion.div
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <svg viewBox="0 0 200 140" className="w-[240px]">
              <path d="M 30 120 A 80 80 0 1 1 170 120" fill="none" stroke="rgba(241,235,224,0.08)" strokeWidth="2" />
              <path
                d="M 30 120 A 80 80 0 1 1 170 120"
                fill="none"
                stroke="#E10600"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1} strokeDasharray={1}
                strokeDashoffset={1 - progress}
              />
              {Array.from({ length: 13 }).map((_, i) => {
                const a = ((-120 + i * 20 - 90) * Math.PI) / 180;
                const r1 = i % 2 === 0 ? 66 : 70;
                return (
                  <line
                    key={i}
                    x1={100 + Math.cos(a) * r1}
                    y1={81 + Math.sin(a) * r1}
                    x2={100 + Math.cos(a) * 74}
                    y2={81 + Math.sin(a) * 74}
                    stroke={i / 12 <= progress ? "#E10600" : "rgba(241,235,224,0.25)"}
                    strokeWidth="1.2"
                  />
                );
              })}
              <g transform={`rotate(${angle} 100 81)`}>
                <line x1="100" y1="81" x2="100" y2="24" stroke="#F1EBE0" strokeWidth="1.6" strokeLinecap="round" />
              </g>
              <circle cx="100" cy="81" r="4" fill="#E10600" />
            </svg>
            <p className="-mt-6 font-display text-5xl font-extrabold tabular-nums text-[#F1EBE0]">{speed}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#9E9484]">km/h</p>
            <p className="mt-10 font-display text-sm font-bold uppercase tracking-[0.5em] text-[#F1EBE0]">
              Apex <span className="text-gold">Motors</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

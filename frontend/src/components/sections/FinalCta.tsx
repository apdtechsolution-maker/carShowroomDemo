"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { btnPrimary } from "@/components/ui/buttons";

const VIDEO = "https://videos.pexels.com/video-files/29498801/12698140_4070_2160_24fps.mp4";
const POSTER = "https://images.pexels.com/videos/29498801/ferrari-f50-1995-wheel-spinnng-29498801.jpeg?auto=compress&cs=tinysrgb&w=1600";

export function FinalCta({ onBook }: { onBook: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const inset = useTransform(scrollYProgress, [0, 1], ["8%", "0%"]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 0]);

  return (
    <section ref={ref} className="relative bg-[#12100C]">
      <motion.div style={{ marginInline: inset, borderRadius: radius }} className="relative overflow-hidden">
        <video className="absolute inset-0 h-full w-full object-cover" src={VIDEO} poster={POSTER} autoPlay muted loop playsInline preload="none" />
        <div className="absolute inset-0 bg-[#0C0A08]/70" />
        <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-5 py-28 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-gold">Your key is waiting</p>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,8vw,7rem)] font-black uppercase leading-[0.88] text-[#F1EBE0]">
            Feel it
            <br />
            <span className="font-serif font-normal normal-case italic text-gold-soft">in person.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] text-[#F1EBE0]/70">Book a doorstep test drive in Vadodara, or a private evening at the Apex Lounge.</p>
          <button type="button" onClick={onBook} className={`${btnPrimary} mt-10`}>
            Schedule Doorstep Test Drive <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

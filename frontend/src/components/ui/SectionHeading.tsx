"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "left" | "center";
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Editorial heading: numbered eyebrow, expanded display title, serif italic accent. */
export function SectionHeading({ index, eyebrow, title, accent, description, align = "left" }: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-gold ${center ? "justify-center" : ""}`}
      >
        <span className="font-mono tracking-normal text-mute">{index}</span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="h-px w-10 origin-left bg-gold/60"
        />
        {eyebrow}
      </motion.div>
      <h2 className="mt-5 overflow-hidden font-display text-[clamp(2rem,4.6vw,3.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-ivory">
        <motion.span
          className="block"
          initial={{ y: "105%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {title}{" "}
          {accent && <span className="font-serif text-[1.08em] font-normal normal-case italic tracking-normal text-gold-soft">{accent}</span>}
        </motion.span>
      </h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className={`mt-5 max-w-xl text-[15px] leading-relaxed text-mute ${center ? "mx-auto" : ""}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

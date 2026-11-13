"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { TickerBar } from "./TickerBar";

const NAV = [
  { href: "#collection", label: "Collection" },
  { href: "#inventory", label: "Inventory" },
  { href: "#calculator", label: "On-Road & EMI" },
  { href: "#trade-in", label: "Trade-In" },
  { href: "#experience", label: "Experience" },
];

export function ApexEmblem({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M20 4 L36 34 H29.5 L20 15.5 L10.5 34 H4 Z" fill="#E10600" />
      <path d="M14 27 H26" stroke="#E10600" strokeWidth="2.4" />
    </svg>
  );
}

export function SiteHeader({ onBook }: { onBook: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled ? "border-b border-line bg-ink/80 backdrop-blur-2xl" : "bg-transparent"
        }`}
      >
        <div className={`overflow-hidden transition-all duration-700 ${scrolled ? "max-h-0" : "max-h-10"}`}>
          <TickerBar />
        </div>
        <div className={`mx-auto flex max-w-[1480px] items-center justify-between gap-6 px-5 transition-all duration-700 lg:px-10 ${scrolled ? "py-3" : "py-6"}`}>
          <a href="#top" className="flex items-center gap-3">
            <ApexEmblem />
            <div className="leading-none">
              <p className="font-display text-[15px] font-extrabold uppercase tracking-[0.28em] text-ivory">Apex Motors</p>
              <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.34em] text-mute">Vadodara · Est. Lounge</p>
            </div>
          </a>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="group relative text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory/75 transition hover:text-ivory">
                {n.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBook}
              className="group hidden items-center gap-2 rounded-full border border-gold/50 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold transition-all duration-500 hover:bg-gold hover:text-ink sm:inline-flex"
            >
              Book Test Drive
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-45" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-ivory lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-gold/70" />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 95% 4%)" }}
            animate={{ clipPath: "circle(150% at 95% 4%)" }}
            exit={{ clipPath: "circle(0% at 95% 4%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[95] flex flex-col bg-coal px-6 py-6"
          >
            <div className="flex items-center justify-between">
              <ApexEmblem />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full border border-line">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-16 flex flex-col gap-6">
              {NAV.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                  className="font-display text-4xl font-extrabold uppercase text-ivory"
                >
                  <span className="mr-4 font-mono text-xs text-gold">0{i + 1}</span>
                  {n.label}
                </motion.a>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onBook();
              }}
              className="mt-auto rounded-full bg-gold py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-ink"
            >
              Schedule Doorstep Test Drive
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

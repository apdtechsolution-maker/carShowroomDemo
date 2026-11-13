"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CARS, type Car } from "@/lib/inventory";
import { formatINR } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

const FEATURED = ["gtr-coupe", "sovereign-s", "meridian-x5", "lumen-ev", "stealth-gt-cpo"]
  .map((id) => CARS.find((c) => c.id === id))
  .filter((c): c is Car => Boolean(c));

interface Props {
  onBook: (car: Car) => void;
}

/** Vertical scroll drives a horizontal filmstrip of hero cars (desktop); swipe strip on mobile. */
export function SignatureCollection({ onBook }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-68%"]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="collection" ref={ref} className="relative scroll-mt-20 bg-ink lg:h-[340vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 px-5 pt-24 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pt-16">
          <SectionHeading index="01" eyebrow="Signature Collection" title="The" accent="flagship five." />
          <div className="hidden w-64 lg:block">
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-[0.26em] text-mute">
              <span>Scroll to explore</span>
              <span className="font-mono">05</span>
            </div>
            <div className="mt-3 h-px bg-line">
              <motion.div style={{ width: bar }} className="h-px bg-gold" />
            </div>
          </div>
        </div>

        <div className="no-scrollbar mt-10 overflow-x-auto px-5 pb-20 lg:overflow-visible lg:px-10 lg:pb-0">
          <motion.div style={{ x }} className="flex w-max gap-6 max-lg:!transform-none">
            {FEATURED.map((car, i) => (
              <article
                key={car.id}
                className="group relative h-[62vh] min-h-[440px] w-[82vw] shrink-0 overflow-hidden rounded-[32px] border border-line bg-coal sm:w-[60vw] lg:w-[46vw]"
              >
                <img src={car.image} alt={car.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A08]/90 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0C0A08]/70 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <span className="absolute right-6 top-4 font-display text-[7rem] font-black leading-none text-outline-light">0{i + 1}</span>
                <span className="absolute left-6 top-6 rounded-full border border-[#F1EBE0]/20 bg-[#13100E]/50 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F1EBE0] backdrop-blur-md">
                  {car.body}
                </span>

                {/* rotating certification seal */}
                <div className="absolute bottom-32 right-6 hidden h-24 w-24 sm:block">
                  <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow">
                    <defs>
                      <path id="sealPath" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                    </defs>
                    <text className="fill-[#F1EBE0]/70 text-[8px] font-semibold uppercase tracking-[0.3em]">
                      <textPath href="#sealPath">Apex Certified · 200 Point · Vadodara ·</textPath>
                    </text>
                  </svg>
                  <span className="absolute inset-0 grid place-items-center font-display text-[11px] font-black text-gold">AX</span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                  <h3 className="font-display text-2xl font-extrabold uppercase leading-none text-[#F1EBE0] md:text-4xl">{car.name}</h3>
                  <p className="mt-3 max-w-md text-sm text-[#F1EBE0]/65">{car.tagline}</p>
                  <div className="mt-6 flex flex-wrap items-end justify-between gap-5 border-t border-[#F1EBE0]/15 pt-6">
                    <div className="flex gap-8">
                      <Spec value={`${car.bhp}`} label="BHP" />
                      <Spec value={car.fuel} label="Fuel" />
                      <Spec value={car.efficiency.split(" ")[0]} label={car.fuel === "EV" ? "km range" : "kmpl"} />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mute">Ex-showroom</p>
                        <p className="font-display text-xl font-bold text-gold">{formatINR(car.exShowroom)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onBook(car)}
                        aria-label={`Book test drive for ${car.name}`}
                        className="grid h-14 w-14 place-items-center rounded-full bg-ivory text-ink transition-all duration-500 hover:rotate-45 hover:bg-gold"
                      >
                        <ArrowUpRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Spec({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-lg font-bold text-[#F1EBE0]">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-mute">{label}</p>
    </div>
  );
}

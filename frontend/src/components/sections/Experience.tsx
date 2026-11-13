"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Home, KeyRound, ShieldCheck, Wallet } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const IMG_A = "https://images.pexels.com/photos/18108314/pexels-photo-18108314.jpeg?auto=compress&cs=tinysrgb&w=1400";
const IMG_B = "https://images.pexels.com/photos/36742939/pexels-photo-36742939.jpeg?auto=compress&cs=tinysrgb&w=1000";

const SERVICES = [
  { icon: Home, title: "Doorstep test drives", desc: "Any car in the collection, brought to your home or office in Vadodara, at your slot." },
  { icon: Wallet, title: "Paperless finance", desc: "Approval in minutes from 12 banking partners, with digital KYC and no branch visits." },
  { icon: ShieldCheck, title: "200-point certification", desc: "Every pre-owned car is inspected, documented and covered by a 5-year warranty." },
  { icon: KeyRound, title: "Same-day delivery", desc: "GJ-06 registration, HSRP, insurance and RC handled in-house, so you drive out the same day." },
];

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section id="experience" ref={ref} className="relative scroll-mt-20 overflow-hidden bg-coal py-28 lg:py-36">
      <div className="mx-auto grid max-w-[1480px] gap-16 px-5 lg:grid-cols-2 lg:px-10">
        <div className="relative h-[520px] lg:h-auto">
          <div className="absolute inset-0 overflow-hidden rounded-[32px] lg:right-16">
            <motion.img style={{ y: yA }} src={IMG_A} alt="Apex Motors showroom" className="h-[120%] w-full object-cover" />
          </div>
          <motion.div style={{ y: yB }} className="absolute -bottom-6 right-0 hidden h-64 w-56 overflow-hidden rounded-[24px] border-8 border-coal lg:block">
            <img src={IMG_B} alt="Luxury interior" className="h-full w-full object-cover" />
          </motion.div>
          <div className="absolute left-6 top-6 rounded-2xl border border-[#F1EBE0]/15 bg-[#13100E]/85 px-5 py-4 backdrop-blur-xl">
            <p className="font-display text-3xl font-black text-gold">4.9★</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F1EBE0]/85">2,400+ Google reviews</p>
          </div>
        </div>

        <div>
          <SectionHeading index="05" eyebrow="The Apex Experience" title="Ownership," accent="refined." description="From the first test drive to the day you hand over the keys, one concierge looks after you." />
          <div className="mt-12 divide-y divide-line border-y border-line">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex gap-6 py-7"
                >
                  <span className="font-mono text-xs text-mute">0{i + 1}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold uppercase text-ivory transition-colors duration-500 group-hover:text-gold">{s.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-mute">{s.desc}</p>
                  </div>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line text-gold transition-all duration-500 group-hover:rotate-[360deg] group-hover:bg-gold group-hover:text-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

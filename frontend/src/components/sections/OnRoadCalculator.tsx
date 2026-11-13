"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { CARS, findCar } from "@/lib/inventory";
import { REGISTRATION_CITIES, financeFor, onRoadBreakup } from "@/lib/pricing";
import { formatINR, waLink } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { btnGhost, btnWhatsApp, field, label, panel } from "@/components/ui/buttons";

const TENURES = [36, 48, 60, 84];

interface Props {
  carId: string;
  onCarChange: (id: string) => void;
  onBook: (carId: string) => void;
}

export function OnRoadCalculator({ carId, onCarChange, onBook }: Props) {
  const car = findCar(carId);
  const [downPct, setDownPct] = useState(20);
  const [tenure, setTenure] = useState(60);
  const [rate, setRate] = useState(9.5);
  const [cityCode, setCityCode] = useState("GJ-06");

  const b = useMemo(() => onRoadBreakup(car.exShowroom, car.fuel, cityCode), [car, cityCode]);
  const f = useMemo(() => financeFor(b.total, downPct, tenure, rate), [b.total, downPct, tenure, rate]);

  const lines = [
    { label: "Ex-showroom price", value: b.exShowroom },
    { label: `Road tax · ${(b.taxRate * 100).toFixed(1)}%${car.fuel === "EV" ? " EV" : ""}`, value: b.roadTax },
    { label: "Registration · HSRP · RC", value: b.regFee },
    { label: "Zero-dep insurance (1+3 yr)", value: b.insurance },
    { label: "FASTag", value: b.fastag },
  ];
  const segs = [
    { w: b.exShowroom / b.total, c: "bg-ivory" },
    { w: b.roadTax / b.total, c: "bg-gold" },
    { w: (b.insurance + b.regFee + b.fastag) / b.total, c: "bg-mute" },
  ];

  const msg = [
    "*APEX MOTORS — Price Breakup & Finance Sheet*",
    `Vehicle: ${car.name}`,
    `RTO: ${b.city.label}`,
    "",
    ...lines.map((l) => `${l.label}: ${formatINR(l.value)}`),
    `*On-Road: ${formatINR(b.total)}*`,
    "",
    `Down payment (${downPct}%): ${formatINR(f.downPayment)}`,
    `Loan: ${formatINR(f.loanAmount)} · ${tenure} mo @ ${rate.toFixed(1)}%`,
    `*EMI: ${formatINR(f.emi)}/month*`,
    `Total payable: ${formatINR(f.totalPayable)}`,
  ].join("\n");

  return (
    <section id="calculator" className="relative scroll-mt-20 overflow-hidden bg-coal py-20 sm:py-28 lg:py-36">
      <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[140px]" />
      <div className="relative mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          index="03"
          eyebrow="GJ-06 On-Road & Finance"
          title="Exact price."
          accent="Zero surprises."
          description="Road tax, registration, zero-dep insurance and FASTag, calculated live for Vadodara, Ahmedabad or Surat, with your EMI beside it."
        />

        <div className="mt-12 sm:mt-16 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Controls Panel */}
          <div className={`${panel} space-y-6 sm:space-y-8 p-5 sm:p-8 lg:p-10 min-w-0`}>
            <div>
              <label htmlFor="calc-car" className={label}>Vehicle</label>
              <select
                id="calc-car"
                value={car.id}
                onChange={(e) => onCarChange(e.target.value)}
                className={`${field} mt-3 text-xs sm:text-sm max-w-full truncate`}
              >
                {CARS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} — {formatINR(c.exShowroom)}</option>
                ))}
              </select>
            </div>

            <Slider
              title="Down payment"
              display={`${downPct}%`}
              sub={formatINR(f.downPayment)}
              min={20}
              max={80}
              step={5}
              value={downPct}
              onChange={setDownPct}
            />

            <Slider
              title="Interest rate"
              display={`${rate.toFixed(1)}%`}
              sub="per annum"
              min={8.5}
              max={11}
              step={0.1}
              value={rate}
              onChange={setRate}
            />

            <div>
              <p className={label}>Tenure</p>
              <div className="mt-3 grid grid-cols-4 rounded-full border border-line p-1">
                {TENURES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenure(t)}
                    className={`relative rounded-full py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-bold transition-colors ${
                      tenure === t ? "text-ink" : "text-mute hover:text-ivory"
                    }`}
                  >
                    {tenure === t && (
                      <motion.span
                        layoutId="tenure"
                        className="absolute inset-0 rounded-full bg-gold"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{t} mo</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className={label}>Registration city</p>
              <div className="mt-3 grid grid-cols-3 gap-1.5 sm:gap-2">
                {REGISTRATION_CITIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCityCode(c.code)}
                    className={`rounded-xl sm:rounded-2xl border p-2 sm:p-3 text-left transition min-w-0 ${
                      cityCode === c.code ? "border-gold bg-gold/10" : "border-line hover:border-ivory/30"
                    }`}
                  >
                    <span className="block font-mono text-[10px] sm:text-[11px] text-gold">{c.code}</span>
                    <span className="block text-[11px] sm:text-[12px] font-semibold text-ivory truncate">
                      {c.label.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown & EMI Panel */}
          <div className={`${panel} flex flex-col p-5 sm:p-8 lg:p-10 min-w-0`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0 flex-1">
                <p className={label}>On-road price · {b.city.code}</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={b.total}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35 }}
                    className="mt-2 font-display text-2xl xs:text-3xl sm:text-4xl lg:text-[2.75rem] font-black leading-tight text-ivory break-words"
                  >
                    {formatINR(b.total)}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="self-start sm:self-auto rounded-2xl border border-gold/40 bg-gold/10 px-4 py-2.5 sm:px-5 sm:py-3 text-left sm:text-right shrink-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-gold">Monthly EMI</p>
                <p className="font-display text-lg sm:text-xl font-extrabold text-gold">{formatINR(f.emi)}</p>
              </div>
            </div>

            <div className="mt-6 sm:mt-7 flex h-1.5 overflow-hidden rounded-full bg-line">
              {segs.map((s, i) => (
                <motion.div
                  key={i}
                  className={s.c}
                  animate={{ width: `${s.w * 100}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </div>

            <div className="mt-5 sm:mt-7 divide-y divide-line">
              {lines.map((l) => (
                <div key={l.label} className="flex items-center justify-between gap-2 py-3 text-xs sm:text-sm">
                  <span className="text-mute truncate">{l.label}</span>
                  <span className="font-mono text-ivory shrink-0">{formatINR(l.value)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              <Mini label="Loan" value={formatINR(f.loanAmount)} />
              <Mini label="Interest" value={formatINR(f.totalInterest)} />
              <Mini label="Total" value={formatINR(f.totalPayable)} />
            </div>

            <div className="mt-7 sm:mt-8 flex flex-col gap-3 sm:grid sm:grid-cols-[1.4fr_1fr]">
              <a
                href={waLink(msg)}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btnWhatsApp} w-full text-center justify-center`}
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span className="truncate">Send to WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => onBook(car.id)}
                className={`${btnGhost} w-full text-center justify-center`}
              >
                <span>Test Drive</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </button>
            </div>

            <p className="mt-4 sm:mt-5 text-[11px] text-mute">
              Indicative RTO slabs and premiums; final amounts confirmed at the RTO.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider(p: {
  title: string;
  display: string;
  sub: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-1 sm:gap-2">
        <p className={label}>{p.title}</p>
        <div className="flex items-baseline gap-1.5 text-right">
          <span className="font-display text-lg sm:text-2xl font-extrabold text-ivory">{p.display}</span>
          <span className="font-sans text-[11px] sm:text-xs font-medium text-mute">{p.sub}</span>
        </div>
      </div>
      <input
        className="mt-3 sm:mt-4 w-full"
        type="range"
        min={p.min}
        max={p.max}
        step={p.step}
        value={p.value}
        onChange={(e) => p.onChange(Number(e.target.value))}
        aria-label={p.title}
      />
    </div>
  );
}

function Mini({ label: l, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-line bg-ink/40 p-2 sm:p-3.5 min-w-0">
      <p className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.2em] text-mute truncate">{l}</p>
      <p className="mt-1 truncate font-mono text-[11px] sm:text-[12px] font-medium text-ivory">{value}</p>
    </div>
  );
}

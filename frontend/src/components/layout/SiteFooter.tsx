import { Award, FileCheck, MapPin, Phone, ShieldCheck, Umbrella } from "lucide-react";
import { ApexEmblem } from "./SiteHeader";
import { BRAND } from "@/lib/site";

const BADGES = [
  { icon: ShieldCheck, title: "200-Point Certified Inspection" },
  { icon: Award, title: "5-Year Warranty" },
  { icon: Umbrella, title: "Zero-Dep Insurance Partners" },
  { icon: FileCheck, title: "Instant RC Transfer" },
];

const LINKS = [
  { href: "#collection", label: "Signature Collection" },
  { href: "#inventory", label: "Verified Inventory" },
  { href: "#calculator", label: "On-Road & EMI" },
  { href: "#trade-in", label: "Sell / Trade-In" },
  { href: "#experience", label: "Experience" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-24">
      <div className="mx-auto max-w-[1480px] px-5 lg:px-10">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-line bg-line lg:grid-cols-4">
          {BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex items-center gap-4 bg-ink p-6">
                <Icon className="h-6 w-6 shrink-0 text-gold" strokeWidth={1.4} />
                <p className="text-[12px] font-semibold uppercase leading-snug tracking-[0.14em] text-ivory">{b.title}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <ApexEmblem className="h-10 w-10" />
              <p className="font-display text-xl font-extrabold uppercase tracking-[0.26em] text-ivory">Apex Motors</p>
            </div>
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-mute">{BRAND.tagline}. An authorized luxury and certified pre-owned showroom in Vadodara, Gujarat.</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">Explore</p>
            <ul className="mt-6 space-y-3">
              {LINKS.map((l) => (
                <li key={l.href}><a href={l.href} className="text-[14px] text-ivory/80 transition hover:pl-2 hover:text-gold">{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">Lounge</p>
            <p className="mt-6 flex gap-3 text-[14px] text-ivory/80"><MapPin className="h-4 w-4 shrink-0 text-mute" /> Race Course Road, Vadodara, Gujarat 390007</p>
            <p className="mt-3 flex gap-3 text-[14px] text-ivory/80"><Phone className="h-4 w-4 shrink-0 text-mute" /> Open daily · 10:00 AM – 9:00 PM</p>
            <p className="mt-6 text-[11px] leading-relaxed text-mute">Prices are indicative. On-road estimates use GJ-06 slabs; the RTO confirms final figures.</p>
          </div>
        </div>
      </div>

      <p className="pointer-events-none mt-20 select-none whitespace-nowrap text-center font-display text-[19vw] font-black uppercase leading-[0.8] text-outline">Apex</p>

      <div className="border-t border-line bg-coal">
        <div className="mx-auto max-w-[1480px] px-5 py-10 lg:px-10">
          <a href="#top" className="group block rounded-[24px] border border-gold/30 bg-gradient-to-r from-gold/15 via-transparent to-transparent p-7 transition hover:border-gold/60 sm:p-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">APD Solutions · Vadodara</p>
            <p className="mt-3 font-display text-lg font-extrabold uppercase leading-snug text-ivory sm:text-2xl">{BRAND.agencyBanner}</p>
          </a>
          <div className="mt-8 flex flex-col justify-between gap-3 text-[11px] text-mute sm:flex-row">
            <p>© {new Date().getFullYear()} Apex Motors. All rights reserved.</p>
            <p className="uppercase tracking-[0.14em]">{BRAND.footerCredit}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

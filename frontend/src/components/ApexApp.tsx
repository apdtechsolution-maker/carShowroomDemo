"use client";

import { useCallback, useState } from "react";
import { IntroLoader } from "@/components/layout/IntroLoader";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero, type QuickSearch } from "@/components/sections/Hero";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { SignatureCollection } from "@/components/sections/SignatureCollection";
import { Performance } from "@/components/sections/Performance";
import { DriveStrip } from "@/components/sections/DriveStrip";
import { Inventory } from "@/components/sections/Inventory";
import { OnRoadCalculator } from "@/components/sections/OnRoadCalculator";
import { TradeIn } from "@/components/sections/TradeIn";
import { Experience } from "@/components/sections/Experience";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/FinalCta";
import { TestDriveDrawer } from "@/components/sections/TestDriveDrawer";
import { AIConcierge } from "@/components/sections/AIConcierge";
import type { Car } from "@/lib/inventory";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ApexApp() {
  const [calcCarId, setCalcCarId] = useState("meridian-x5");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCarId, setDrawerCarId] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<(QuickSearch & { nonce: number }) | null>(null);

  const openDrawer = useCallback((carId?: string) => {
    setDrawerCarId(carId);
    setDrawerOpen(true);
  }, []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const goCalculator = useCallback(() => scrollToSection("calculator"), []);

  const calculateFor = useCallback((car: Car) => {
    setCalcCarId(car.id);
    scrollToSection("calculator");
  }, []);

  const runSearch = useCallback((q: QuickSearch) => {
    setSearch({ ...q, nonce: Date.now() });
    scrollToSection("inventory");
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-ink text-ivory">
      <IntroLoader />
      <SiteHeader onBook={() => openDrawer()} />
      <main>
        <Hero onBook={() => openDrawer()} onCalculate={goCalculator} onSearch={runSearch} />
        <BrandMarquee />
        <SignatureCollection onBook={(car) => openDrawer(car.id)} />
        <Performance />
        <DriveStrip />
        <Inventory search={search} onCalculate={calculateFor} onBook={(car) => openDrawer(car.id)} />
        <OnRoadCalculator carId={calcCarId} onCarChange={setCalcCarId} onBook={(id) => openDrawer(id)} />
        <TradeIn />
        <Experience />
        <Testimonials />
        <FinalCta onBook={() => openDrawer()} />
      </main>
      <SiteFooter />
      <AIConcierge onBook={() => openDrawer()} onCalculate={goCalculator} />
      <TestDriveDrawer open={drawerOpen} onClose={closeDrawer} initialCarId={drawerCarId} />
    </div>
  );
}

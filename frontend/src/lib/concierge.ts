import { CARS } from "./inventory";
import { financeFor, onRoadBreakup } from "./pricing";
import { formatINR } from "./site";

export interface ConciergeReply {
  text: string;
  action?: "book" | "calculator";
}

/** Deterministic, offline Apex AI Auto Advisor — answers from live inventory & GJ-06 tax logic. */
export function answerConcierge(input: string): ConciergeReply {
  const q = input.toLowerCase();

  if (/(book|test\s*-?drive|sunday|doorstep|weekend|slot)/.test(q)) {
    const sunday = /sunday/.test(q);
    return {
      action: "book",
      text:
        "Done — opening your VIP Test Drive Pass.\n" +
        (sunday
          ? "Sunday slots: 11:00 AM, 02:00 PM, 05:00 PM and 07:30 PM. Pick a Sunday date in the form and choose your slot.\n"
          : "Choose At-Home Doorstep (Vadodara) or VIP Showroom Lounge, then a date and slot.\n") +
        "Your booking is dispatched to our WhatsApp desk instantly.",
    };
  }

  if (/(document|kyc|paperwork|papers|requirement)/.test(q) || (/loan/.test(q) && /(need|require|what)/.test(q))) {
    return {
      text:
        "Instant car-loan documents (digital KYC, ~2 minutes):\n" +
        "• Aadhaar card & PAN card\n" +
        "• Last 6 months bank statements (salary or business account)\n" +
        "• Salaried: last 3 salary slips + Form 16\n" +
        "• Self-employed: last 2 years ITR with computation\n" +
        "• Proof of address (Aadhaar / utility bill / passport)\n" +
        "• 2 recent passport photographs\n" +
        "Tip: a 20% down payment and a 60-month tenure gives the most comfortable EMI.",
    };
  }

  if (/(rto|tax|insurance|fastag|on-?road|registration)/.test(q)) {
    if (/(ev|electric)/.test(q)) {
      const lines = CARS.filter((c) => c.fuel === "EV").map((c) => {
        const b = onRoadBreakup(c.exShowroom, c.fuel);
        return (
          `• ${c.name}: ex-showroom ${formatINR(c.exShowroom)} + road tax ${formatINR(b.roadTax)} ` +
          `(${(b.taxRate * 100).toFixed(0)}% EV slab) + zero-dep insurance ${formatINR(b.insurance)} + ` +
          `FASTag ${formatINR(b.fastag)} + GJ-06 registration ${formatINR(b.regFee)} = ${formatINR(b.total)} on-road`
        );
      });
      return {
        text:
          "GJ-06 (Vadodara) on-road estimate for EVs:\n" +
          lines.join("\n") +
          "\nEV road-tax concessions are policy-dependent — the RTO confirms the final figure.",
      };
    }
    const example = onRoadBreakup(2450000, "Petrol");
    return {
      text:
        "GJ-06 on-road price = ex-showroom + Gujarat road tax (slab-based, ~10–18%) + registration/HSRP/RC + " +
        `comprehensive zero-dep insurance + FASTag.\nExample — Familia 7-Seat at ${formatINR(2450000)}: ` +
        `road tax ${formatINR(example.roadTax)}, insurance ${formatINR(example.insurance)}, ` +
        `total on-road ${formatINR(example.total)}. Use the On-Road & EMI calculator for any car.`,
    };
  }

  if (/(seater|seat).*|(7|seven)[\s-]*seat/.test(q) && /(suv|seat|seven|7)/.test(q)) {
    const suvs = CARS.filter((c) => c.seats >= 7 && c.exShowroom <= 3500000);
    if (suvs.length) {
      return {
        text:
          "Best 7-seaters under ₹35 Lakhs in stock:\n" +
          suvs
            .map((c) => {
              const f = financeFor(onRoadBreakup(c.exShowroom, c.fuel).total, 20, 60, 9.5);
              return `• ${c.name} — ${formatINR(c.exShowroom)} ex-showroom, ${c.efficiency}, ${c.bootLitres} L boot, EMI ≈ ${formatINR(f.emi)}/mo (20% down, 60 mo @ 9.5%)`;
            })
            .join("\n") +
          "\nThe Summit Aviator Hybrid 7-Seater (₹74.9L) is our premium 3-row option.",
      };
    }
  }

  if (/(emi|calculat|finance|down payment|tenure|interest)/.test(q)) {
    const f = financeFor(2450000 + 0, 20, 60, 9.5);
    return {
      action: "calculator",
      text:
        `Opening the On-Road & EMI calculator. Example: Familia 7-Seat at 20% down, 60 months @ 9.5% ≈ ${formatINR(f.emi)}/month. ` +
        "Adjust down payment (20–80%), tenure (36/48/60/84 months) and rate (8.5–11%) to see your exact figures.",
    };
  }

  return {
    text:
      "Hello, I'm the Apex AI Auto Advisor. I can help with:\n" +
      "• Finding 7-seaters, EVs, sedans, coupés and certified pre-owned cars\n" +
      "• GJ-06 RTO road tax, zero-dep insurance and FASTag on any car\n" +
      "• Documents needed for an instant car loan\n" +
      "• Booking a doorstep or showroom test drive\n" +
      "What would you like to explore?",
  };
}

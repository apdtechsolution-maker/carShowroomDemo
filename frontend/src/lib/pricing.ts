import type { FuelType } from "./inventory";

export interface RegistrationCity {
  code: string;
  label: string;
  regFee: number;
  taxSurcharge: number;
}

/** Estimated Gujarat registration desks. Figures are indicative — always confirm with RTO. */
export const REGISTRATION_CITIES: RegistrationCity[] = [
  { code: "GJ-06", label: "Vadodara (GJ-06)", regFee: 4500, taxSurcharge: 0 },
  { code: "GJ-01", label: "Ahmedabad (GJ-01)", regFee: 5200, taxSurcharge: 0.01 },
  { code: "GJ-05", label: "Surat (GJ-05)", regFee: 4800, taxSurcharge: 0 },
];

export const FASTAG_FEE = 500;
export const EV_ROAD_TAX_RATE = 0.05;

/** Gujarat-style slab road tax (estimated). */
export function roadTaxRate(exShowroom: number, fuel: FuelType, surcharge = 0): number {
  if (fuel === "EV") return EV_ROAD_TAX_RATE + surcharge;
  let base = 0.18;
  if (exShowroom <= 1000000) base = 0.1;
  else if (exShowroom <= 2000000) base = 0.13;
  else if (exShowroom <= 5000000) base = 0.16;
  return base + surcharge;
}

/** Comprehensive zero-depreciation insurance (1 OD + 3 TP estimate). */
export function zeroDepInsurance(exShowroom: number): number {
  return Math.max(38000, Math.round(exShowroom * 0.031));
}

export interface OnRoadBreakup {
  exShowroom: number;
  taxRate: number;
  roadTax: number;
  regFee: number;
  insurance: number;
  fastag: number;
  total: number;
  city: RegistrationCity;
}

export function onRoadBreakup(exShowroom: number, fuel: FuelType, cityCode = "GJ-06"): OnRoadBreakup {
  const city = REGISTRATION_CITIES.find((c) => c.code === cityCode) ?? REGISTRATION_CITIES[0];
  const taxRate = roadTaxRate(exShowroom, fuel, city.taxSurcharge);
  const roadTax = Math.round(exShowroom * taxRate);
  const insurance = zeroDepInsurance(exShowroom);
  const total = exShowroom + roadTax + city.regFee + insurance + FASTAG_FEE;
  return { exShowroom, taxRate, roadTax, regFee: city.regFee, insurance, fastag: FASTAG_FEE, total, city };
}

/** Standard reducing-balance EMI. */
export function emiFor(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 12 / 100;
  if (r === 0) return Math.round(principal / months);
  const factor = Math.pow(1 + r, months);
  return Math.round((principal * r * factor) / (factor - 1));
}

export interface FinanceBreakup {
  downPayment: number;
  loanAmount: number;
  emi: number;
  totalPayable: number;
  totalInterest: number;
}

export function financeFor(onRoad: number, downPct: number, months: number, rate: number): FinanceBreakup {
  const downPayment = Math.round((onRoad * downPct) / 100);
  const loanAmount = Math.max(0, onRoad - downPayment);
  const emi = emiFor(loanAmount, rate, months);
  const totalPayable = emi * months + downPayment;
  return {
    downPayment,
    loanAmount,
    emi,
    totalPayable,
    totalInterest: Math.max(0, emi * months - loanAmount),
  };
}

/* ---------- Trade-in valuation ---------- */

export const TRADE_BASE: Record<string, number> = {
  "Maruti Suzuki": 950000,
  Hyundai: 1050000,
  Tata: 980000,
  Mahindra: 1400000,
  Kia: 1300000,
  Toyota: 1800000,
  Honda: 1500000,
  Skoda: 1400000,
  Volkswagen: 1350000,
  MG: 1300000,
  Other: 1000000,
};

export const CURRENT_YEAR = 2026;
export type Condition = "Mint" | "Good" | "Fair";
export const CONDITION_FACTOR: Record<Condition, number> = { Mint: 1, Good: 0.9, Fair: 0.78 };

export interface TradeInValuation {
  low: number;
  mid: number;
  high: number;
}

const roundK = (n: number) => Math.round(n / 1000) * 1000;

export function tradeInValue(brand: string, year: number, km: number, condition: Condition): TradeInValuation {
  const age = Math.max(0, CURRENT_YEAR - year);
  const base = TRADE_BASE[brand] ?? TRADE_BASE.Other;
  const depreciation = Math.pow(0.87, age);
  const expectedKm = Math.max(1, age) * 12000;
  const over = km - expectedKm;
  const kmFactor = Math.min(1.05, Math.max(0.7, 1 - (over / 100000) * 0.08));
  const mid = roundK(base * depreciation * kmFactor * CONDITION_FACTOR[condition]);
  return { low: roundK(mid * 0.94), mid, high: roundK(mid * 1.06) };
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { tradeInLeads } from "@/db/schema";
import { CONDITION_FACTOR, TRADE_BASE, tradeInValue, type Condition } from "@/lib/pricing";

export const dynamic = "force-dynamic";

interface LocalLead {
  ref: string;
  brand: string;
  year: number;
  km: number;
  condition: Condition;
  valueLow: number;
  valueHigh: number;
  createdAt: string;
}

const globalForLeads = globalThis as typeof globalThis & {
  __localLeads?: LocalLead[];
};
const localLeads = (globalForLeads.__localLeads ??= []);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const brand = String(body.brand ?? "");
  const year = Number(body.year);
  const km = Number(body.km);
  const condition = String(body.condition ?? "") as Condition;

  if (!(brand in TRADE_BASE)) return NextResponse.json({ error: "Invalid brand." }, { status: 400 });
  if (!Number.isInteger(year) || year < 2018 || year > 2025) {
    return NextResponse.json({ error: "Year must be between 2018 and 2025." }, { status: 400 });
  }
  if (!Number.isFinite(km) || km < 0 || km > 300000) {
    return NextResponse.json({ error: "Invalid kilometres." }, { status: 400 });
  }
  if (!(condition in CONDITION_FACTOR)) return NextResponse.json({ error: "Invalid condition." }, { status: 400 });

  // Valuation is computed server-side so the stored lead is authoritative.
  const value = tradeInValue(brand, year, Math.round(km), condition);
  const ref = `TIL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  // Store in memory (frontend-only / serverless mode)
  localLeads.push({
    ref,
    brand,
    year,
    km: Math.round(km),
    condition,
    valueLow: value.low,
    valueHigh: value.high,
    createdAt: new Date().toISOString(),
  });

  let saved = true;
  if (db) {
    try {
      await db.insert(tradeInLeads).values({
        ref,
        brand,
        year,
        km: Math.round(km),
        condition,
        valueLow: value.low,
        valueHigh: value.high,
      });
    } catch (error) {
      console.warn("[leads] Optional database insert skipped:", error);
    }
  }

  return NextResponse.json({ ref, saved, low: value.low, high: value.high }, { status: 201 });
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { testDriveBookings } from "@/db/schema";
import { CARS } from "@/lib/inventory";

export const dynamic = "force-dynamic";

const EXPERIENCES = ["At-Home Doorstep Test Drive (Vadodara)", "VIP Showroom Lounge Visit"];
const SLOTS = ["11:00 AM", "02:00 PM", "05:00 PM", "07:30 PM"];

interface LocalBooking {
  ref: string;
  experience: string;
  carId: string;
  carName: string;
  bookingDate: string;
  timeSlot: string;
  customerName: string;
  phone: string;
  createdAt: string;
}

const globalForBookings = globalThis as typeof globalThis & {
  __localBookings?: LocalBooking[];
};
const localBookings = (globalForBookings.__localBookings ??= []);

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail("Invalid request body.");
  }

  const experience = String(body.experience ?? "");
  const carId = String(body.carId ?? "");
  const bookingDate = String(body.bookingDate ?? "");
  const timeSlot = String(body.timeSlot ?? "");
  const customerName = String(body.customerName ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  const car = CARS.find((c) => c.id === carId);
  if (!EXPERIENCES.includes(experience)) return fail("Please choose a test-drive experience.");
  if (!car) return fail("Please choose a valid vehicle.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) return fail("Please choose a valid date.");
  if (!SLOTS.includes(timeSlot)) return fail("Please choose a valid time slot.");
  if (customerName.length < 2 || customerName.length > 120) return fail("Please enter your name.");
  if (phone.replace(/\D/g, "").length < 10) return fail("Please enter a valid mobile number.");

  const ref = `APX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  // Store in memory (frontend-only / serverless mode)
  localBookings.push({
    ref,
    experience,
    carId: car.id,
    carName: car.name,
    bookingDate,
    timeSlot,
    customerName,
    phone,
    createdAt: new Date().toISOString(),
  });

  let saved = true;
  // If PostgreSQL is configured, persist to database as well
  if (db) {
    try {
      await db.insert(testDriveBookings).values({
        ref,
        experience,
        carId: car.id,
        carName: car.name,
        bookingDate,
        timeSlot,
        customerName,
        phone,
      });
    } catch (error) {
      console.warn("[bookings] Optional database insert skipped:", error);
    }
  }

  return NextResponse.json({ ref, saved, car: car.name }, { status: 201 });
}

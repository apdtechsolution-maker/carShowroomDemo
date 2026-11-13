import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const testDriveBookings = pgTable("test_drive_bookings", {
  id: serial("id").primaryKey(),
  ref: varchar("ref", { length: 32 }).notNull().unique(),
  experience: varchar("experience", { length: 64 }).notNull(),
  carId: varchar("car_id", { length: 64 }).notNull(),
  carName: varchar("car_name", { length: 160 }).notNull(),
  bookingDate: varchar("booking_date", { length: 16 }).notNull(),
  timeSlot: varchar("time_slot", { length: 16 }).notNull(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tradeInLeads = pgTable("trade_in_leads", {
  id: serial("id").primaryKey(),
  ref: varchar("ref", { length: 32 }).notNull().unique(),
  brand: varchar("brand", { length: 64 }).notNull(),
  year: integer("year").notNull(),
  km: integer("km").notNull(),
  condition: varchar("condition", { length: 16 }).notNull(),
  valueLow: integer("value_low").notNull(),
  valueHigh: integer("value_high").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

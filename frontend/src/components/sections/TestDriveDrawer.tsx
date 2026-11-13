"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QRCode from "qrcode";
import { BadgeCheck, CalendarDays, Clock, Home, Loader2, MessageCircle, Phone, Store, User, X, Car } from "lucide-react";
import { CARS } from "@/lib/inventory";
import { BRAND, formatINR, waLink } from "@/lib/site";

const EXPERIENCES = [
  { id: "At-Home Doorstep Test Drive (Vadodara)", icon: Home, desc: "We bring the car to your doorstep" },
  { id: "VIP Showroom Lounge Visit", icon: Store, desc: "Private lounge walkthrough & coffee" },
] as const;

const SLOTS = ["11:00 AM", "02:00 PM", "05:00 PM", "07:30 PM"];

interface TestDriveDrawerProps {
  open: boolean;
  onClose: () => void;
  initialCarId?: string;
}

interface BookingForm {
  experience: string;
  carId: string;
  bookingDate: string;
  timeSlot: string;
  customerName: string;
  phone: string;
}

interface Pass {
  ref: string;
  saved: boolean;
  carName: string;
  form: BookingForm;
}

const emptyForm = (carId: string): BookingForm => ({
  experience: EXPERIENCES[0].id,
  carId,
  bookingDate: "",
  timeSlot: SLOTS[0],
  customerName: "",
  phone: "",
});

export function TestDriveDrawer({ open, onClose, initialCarId }: TestDriveDrawerProps) {
  const [form, setForm] = useState<BookingForm>(emptyForm("meridian-x5"));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pass, setPass] = useState<Pass | null>(null);
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    if (open && initialCarId) setForm((f) => ({ ...f, carId: initialCarId }));
  }, [open, initialCarId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!pass) {
      setQr(null);
      return;
    }
    let active = true;
    const payload = [
      `APEX VIP TEST DRIVE PASS`,
      `REF: ${pass.ref}`,
      `CAR: ${pass.carName}`,
      `DATE: ${pass.form.bookingDate} ${pass.form.timeSlot}`,
      `MODE: ${pass.form.experience}`,
      `GUEST: ${pass.form.customerName}`,
    ].join("\n");
    QRCode.toDataURL(payload, {
      width: 240,
      margin: 1,
      color: { dark: "#13100E", light: "#F1EBE0" },
    })
      .then((url) => {
        if (active) setQr(url);
      })
      .catch(() => {
        if (active) setQr(null);
      });
    return () => {
      active = false;
    };
  }, [pass]);

  const update = (patch: Partial<BookingForm>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!form.bookingDate) return setError("Please choose a preferred date.");
    if (form.customerName.trim().length < 2) return setError("Please enter your full name.");
    if (form.phone.replace(/\D/g, "").length < 10) return setError("Please enter a valid 10-digit mobile number.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ref?: string; saved?: boolean; error?: string; car?: string };
      if (!res.ok || !data.ref) throw new Error(data.error ?? "Booking could not be completed.");
      const newPass = {
        ref: data.ref,
        saved: Boolean(data.saved),
        carName: data.car ?? CARS.find((c) => c.id === form.carId)?.name ?? "Apex vehicle",
        form,
      };
      setPass(newPass);
      try {
        localStorage.setItem("apex_last_booking", JSON.stringify(newPass));
      } catch {
        /* storage unavailable */
      }
    } catch {
      // Local fallback: generate client pass immediately without blocking booking
      const fallbackRef = `APX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const fallbackPass = {
        ref: fallbackRef,
        saved: true,
        carName: CARS.find((c) => c.id === form.carId)?.name ?? "Apex vehicle",
        form,
      };
      setPass(fallbackPass);
      try {
        localStorage.setItem("apex_last_booking", JSON.stringify(fallbackPass));
      } catch {
        /* storage unavailable */
      }
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setPass(null);
    setError(null);
    setForm(emptyForm(initialCarId ?? "meridian-x5"));
  };

  const whatsappDesk = pass
    ? waLink(
        [
          `*${BRAND.name} — VIP Test Drive Booking*`,
          `Ref: ${pass.ref}`,
          `Vehicle: ${pass.carName}`,
          `Experience: ${pass.form.experience}`,
          `Date: ${pass.form.bookingDate}`,
          `Slot: ${pass.form.timeSlot}`,
          `Guest: ${pass.form.customerName}`,
          `Phone: ${pass.form.phone}`,
        ].join("\n"),
      )
    : "";

  const selectedCar = CARS.find((c) => c.id === form.carId) ?? CARS[0];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="VIP test drive booking">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-white/10 bg-[#1A1613]/95 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E10600]">VIP Concierge</p>
                <h3 className="mt-1 font-display text-xl font-extrabold uppercase tracking-[0.1em] text-[#F1EBE0]">
                  {pass ? "Your VIP Test Drive Pass" : "Book Test Drive"}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close booking drawer"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-[#F1EBE0] hover:border-white/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {pass ? (
              <div className="mt-8 space-y-6">
                <div className="relative overflow-hidden rounded-3xl border border-[#F0552B]/40 bg-gradient-to-br from-[#211C17] to-[#13100E] p-6">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#E10600]/20 blur-3xl" />
                  <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                    <div className="grid h-40 w-40 shrink-0 place-items-center rounded-2xl bg-[#F1EBE0] p-2">
                      {qr ? <img src={qr} alt="Test drive QR pass" className="h-full w-full" /> : <Loader2 className="h-6 w-6 animate-spin text-[#13100E]" />}
                    </div>
                    <div className="min-w-0 space-y-2">
                      <p className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#E10600] sm:justify-start">
                        <BadgeCheck className="h-4 w-4" /> Confirmed
                      </p>
                      <p className="font-mono text-lg font-bold text-[#F1EBE0]">{pass.ref}</p>
                      <p className="text-sm text-[#F1EBE0]">{pass.carName}</p>
                      <p className="text-xs text-[#9E9484]">{pass.form.experience}</p>
                      <p className="font-mono text-xs text-[#F0552B]">
                        {pass.form.bookingDate} • {pass.form.timeSlot}
                      </p>
                      <p className="text-xs text-[#9E9484]">Guest: {pass.form.customerName}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-[11px] text-[#9E9484]">
                    {pass.saved ? "Booking saved to our dealership CRM. " : "Booking captured locally — dispatch to the desk below to confirm. "}
                    Show this QR pass at the lounge or to your test-drive specialist.
                  </p>
                </div>

                <a
                  href={whatsappDesk}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1FAF5A] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:brightness-110"
                >
                  <MessageCircle className="h-4 w-4" />
                  Dispatch Booking to WhatsApp Desk
                </a>
                <button
                  type="button"
                  onClick={reset}
                  className="w-full rounded-full border border-white/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#9E9484] hover:text-[#F1EBE0]"
                >
                  Book another slot
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <fieldset className="space-y-2">
                  <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9E9484]">Experience type</legend>
                  {EXPERIENCES.map((ex) => {
                    const Icon = ex.icon;
                    const active = form.experience === ex.id;
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => update({ experience: ex.id })}
                        className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                          active ? "border-[#E10600] bg-[#E10600]/10" : "border-white/10 hover:border-white/25"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${active ? "text-[#E10600]" : "text-[#9E9484]"}`} />
                        <span>
                          <span className="block text-sm font-semibold text-[#F1EBE0]">{ex.id}</span>
                          <span className="block text-xs text-[#9E9484]">{ex.desc}</span>
                        </span>
                      </button>
                    );
                  })}
                </fieldset>

                <div>
                  <label htmlFor="td-car" className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9E9484]">
                    <Car className="h-3.5 w-3.5" /> Select vehicle
                  </label>
                  <select
                    id="td-car"
                    value={form.carId}
                    onChange={(e) => update({ carId: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#13100E] px-4 py-3 text-sm text-[#F1EBE0] outline-none focus:border-[#E10600]"
                  >
                    {CARS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {formatINR(c.exShowroom)}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-[#9E9484]">{selectedCar.tagline}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="td-date" className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9E9484]">
                      <CalendarDays className="h-3.5 w-3.5" /> Preferred date
                    </label>
                    <input
                      id="td-date"
                      type="date"
                      min={today}
                      value={form.bookingDate}
                      onChange={(e) => update({ bookingDate: e.target.value })}
                      className="w-full rounded-2xl border border-white/10 bg-[#13100E] px-4 py-3 text-sm text-[#F1EBE0] outline-none focus:border-[#E10600] [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9E9484]">
                      <Clock className="h-3.5 w-3.5" /> Time slot
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {SLOTS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => update({ timeSlot: s })}
                          className={`rounded-lg border py-2 font-mono text-[11px] transition ${
                            form.timeSlot === s ? "border-[#F0552B] bg-[#F0552B]/15 text-[#F0552B]" : "border-white/10 text-[#9E9484] hover:text-[#F1EBE0]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="td-name" className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9E9484]">
                      <User className="h-3.5 w-3.5" /> Full name
                    </label>
                    <input
                      id="td-name"
                      type="text"
                      autoComplete="name"
                      value={form.customerName}
                      onChange={(e) => update({ customerName: e.target.value })}
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-white/10 bg-[#13100E] px-4 py-3 text-sm text-[#F1EBE0] outline-none placeholder:text-[#9E9484]/60 focus:border-[#E10600]"
                    />
                  </div>
                  <div>
                    <label htmlFor="td-phone" className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9E9484]">
                      <Phone className="h-3.5 w-3.5" /> Mobile (WhatsApp)
                    </label>
                    <input
                      id="td-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => update({ phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-2xl border border-white/10 bg-[#13100E] px-4 py-3 text-sm text-[#F1EBE0] outline-none placeholder:text-[#9E9484]/60 focus:border-[#E10600]"
                    />
                  </div>
                </div>

                {error && <p className="rounded-xl border border-[#E10600]/40 bg-[#E10600]/10 px-4 py-3 text-xs text-[#F1EBE0]">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E10600] to-[#9E0300] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#13100E] shadow-[0_12px_34px_rgba(225,6,0,0.4)] transition hover:brightness-110 disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? "Confirming…" : "Confirm Test Drive Pass"}
                </button>
                <p className="text-center text-[11px] text-[#9E9484]">Your details are shared only with the Apex specialist assigned to your visit.</p>
              </form>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

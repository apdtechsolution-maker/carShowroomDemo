export const BRAND = {
  name: "APEX MOTORS",
  tagline: "3D Luxury & Performance Auto Lounge",
  badge: "3D Auto Studio",
  location: "Vadodara, Gujarat",
  footerCredit:
    "Flagship 3D Automotive Dealership Platform Engineered by APD Solutions, Vadodara",
  agencyBanner:
    "Flagship 3D Automotive Showroom & Automated Lead Engine Engineered by APD Solutions (Vadodara) — Transform Your Car Dealership Today.",
} as const;

const RAW_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919900000000";

/** Dealership WhatsApp desk number (digits only, country code included). */
export const WHATSAPP_NUMBER: string = RAW_WHATSAPP.replace(/\D/g, "") || "919900000000";

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Indian digit grouping: ₹1,48,00,000 */
export function formatINR(value: number): string {
  const sign = value < 0 ? "-" : "";
  const digits = Math.round(Math.abs(value)).toString();
  let formatted: string;
  if (digits.length <= 3) {
    formatted = digits;
  } else {
    const last3 = digits.slice(-3);
    const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    formatted = `${rest},${last3}`;
  }
  return `${sign}₹${formatted}`;
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-IN");
}

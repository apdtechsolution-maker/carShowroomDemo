import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "APEX MOTORS — Luxury & Performance Auto Lounge, Vadodara",
  description:
    "APEX MOTORS, Vadodara: luxury and certified pre-owned cars, instant GJ-06 on-road prices, EMI calculator, trade-in valuation and doorstep VIP test drives.",
  applicationName: "APEX MOTORS",
};

export const viewport: Viewport = { themeColor: "#F2EDE3", colorScheme: "light" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        <link rel="preconnect" href="https://images.pexels.com" />
      </head>
      <body className="bg-ink font-sans text-ivory antialiased">{children}</body>
    </html>
  );
}

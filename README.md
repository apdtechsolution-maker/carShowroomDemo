# Apex Motors — 3D Luxury & Performance Auto Lounge

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45.2-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.20.0-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

> **Flagship 3D Automotive Showroom & Automated Lead Engine**  
> Engineered by **APD Solutions** (Vadodara, Gujarat) — Designed to transform physical car dealerships into immersive digital automotive lounges.

---

## ✦ Overview

**Apex Motors** is an immersive digital dealership platform designed for high-end luxury, performance, and electric vehicle showrooms. Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Drizzle ORM**, it bridges physical car lounges with modern web experiences. 

Prospective buyers can browse multi-segment inventory, inspect 3D perspective vehicle cards, compare models side-by-side, estimate on-road pricing with accurate **Gujarat RTO tax slabs**, simulate reducing-balance bank loans, evaluate trade-in vehicles, and generate instant **VIP Test Drive Passes with scannable dynamic QR codes**.

---

## ✦ Key Features

### 1. 🏎️ 3D Perspective Visuals & Interactive UI
- **Perspective Tilt Cards**: Dynamic 3D tilt effects responding to cursor position and device orientation (`TiltImage.tsx`).
- **Cinematic Rev-Up Intro**: Polished luxury entrance loading animation with tachometer countdown (`IntroLoader.tsx`).
- **Interactive Drive Mode Strip**: Live simulation of powertrain, chassis, and suspension responsiveness across *Comfort*, *Sport+*, *Track*, and *Range/Eco* modes.
- **Micro-Interactions**: Smooth spring animations with Framer Motion, dynamic counter displays (`CountUp.tsx`), and viewport scroll reveals (`Reveal.tsx`).

### 2. 📋 Filterable Multi-Segment Inventory & Model Comparison
- **Curated Showroom Catalog**: Filter across Luxury SUVs, Executive Sedans, Performance Coupés, Electric Vehicles (EV), and Certified Pre-Owned inventory.
- **Deep Technical Specs**: Real-time vehicle details including Brake Horsepower (BHP), transmission, acceleration (0–100 km/h), boot capacity in litres, fuel efficiency, and NCAP safety ratings.
- **Side-by-Side Model Comparison**: Compare up to 3 cars at once in an interactive split-view comparison modal (`CompareModal.tsx`).

### 3. 📊 Gujarat (GJ-06) On-Road Price & EMI Simulator
- **Transparent Price Breakdown**: Real-time breakdown including ex-showroom base price, state road taxes (custom slabs for **Vadodara GJ-06**, **Ahmedabad GJ-01**, and **Surat GJ-05**), 0-depreciation comprehensive insurance (1 OD + 3 TP), FASTag charges, and RTO registration fees.
- **Reducing-Balance EMI Loan Calculator**: Dynamic sliders for custom down-payment percentages (10% to 50%), loan tenure (12 to 84 months), and bank interest rates (7.5% to 14%).

### 4. 🔄 Instant Trade-In & Resale Valuation Engine
- **Algorithmic Vehicle Pricing**: Server-side appraisal calculating immediate exchange value ranges based on brand, manufacturing year (2018–2025), odometer mileage, and cosmetic/mechanical condition.
- **Authoritative Lead Generation**: Valuation inquiries generate unique transactional reference IDs (`TIL-...`) and persist directly to PostgreSQL.

### 5. 🎟️ VIP Test Drive Booking with Scannable QR Code
- **Concierge Scheduling**: Flexible choice between *At-Home Doorstep Test Drive (across Vadodara)* or *VIP Showroom Lounge Visit*.
- **Slot Selection**: Automated time slots (11:00 AM, 02:00 PM, 05:00 PM, 07:30 PM) and interactive calendar picker.
- **Dynamic Digital Boarding Pass**: Client-side QR code generation (`qrcode`) embedding unique booking reference (`APX-...`), selected vehicle, scheduled time slot, and guest name.
- **Direct WhatsApp Dispatch**: One-click integration sending formatted reservation requests straight to the dealership desk via WhatsApp (`wa.me`).

### 6. 🤖 Offline AI Auto Advisor / Concierge
- **Built-in Smart Concierge**: Answers inquiries regarding auto-loan KYC paperwork, Sunday test drive slots, Gujarat EV tax exemptions, and vehicle availability without external API dependencies.
- **Action-Triggered Prompts**: Chat triggers directly invoke the test-drive booking drawer or scroll to the on-road price calculator.

---

## ✦ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), [React 19](https://react.dev/) |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), PostCSS 8, `@tailwindcss/postcss` |
| **Animation & UI** | [Framer Motion 14](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/) |
| **QR Generation** | [qrcode](https://www.npmjs.com/package/qrcode) (`@types/qrcode`) |
| **Database** | [PostgreSQL 8.20](https://www.postgresql.org/) (`pg` connection pool) |
| **ORM & Migrations** | [Drizzle ORM 0.45](https://orm.drizzle.team/), [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) |

---

## ✦ Repository Architecture

```text
carShowroomDemo/
├── frontend/                         # Next.js 16 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── bookings/         # POST: Test drive booking endpoint
│   │   │   │   ├── health/           # GET: Database connection healthcheck
│   │   │   │   └── leads/            # POST: Trade-in valuation lead endpoint
│   │   │   ├── globals.css           # Tailwind v4 configuration and color themes
│   │   │   ├── layout.tsx            # Root HTML metadata and font definitions
│   │   │   └── page.tsx              # Static application entrypoint
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── IntroLoader.tsx   # Cinematic launch rev-up loader
│   │   │   │   ├── SiteFooter.tsx    # Dealership footer, certification badges & credits
│   │   │   │   ├── SiteHeader.tsx    # Sticky navigation bar with quick booking CTA
│   │   │   │   └── TickerBar.tsx     # Announcement and delivery ticker
│   │   │   ├── sections/
│   │   │   │   ├── AIConcierge.tsx   # Offline floating smart auto advisor
│   │   │   │   ├── BrandMarquee.tsx  # Luxury automotive brand partners marquee
│   │   │   │   ├── CompareModal.tsx  # Multi-car spec comparison modal
│   │   │   │   ├── DriveStrip.tsx    # Key showroom metrics and inspection guarantees
│   │   │   │   ├── Experience.tsx    # VIP showroom lounge & amenities overview
│   │   │   │   ├── FinalCta.tsx      # Bottom lead conversion banner
│   │   │   │   ├── Hero.tsx          # Hero banner with multi-filter quick search
│   │   │   │   ├── Inventory.tsx     # Dynamic car catalog with search & filter controls
│   │   │   │   ├── OnRoadCalculator.tsx # Gujarat RTO on-road price & EMI calculator
│   │   │   │   ├── Performance.tsx   # Drive mode simulator (Comfort/Sport/Track/Eco)
│   │   │   │   ├── SignatureCollection.tsx # Flagship vehicle showcase with 3D tilt
│   │   │   │   ├── TestDriveDrawer.tsx # Booking slide-over drawer with QR pass
│   │   │   │   ├── Testimonials.tsx  # Verified luxury buyer testimonials
│   │   │   │   └── TradeIn.tsx       # Instant trade-in valuation calculator
│   │   │   ├── ui/
│   │   │   │   ├── buttons.ts        # Modular button style variants
│   │   │   │   ├── CountUp.tsx       # Smooth number counter animation
│   │   │   │   ├── Reveal.tsx        # Viewport scroll animation container
│   │   │   │   ├── SectionHeading.tsx# Standardized section titles
│   │   │   │   └── TiltImage.tsx     # 3D perspective mouse hover card
│   │   │   └── ApexApp.tsx           # Main application state and coordinator
│   │   ├── db/
│   │   │   ├── index.ts              # PostgreSQL connection pool with Drizzle ORM
│   │   │   └── schema.ts             # Database schema (bookings and trade-in leads)
│   │   └── lib/
│   │       ├── concierge.ts          # Offline auto advisor rules and intelligence
│   │       ├── inventory.ts          # Comprehensive vehicle catalog & photography
│   │       ├── pricing.ts            # Gujarat RTO road taxes, insurance, EMI formulas
│   │       └── site.ts               # Brand constants, WhatsApp generator & formatting
│   ├── .env.example                  # Environment variable reference
│   ├── .gitignore                    # Frontend gitignore rules
│   ├── drizzle.config.json           # Drizzle Kit migration configuration
│   ├── eslint.config.mjs             # ESLint configuration
│   ├── next.config.ts                # Next.js configuration
│   ├── package.json                  # NPM dependencies and scripts
│   ├── postcss.config.mjs            # PostCSS configuration
│   └── tsconfig.json                 # TypeScript compiler configuration
├── .gitignore                        # Root repository gitignore
└── README.md                         # Complete project documentation
```

---

## ✦ Database Schema

The database utilizes **PostgreSQL** configured via **Drizzle ORM** with two primary operational tables:

### `test_drive_bookings`
Stores confirmed test drive appointments and passes.
```sql
CREATE TABLE test_drive_bookings (
  id SERIAL PRIMARY KEY,
  ref VARCHAR(32) NOT NULL UNIQUE,
  experience VARCHAR(64) NOT NULL,
  car_id VARCHAR(64) NOT NULL,
  car_name VARCHAR(160) NOT NULL,
  booking_date VARCHAR(16) NOT NULL,
  time_slot VARCHAR(16) NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

### `trade_in_leads`
Stores vehicle valuation requests and server-calculated appraisal brackets.
```sql
CREATE TABLE trade_in_leads (
  id SERIAL PRIMARY KEY,
  ref VARCHAR(32) NOT NULL UNIQUE,
  brand VARCHAR(64) NOT NULL,
  year INTEGER NOT NULL,
  km INTEGER NOT NULL,
  condition VARCHAR(16) NOT NULL,
  value_low INTEGER NOT NULL,
  value_high INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

---

## ✦ API Reference

### 1. Test Drive Booking
- **Endpoint**: `POST /api/bookings`
- **Request Body**:
  ```json
  {
    "experience": "At-Home Doorstep Test Drive (Vadodara)",
    "carId": "meridian-x5",
    "bookingDate": "2026-11-20",
    "timeSlot": "02:00 PM",
    "customerName": "Rahul Sharma",
    "phone": "+91 98765 43210"
  }
  ```
- **Response** `(201 Created)`:
  ```json
  {
    "ref": "APX-KXYZ12-9A8B",
    "saved": true,
    "car": "Meridian X5 Luxury SUV"
  }
  ```

### 2. Trade-In Valuation Lead
- **Endpoint**: `POST /api/leads`
- **Request Body**:
  ```json
  {
    "brand": "BMW",
    "year": 2022,
    "km": 28000,
    "condition": "Excellent"
  }
  ```
- **Response** `(201 Created)`:
  ```json
  {
    "ref": "TIL-LW4Q1P-7C2D",
    "saved": true,
    "low": 4250000,
    "high": 4650000
  }
  ```

### 3. Service Healthcheck
- **Endpoint**: `GET /api/health`
- **Response** `(200 OK)`:
  ```json
  { "ok": true }
  ```

---

## ✦ Getting Started

### Prerequisites

Ensure the following runtimes and tools are installed:
- **Node.js**: `v20.0.0` or later
- **npm**: `v10.0.0` or later (or `pnpm` / `yarn`)
- **PostgreSQL**: *(Optional)* The application operates out-of-the-box in frontend-first mode without requiring any database. When `DATABASE_URL` is omitted (e.g. during Vercel deployment), bookings and leads run seamlessly in memory with instant QR pass generation and WhatsApp dispatch. If a PostgreSQL instance is configured, it automatically persists records via Drizzle ORM.

### 1. Clone the Repository
```bash
git clone https://github.com/apdtechsolution-maker/carShowroomDemo.git
cd carShowroomDemo/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your credentials in `.env` if using a database:
```env
# Optional: PostgreSQL connection string (leave unset for frontend-only mode)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app_db"

# Dealership WhatsApp Desk (Digits only with country code)
NEXT_PUBLIC_WHATSAPP_NUMBER="919900000000"
```

### 4. Push Database Schema (Only if using PostgreSQL)
If using PostgreSQL, push the schema:
```bash
npx drizzle-kit push
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✦ Available Scripts

Inside the `frontend/` directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js Turbopack development server on port 3000 |
| `npm run build` | Compiles optimized production build |
| `npm run start` | Launches production server |
| `npm run typecheck` | Validates TypeScript types across the project (`tsc --noEmit`) |
| `npm run lint` | Runs Next.js ESLint validation |

---

## ✦ Configuration & Customization

- **Dealership Identity**: Modify dealership name, location, and WhatsApp contact in `frontend/src/lib/site.ts`.
- **Vehicle Catalog**: Update specifications, images, and prices in `frontend/src/lib/inventory.ts`.
- **Taxation & Finance Rules**: Adjust Gujarat RTO slabs, insurance formulas, and default interest rates in `frontend/src/lib/pricing.ts`.
- **Styling & Theme**: Modify color tokens (ink, coal, gold, ivory, bronze) in `frontend/src/app/globals.css`.

---

## ✦ Engineering & Credits

Engineered with precision by **APD Solutions** (Vadodara, Gujarat).  
For commercial inquiries, customization, and enterprise automotive showroom implementations, reach out to **APD Solutions**.

---

## ✦ License

This project is licensed under the MIT License — see repository settings for details.


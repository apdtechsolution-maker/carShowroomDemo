export type BodyType =
  | "Luxury SUVs"
  | "Executive Sedans"
  | "Performance Coupés"
  | "Electric EV"
  | "Certified Pre-Owned";

export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "EV";

export interface Car {
  id: string;
  name: string;
  tagline: string;
  year: number;
  km: number;
  body: BodyType;
  fuel: FuelType;
  transmission: string;
  exShowroom: number;
  bhp: number;
  efficiency: string;
  bootLitres: number;
  safety: string;
  seats: number;
  colorName: string;
  color: string;
  image: string;
  preOwned: boolean;
}

export const BODY_TYPES: ("All" | BodyType)[] = [
  "All",
  "Luxury SUVs",
  "Executive Sedans",
  "Performance Coupés",
  "Electric EV",
  "Certified Pre-Owned",
];

export const FUEL_TYPES: ("All" | FuelType)[] = ["All", "Petrol", "Diesel", "Hybrid", "EV"];

/** Representative automotive photography (free-license Pexels CDN). */
function photo(id: number): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;
}

export const CARS: Car[] = [
  {
    id: "meridian-x5",
    name: "Meridian X5 Luxury SUV",
    tagline: "Executive air-suspension ride with a commanding cabin",
    year: 2026,
    km: 0,
    body: "Luxury SUVs",
    fuel: "Diesel",
    transmission: "8-Speed Auto",
    exShowroom: 12850000,
    bhp: 340,
    efficiency: "14.8 kmpl",
    bootLitres: 650,
    safety: "5★ GNCAP",
    seats: 5,
    colorName: "Midnight Sapphire",
    color: "#1E3A8A",
    image: photo(12532746),
    preOwned: false,
  },
  {
    id: "summit-aviator",
    name: "Summit Aviator Hybrid 7-Seater",
    tagline: "Hybrid torque with a three-row lounge interior",
    year: 2026,
    km: 0,
    body: "Luxury SUVs",
    fuel: "Hybrid",
    transmission: "eCVT",
    exShowroom: 7490000,
    bhp: 375,
    efficiency: "18.2 kmpl",
    bootLitres: 320,
    safety: "5★ GNCAP",
    seats: 7,
    colorName: "Pearl Glacier White",
    color: "#F1F5F9",
    image: photo(19908577),
    preOwned: false,
  },
  {
    id: "familia-7s",
    name: "Familia 7-Seat Luxury SUV",
    tagline: "Family-first 7-seater with premium comfort features",
    year: 2026,
    km: 0,
    body: "Luxury SUVs",
    fuel: "Petrol",
    transmission: "CVT",
    exShowroom: 2450000,
    bhp: 186,
    efficiency: "16.5 kmpl",
    bootLitres: 388,
    safety: "5★ BNCAP",
    seats: 7,
    colorName: "Nardo Stealth Grey",
    color: "#4A5568",
    image: photo(9574285),
    preOwned: false,
  },
  {
    id: "sovereign-s",
    name: "Sovereign Executive S Sedan",
    tagline: "Boardroom-grade sedan with rear-seat executive recline",
    year: 2026,
    km: 0,
    body: "Executive Sedans",
    fuel: "Petrol",
    transmission: "9-Speed Auto",
    exShowroom: 10500000,
    bhp: 455,
    efficiency: "11.9 kmpl",
    bootLitres: 500,
    safety: "5★ GNCAP",
    seats: 5,
    colorName: "British Racing Green",
    color: "#1B4332",
    image: photo(261986),
    preOwned: false,
  },
  {
    id: "gtr-coupe",
    name: "Apex GT-R Coupé",
    tagline: "Dual-motor AWD hypercoupé • 640 BHP • 2.9 s to 100",
    year: 2026,
    km: 0,
    body: "Performance Coupés",
    fuel: "Hybrid",
    transmission: "7-Speed DCT",
    exShowroom: 14800000,
    bhp: 640,
    efficiency: "7.9 kmpl",
    bootLitres: 210,
    safety: "5★ GNCAP",
    seats: 2,
    colorName: "Rosso Corsa Red",
    color: "#D90429",
    image: photo(8359715),
    preOwned: false,
  },
  {
    id: "lumen-ev",
    name: "Lumen EV Sedan",
    tagline: "Glacier-ice electric sedan with 520 km real-world range",
    year: 2026,
    km: 0,
    body: "Electric EV",
    fuel: "EV",
    transmission: "Single-Speed",
    exShowroom: 4690000,
    bhp: 476,
    efficiency: "520 km range (ARAI)",
    bootLitres: 470,
    safety: "5★ GNCAP",
    seats: 5,
    colorName: "Glacier Ice Blue",
    color: "#38BDF8",
    image: photo(35736779),
    preOwned: false,
  },
  {
    id: "volt-urban",
    name: "Volt Urban EV Hatch",
    tagline: "City-smart EV with instant torque and 400 km range",
    year: 2026,
    km: 0,
    body: "Electric EV",
    fuel: "EV",
    transmission: "Single-Speed",
    exShowroom: 2840000,
    bhp: 150,
    efficiency: "400 km range (ARAI)",
    bootLitres: 350,
    safety: "4★ GNCAP",
    seats: 5,
    colorName: "Champagne Gold",
    color: "#D4AF37",
    image: photo(28380935),
    preOwned: false,
  },
  {
    id: "stealth-gt-cpo",
    name: "Stealth GT Pre-Owned 2023",
    tagline: "200-point certified • single owner • full service history",
    year: 2023,
    km: 18400,
    body: "Certified Pre-Owned",
    fuel: "Petrol",
    transmission: "7-Speed DCT",
    exShowroom: 11200000,
    bhp: 530,
    efficiency: "9.2 kmpl",
    bootLitres: 240,
    safety: "5★ GNCAP",
    seats: 2,
    colorName: "Nardo Stealth Grey",
    color: "#4A5568",
    image: photo(30664842),
    preOwned: true,
  },
];

export function findCar(id: string): Car {
  return CARS.find((c) => c.id === id) ?? CARS[0];
}

import watch from "@/assets/product-watch.jpg";
import camera from "@/assets/product-camera.jpg";
import sneakers from "@/assets/product-sneakers.jpg";
import headphones from "@/assets/product-headphones.jpg";
import pen from "@/assets/product-pen.jpg";
import polaroid from "@/assets/product-polaroid.jpg";
import keyboard from "@/assets/product-keyboard.jpg";
import bag from "@/assets/product-bag.jpg";

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: "Watches" | "Cameras" | "Audio" | "Fashion" | "Tech" | "Lifestyle";
  price: number;
  aiValuation: number;
  trustScore: number;
  condition: "Mint" | "Excellent" | "Very Good" | "Good";
  image: string;
  images?: string[];
  seller: {
    name: string;
    handle: string;
    rating: number;
    trades: number;
    verified: boolean;
  };
  description: string;
  specs: { label: string; value: string }[];
  trending?: boolean;
  acceptsTrade: boolean;
};

export const products: Product[] = [
  {
    id: "ap-royal-oak",
    title: "Audemars Piguet Royal Oak 15500ST",
    brand: "Audemars Piguet",
    category: "Watches",
    price: 38500,
    aiValuation: 39200,
    trustScore: 98,
    condition: "Mint",
    image: watch,
    seller: { name: "Atelier Geneva", handle: "@atelier_gva", rating: 4.97, trades: 312, verified: true },
    description:
      "Reference 15500ST in 41mm stainless steel. Box, papers, and full set included. Serviced by an authorized dealer in 2024. A grail-tier addition to any horological vault.",
    specs: [
      { label: "Case", value: "41mm Stainless Steel" },
      { label: "Movement", value: "Cal. 4302 Automatic" },
      { label: "Year", value: "2022" },
      { label: "Box & Papers", value: "Complete Set" },
    ],
    trending: true,
    acceptsTrade: true,
  },
  {
    id: "leica-m11",
    title: "Leica M11 Black 60MP Rangefinder",
    brand: "Leica",
    category: "Cameras",
    price: 8200,
    aiValuation: 8450,
    trustScore: 96,
    condition: "Excellent",
    image: camera,
    seller: { name: "Noir Optics", handle: "@noir_optics", rating: 4.94, trades: 187, verified: true },
    description:
      "The Leica M11 in matte black. 60MP triple-resolution full-frame sensor. Less than 4,000 actuations. Original box, charger, and second OEM battery included.",
    specs: [
      { label: "Sensor", value: "60MP Full-Frame BSI CMOS" },
      { label: "Actuations", value: "~3,840" },
      { label: "Mount", value: "Leica M" },
      { label: "Year", value: "2023" },
    ],
    trending: true,
    acceptsTrade: true,
  },
  {
    id: "common-projects",
    title: "Common Projects Achilles Low — Silver",
    brand: "Common Projects",
    category: "Fashion",
    price: 285,
    aiValuation: 310,
    trustScore: 92,
    condition: "Excellent",
    image: sneakers,
    seller: { name: "Studio 41", handle: "@studio41", rating: 4.88, trades: 96, verified: true },
    description:
      "Iconic minimalist leather sneakers in EU 42. Worn fewer than ten times. Original dust bag and box included.",
    specs: [
      { label: "Size", value: "EU 42 / US 9" },
      { label: "Material", value: "Italian Nappa Leather" },
      { label: "Color", value: "White / Silver Heel" },
      { label: "Year", value: "2024" },
    ],
    acceptsTrade: true,
  },
  {
    id: "audeze-lcd",
    title: "Audeze LCD-X Planar Magnetic Headphones",
    brand: "Audeze",
    category: "Audio",
    price: 1050,
    aiValuation: 980,
    trustScore: 94,
    condition: "Very Good",
    image: headphones,
    seller: { name: "Signal Path", handle: "@signal_path", rating: 4.91, trades: 142, verified: true },
    description:
      "Reference-grade planar magnetic headphones. Includes original travel case and balanced cable. Light cosmetic wear on the headband.",
    specs: [
      { label: "Driver", value: "106mm Planar Magnetic" },
      { label: "Impedance", value: "20 Ω" },
      { label: "Weight", value: "612g" },
      { label: "Cable", value: "Balanced XLR + 1/4\"" },
    ],
    acceptsTrade: true,
  },
  {
    id: "titan-pen",
    title: "Tactile Turn Bolt Action — Bronze",
    brand: "Tactile Turn",
    category: "Lifestyle",
    price: 165,
    aiValuation: 180,
    trustScore: 90,
    condition: "Mint",
    image: pen,
    seller: { name: "Object Practice", handle: "@object_pr", rating: 4.86, trades: 58, verified: false },
    description:
      "Machined bronze bolt-action pen. Develops a beautiful patina. Brand new — fitted with a Pilot G2 refill.",
    specs: [
      { label: "Material", value: "Solid Bronze" },
      { label: "Mechanism", value: "Bolt Action" },
      { label: "Refill", value: "Pilot G2 (interchangeable)" },
      { label: "Weight", value: "62g" },
    ],
    acceptsTrade: true,
  },
  {
    id: "polaroid-sx70",
    title: "Polaroid SX-70 — Original Tan Leather",
    brand: "Polaroid",
    category: "Cameras",
    price: 420,
    aiValuation: 460,
    trustScore: 89,
    condition: "Very Good",
    image: polaroid,
    seller: { name: "Analog Foundry", handle: "@analog_fdry", rating: 4.79, trades: 71, verified: true },
    description:
      "Restored 1972 Polaroid SX-70 in tan leather. Bellows and rollers fully serviced. Compatible with modern SX-70 film.",
    specs: [
      { label: "Year", value: "1972 (restored 2024)" },
      { label: "Film", value: "Polaroid SX-70" },
      { label: "Focus", value: "Manual SLR" },
      { label: "Body", value: "Chrome + Tan Leather" },
    ],
    trending: true,
    acceptsTrade: true,
  },
  {
    id: "keychron-q1",
    title: "Keychron Q1 Pro — Aluminum Custom",
    brand: "Keychron",
    category: "Tech",
    price: 220,
    aiValuation: 235,
    trustScore: 93,
    condition: "Excellent",
    image: keyboard,
    seller: { name: "Carbon Layouts", handle: "@carbon_lay", rating: 4.92, trades: 124, verified: true },
    description:
      "Full aluminum 75% keyboard, hot-swappable, Gateron Jupiter Banana switches, PBT keycaps. Wireless and wired modes.",
    specs: [
      { label: "Layout", value: "75% (84 keys)" },
      { label: "Switches", value: "Gateron Jupiter Banana" },
      { label: "Keycaps", value: "Double-shot PBT" },
      { label: "Connectivity", value: "Bluetooth 5.1 / USB-C" },
    ],
    acceptsTrade: true,
  },
  {
    id: "filson-bag",
    title: "Filson Tin Cloth Field Bag — Tan",
    brand: "Filson",
    category: "Lifestyle",
    price: 340,
    aiValuation: 360,
    trustScore: 91,
    condition: "Excellent",
    image: bag,
    seller: { name: "Northwood & Co.", handle: "@northwood", rating: 4.9, trades: 88, verified: true },
    description:
      "Heritage Filson field bag in waxed tin cloth and bridle leather. Lightly used. Develops character with age.",
    specs: [
      { label: "Material", value: "Waxed Tin Cloth + Bridle Leather" },
      { label: "Dimensions", value: "15\" × 11\" × 5\"" },
      { label: "Closure", value: "Twin Buckle" },
      { label: "Made In", value: "Seattle, USA" },
    ],
    acceptsTrade: true,
  },
];

export const categories = ["All", "Watches", "Cameras", "Audio", "Fashion", "Tech", "Lifestyle"] as const;

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getSimilar(id: string, limit = 3): Product[] {
  const target = getProduct(id);
  if (!target) return [];
  return products
    .filter((p) => p.id !== id)
    .sort((a, b) => {
      const aMatch = a.category === target.category ? 0 : 1;
      const bMatch = b.category === target.category ? 0 : 1;
      return aMatch - bMatch;
    })
    .slice(0, limit);
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

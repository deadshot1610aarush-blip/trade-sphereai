import type { Product } from "@/lib/products";
import { products as sampleProducts } from "@/lib/products";

export type ListingRow = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: string;
  brand: string | null;
  condition: string;
  price: number | string;
  ai_valuation: number | string | null;
  trust_score: number;
  accepts_trade: boolean;
  image_url: string | null;
  specs: unknown;
  status: string;
  created_at: string;
};

export const LISTING_COLUMNS =
  "id, seller_id, title, description, category, brand, condition, price, ai_valuation, trust_score, accepts_trade, image_url, specs, status, created_at";

export const LISTING_CATEGORIES = ["Watches", "Cameras", "Audio", "Fashion", "Tech", "Lifestyle"] as const;
export const LISTING_CONDITIONS = ["Mint", "Excellent", "Very Good", "Good"] as const;

const FALLBACK_IMAGE = sampleProducts[0].image;

export function rowToProduct(row: ListingRow, sellerName?: string | null): Product {
  const price = Number(row.price);
  const specs = Array.isArray(row.specs)
    ? (row.specs as { label: string; value: string }[]).filter((s) => s && s.label && s.value)
    : [];
  return {
    id: row.id,
    title: row.title,
    brand: row.brand ?? "Independent",
    category: row.category as Product["category"],
    price,
    aiValuation: row.ai_valuation != null ? Number(row.ai_valuation) : price,
    trustScore: row.trust_score,
    condition: row.condition as Product["condition"],
    image: row.image_url || FALLBACK_IMAGE,
    seller: {
      name: sellerName || "Community seller",
      handle: "@seller",
      rating: 5,
      trades: 0,
      verified: false,
    },
    description: row.description,
    specs,
    acceptsTrade: row.accepts_trade,
  };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isListingId = (id: string) => UUID_RE.test(id);

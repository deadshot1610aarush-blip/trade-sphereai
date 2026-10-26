import type { Product } from "@/lib/products";

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

// Neutral placeholder for listings without a photo.
const PLACEHOLDER_SVG = [
  "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>",
  "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>",
  "<stop offset='0' stop-color='#eef1ee'/><stop offset='1' stop-color='#d9ded9'/>",
  "</linearGradient></defs>",
  "<rect width='800' height='800' fill='url(#g)'/>",
  "<g fill='none' stroke='#8b948b' stroke-width='14' stroke-linecap='round' stroke-linejoin='round'>",
  "<rect x='300' y='330' width='200' height='160' rx='24'/>",
  "<path d='M340 330l24-40h72l24 40'/>",
  "<circle cx='400' cy='410' r='44'/>",
  "</g></svg>",
].join("");
export const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(PLACEHOLDER_SVG)}`;

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

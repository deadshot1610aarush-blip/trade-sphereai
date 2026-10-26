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

export const categories = ["All", "Watches", "Cameras", "Audio", "Fashion", "Tech", "Lifestyle"] as const;

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

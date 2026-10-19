import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/products";
import { LISTING_COLUMNS, rowToProduct, type ListingRow } from "@/lib/listings";

/** Active listings added by sellers, newest first. */
export function useListings(sellerId?: string) {
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let q = supabase.from("products").select(LISTING_COLUMNS).order("created_at", { ascending: false });
      q = sellerId ? q.eq("seller_id", sellerId) : q.eq("status", "active");
      const { data } = await q;
      if (!cancelled) {
        setListings(((data ?? []) as ListingRow[]).map((r) => rowToProduct(r)));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sellerId, version]);

  return { listings, loading, refresh: () => setVersion((v) => v + 1) };
}

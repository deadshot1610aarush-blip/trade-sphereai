import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { isListingId, LISTING_COLUMNS, rowToProduct, type ListingRow } from "@/lib/listings";

function publicClient() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(process.env.SUPABASE_URL!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_")) {
          if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
          headers.set("apikey", key);
        }
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const getListing = createServerFn({ method: "GET" })
  .inputValidator((id: string) => {
    if (!isListingId(id)) throw new Error("Invalid id");
    return id;
  })
  .handler(async ({ data: id }) => {
    const sb = publicClient();
    const { data, error } = await sb
      .from("products")
      .select(LISTING_COLUMNS)
      .eq("id", id)
      .eq("status", "active")
      .maybeSingle();
    if (error) {
      console.error(error);
      return null;
    }
    if (!data) return null;
    const { data: profile } = await sb
      .from("profiles")
      .select("display_name")
      .eq("id", data.seller_id)
      .maybeSingle();
    return rowToProduct(data as ListingRow, profile?.display_name);
  });

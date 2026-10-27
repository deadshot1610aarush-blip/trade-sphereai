import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { publicClient } from "@/lib/listings.functions";

const BASE_URL = "https://trade-sphereai.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/marketplace", changefreq: "daily", priority: "0.9" },
          { path: "/guides/luxury-watch-trading", changefreq: "monthly", priority: "0.7" },
          { path: "/auth", changefreq: "yearly", priority: "0.3" },
        ];

        // Index live product listings when the database is reachable.
        try {
          const sb = publicClient();
          const { data } = await sb
            .from("products")
            .select("id")
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(500);
          for (const row of data ?? []) {
            entries.push({ path: `/product/${row.id}`, changefreq: "weekly", priority: "0.8" });
          }
        } catch (err) {
          console.error("sitemap listing fetch failed", err);
        }

        const urls = entries.map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

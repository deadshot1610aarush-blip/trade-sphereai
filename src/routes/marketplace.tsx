import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";

const MP_TITLE = "Marketplace — TradeSphere AI";
const MP_DESC = "Browse premium assets verified by AI valuation and trust scoring.";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: MP_TITLE },
      { name: "description", content: MP_DESC },
      { property: "og:title", content: MP_TITLE },
      { property: "og:description", content: MP_DESC },
      { property: "og:url", content: "https://trade-sphereai.lovable.app/marketplace" },
      { name: "twitter:title", content: MP_TITLE },
      { name: "twitter:description", content: MP_DESC },
    ],
    links: [
      { rel: "canonical", href: "https://trade-sphereai.lovable.app/marketplace" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: MP_TITLE,
          description: MP_DESC,
          url: "https://trade-sphereai.lovable.app/marketplace",
        }),
      },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sort, setSort] = useState<"trending" | "price-asc" | "price-desc" | "ai-value">("trending");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase());
      const matchesPrice = p.price <= maxPrice;
      return matchesCategory && matchesQuery && matchesPrice;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "ai-value":
        list = [...list].sort((a, b) => b.aiValuation - b.price - (a.aiValuation - a.price));
        break;
      default:
        list = [...list].sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    }
    return list;
  }, [query, category, maxPrice, sort]);

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Navbar />

      <section className="px-6 pt-16 pb-10 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] font-semibold text-brand uppercase tracking-widest mb-3">Marketplace</p>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-4">Browse verified assets.</h1>
          <p className="text-muted-foreground max-w-[58ch]">
            Every listing is independently valued by the engine and indexed against real-time market data.
          </p>

          {/* Search */}
          <div className="mt-8 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by brand or model..."
                aria-label="Search assets by brand or model"
                className="w-full bg-card ring-1 ring-black/5 focus:ring-ink/20 rounded-full py-3 pl-11 pr-4 text-sm outline-none transition"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              aria-label="Sort assets"
              className="bg-card ring-1 ring-black/5 rounded-full py-3 px-5 text-sm outline-none focus:ring-ink/20"
            >
              <option value="trending">Sort: Trending</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="ai-value">Best AI Value</option>
            </select>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
          {/* Filters */}
          <aside aria-labelledby="filters-heading" className="space-y-8">
            <h2 id="filters-heading" className="sr-only">Filters</h2>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Category
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`text-left text-sm px-3 py-1.5 rounded-full transition-colors lg:w-fit ${
                      category === c
                        ? "bg-ink text-surface"
                        : "bg-card ring-1 ring-black/5 text-ink hover:bg-muted"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Max Price
              </h3>
              <input
                type="range"
                min={100}
                max={50000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Maximum price filter"
                className="w-full accent-[var(--brand)]"
              />
              <p className="text-sm font-medium mt-2">
                Up to{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(maxPrice)}
              </p>
            </div>
          </aside>

          {/* Grid */}
          <section aria-labelledby="assets-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="assets-heading" className="text-sm text-muted-foreground">
                <span className="text-ink font-semibold">{filtered.length}</span> asset
                {filtered.length === 1 ? "" : "s"}
              </h2>
            </div>

            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-sm text-muted-foreground">No assets match those filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      </section>

      <Footer />
    </div>
  );
}

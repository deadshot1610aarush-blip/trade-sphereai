import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice, getProduct, getSimilar } from "@/lib/products";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product, similar: getSimilar(params.id) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.title} — TradeSphere AI` },
          { name: "description", content: loaderData.product.description.slice(0, 155) },
          { property: "og:title", content: loaderData.product.title },
          { property: "og:description", content: loaderData.product.description.slice(0, 155) },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [{ title: "Product — TradeSphere AI" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-surface">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-3">Asset not found</h1>
        <Link to="/marketplace" className="text-sm text-brand hover:underline">
          Back to marketplace
        </Link>
      </div>
    </div>
  ),
});

function ProductPage() {
  const { product, similar } = Route.useLoaderData();
  const delta = product.aiValuation - product.price;
  const undervalued = delta > 0;
  const fairness = Math.min(100, Math.round(100 - (Math.abs(delta) / product.aiValuation) * 100));

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Navbar />

      <section className="px-6 pt-10 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground mb-8 flex items-center gap-2">
            <Link to="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/marketplace" className="hover:text-ink transition-colors">
              Marketplace
            </Link>
            <span>/</span>
            <span className="text-ink">{product.category}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-3xl overflow-hidden ring-1 ring-black/5">
                <img
                  src={product.image}
                  alt={product.title}
                  width={800}
                  height={800}
                  className="size-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[product.image, product.image, product.image, product.image].map((src, i) => (
                  <button
                    key={i}
                    className="aspect-square bg-muted rounded-xl overflow-hidden ring-1 ring-black/5 hover:ring-black/15 transition"
                  >
                    <img src={src} alt="" width={200} height={200} className="size-full object-cover opacity-80" />
                  </button>
                ))}
              </div>
            </div>

            {/* Detail */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{product.brand}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-[11px] uppercase tracking-widest text-brand">{product.condition}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-6 text-balance">
                {product.title}
              </h1>

              <div className="flex items-end gap-6 mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Listed Price</p>
                  <p className="text-4xl font-semibold tracking-tight">{formatPrice(product.price)}</p>
                </div>
                <div className="pb-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">AI Valuation</p>
                  <p className={`text-sm font-semibold ${undervalued ? "text-brand" : "text-muted-foreground"}`}>
                    {formatPrice(product.aiValuation)} ({undervalued ? "+" : ""}
                    {formatPrice(delta)})
                  </p>
                </div>
              </div>

              {/* AI Score Card */}
              <div className="bg-card ring-1 ring-black/5 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-brand animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider">AI Trust Index</span>
                  </div>
                  <span className="text-sm font-semibold">{product.trustScore} / 100</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-brand" style={{ width: `${product.trustScore}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-black/5">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Fair Value</p>
                    <p className="text-sm font-semibold">{fairness}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Liquidity</p>
                    <p className="text-sm font-semibold">A+</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Demand</p>
                    <p className="text-sm font-semibold text-brand">High</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button className="flex-1 bg-ink text-surface text-sm font-medium py-3.5 px-7 rounded-full hover:opacity-90 transition">
                  Buy now · {formatPrice(product.price)}
                </button>
                {product.acceptsTrade && (
                  <button className="flex-1 bg-brand/10 text-brand text-sm font-medium py-3.5 px-7 rounded-full ring-1 ring-brand/20 hover:bg-brand/15 transition">
                    Propose a trade
                  </button>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Description
                </h2>
                <p className="text-[15px] leading-relaxed text-ink/85 text-pretty">{product.description}</p>
              </div>

              {/* Specs */}
              <div className="mb-8">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Specifications
                </h2>
                <div className="bg-card ring-1 ring-black/5 rounded-2xl divide-y divide-black/5">
                  {product.specs.map((s) => (
                    <div key={s.label} className="flex justify-between p-4 text-sm">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller */}
              <div className="bg-card ring-1 ring-black/5 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-gradient-to-br from-brand/30 to-ink/20" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{product.seller.name}</p>
                      {product.seller.verified && (
                        <svg className="size-4 text-brand" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {product.seller.handle} · ★ {product.seller.rating} · {product.seller.trades} trades
                    </p>
                  </div>
                </div>
                <button className="text-xs font-medium text-ink hover:text-brand transition">View profile →</button>
              </div>
            </div>
          </div>

          {/* Similar */}
          {similar.length > 0 && (
            <div className="mt-24">
              <h2 className="text-2xl font-semibold tracking-tight mb-8">Similar assets</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {similar.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

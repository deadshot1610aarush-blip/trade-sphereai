import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products, formatPrice } from "@/lib/products";

const HOME_TITLE = "TradeSphere AI — Intelligent Trade Marketplace";
const HOME_DESC =
  "Buy, sell, and trade premium assets with AI-powered valuation, trust scoring, and a fair-trade engine.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESC },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESC },
      { property: "og:url", content: "https://trade-sphereai.lovable.app/" },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESC },
    ],
    links: [
      { rel: "canonical", href: "https://trade-sphereai.lovable.app/" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const showcase = products.slice(0, 2);
  const featured = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-[58%] animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/5 text-brand text-[12px] font-semibold mb-6 ring-1 ring-brand/15">
              <span className="size-1.5 rounded-full bg-brand animate-pulse" />
              v2.0 Trade Engine — now live
            </div>
            <h1 className="text-5xl lg:text-[5.25rem] font-semibold leading-[1.02] tracking-tight text-balance mb-8">
              Exchange value without the <span className="shimmer-text">friction of currency.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 text-pretty max-w-[58ch]">
              The liquidity layer for high-end assets. Our neural engine evaluates market conditions, trust signals,
              and asset parity to facilitate instant peer-to-peer trading.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center bg-ink text-surface text-sm font-medium py-3 px-7 rounded-full ring-1 ring-ink hover:opacity-90 transition-opacity"
              >
                Explore Marketplace
              </Link>
              <a
                href="#trade"
                className="inline-flex items-center justify-center gap-2 bg-muted text-ink text-sm font-medium py-3 px-6 rounded-full ring-1 ring-black/5 hover:bg-subtle transition-colors"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
                Start Trading
              </a>
            </div>
          </div>

          <div className="w-full lg:w-[42%] relative animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="relative z-10 space-y-4">
              <div className="glass-card p-4 rounded-2xl ring-1 ring-black/5 shadow-xl translate-x-4 rotate-2">
                <img
                  src={showcase[0].image}
                  alt={showcase[0].title}
                  width={800}
                  height={800}
                  className="w-full aspect-[4/3] object-cover rounded-xl mb-4"
                />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold">{showcase[0].title}</h3>
                    <p className="text-[12px] text-muted-foreground">Verified {showcase[0].condition} Condition</p>
                  </div>
                  <div className="bg-brand/10 text-brand text-[10px] font-bold px-2 py-0.5 rounded">
                    {showcase[0].trustScore} AI
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl ring-1 ring-black/5 shadow-lg -translate-x-8 -rotate-1">
                <div className="flex items-center gap-4">
                  <img
                    src={showcase[1].image}
                    alt={showcase[1].title}
                    width={64}
                    height={64}
                    className="size-16 object-cover rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-sm font-semibold truncate">{showcase[1].title}</span>
                      <span className="text-xs font-medium text-brand shrink-0">
                        +{formatPrice(showcase[1].aiValuation - showcase[1].price)}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: "85%" }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Fair Trade Match · 85%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -inset-12 bg-radial-brand blur-3xl -z-0 opacity-60" />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="border-y border-black/5 bg-card/50">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["Total Volume", "$42.8M"],
            ["Trade Pairs", "12,402"],
            ["AI Accuracy", "99.8%"],
            ["User Trust", "4.9 / 5.0"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">{k}</p>
              <p className="text-xl font-medium tracking-tight">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED / TRENDING */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 gap-6">
            <div>
              <p className="text-[11px] font-semibold text-brand uppercase tracking-widest mb-3">Trending now</p>
              <h2 className="text-3xl font-semibold tracking-tight">Curated by the engine.</h2>
            </div>
            <Link to="/marketplace" className="text-sm font-medium text-ink hover:text-brand transition-colors">
              View marketplace →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* AI FEATURES */}
      <section id="sell" className="py-32 px-6 bg-muted/60">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-[11px] font-semibold text-brand uppercase tracking-widest mb-3">AI Infrastructure</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-4 max-w-3xl">
              Intelligent swap protocols.
            </h2>
            <p className="text-muted-foreground text-pretty max-w-[52ch]">
              Our proprietary neural network eliminates the ambiguity of secondary market valuations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Real-time Valuation",
                desc: "Scans globally distributed pricing data to establish fair market value for any asset in milliseconds.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                ),
              },
              {
                title: "Trade Engine",
                desc: "Matches your assets with thousands of others to find direct or multi-party trades that maximize utility.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                ),
              },
              {
                title: "Trust Verifier",
                desc: "Cryptographic reputation score derived from trade success, shipping reliability, and authenticity audits.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-8 bg-card rounded-3xl ring-1 ring-black/5 hover:ring-black/10 transition-shadow"
              >
                <div className="size-10 bg-muted rounded-xl grid place-items-center mb-6">
                  <svg className="size-4 text-ink" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor">
                    {f.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty max-w-[42ch]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-[52ch]">
            <p className="text-[11px] font-semibold text-brand uppercase tracking-widest mb-3">Workflow</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4">Frictionless liquidation.</h2>
            <p className="text-muted-foreground text-pretty">
              From asset verification to final handoff, our automated workflow handles the complexity of physical
              trades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              ["01", "List Your Asset", "Upload high-resolution images. Our AI identifies the model, condition, and current market premium instantly."],
              ["02", "Match Algorithms", "The engine cross-references your item with thousands of active buyers and traders looking for that specific piece."],
              ["03", "Verified Handover", "Once a match is accepted, assets are routed through a regional authentication hub for final physical verification."],
            ].map(([n, t, d]) => (
              <div key={n} className="space-y-4">
                <div className="text-3xl font-medium text-subtle">{n}</div>
                <h4 className="text-lg font-semibold">{t}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-muted/60">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] font-semibold text-brand uppercase tracking-widest mb-3">Operator notes</p>
          <h2 className="text-3xl font-semibold tracking-tight mb-12">Trusted by collectors and operators.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: "The AI flagged my Royal Oak at $1,800 over my listing. Traded it in 72 hours.", n: "Marcus L.", r: "Watch collector, Geneva" },
              { q: "Trade Engine matched my Leica for a Sony A1 with $2k adjustment. Math was airtight.", n: "Priya S.", r: "Commercial photographer" },
              { q: "Trust scores are the killer feature. I finally know who I'm trading with.", n: "Daniel K.", r: "Vintage audio dealer" },
            ].map((t) => (
              <figure key={t.n} className="p-7 bg-card rounded-2xl ring-1 ring-black/5">
                <blockquote className="text-[15px] leading-relaxed text-ink mb-6">"{t.q}"</blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-gradient-to-br from-brand/30 to-ink/20" />
                  <div>
                    <p className="text-sm font-semibold">{t.n}</p>
                    <p className="text-xs text-muted-foreground">{t.r}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="trade" className="pb-24 pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-ink rounded-[2rem] p-12 lg:p-24 text-center text-surface overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6">Ready to upgrade?</h2>
              <p className="text-muted-foreground mb-10 text-pretty max-w-[44ch] mx-auto">
                Join 50k+ collectors trading premium assets with algorithmic precision.
              </p>
              <Link
                to="/marketplace"
                className="inline-flex items-center bg-surface text-ink text-sm font-medium py-4 px-10 rounded-full hover:opacity-90 transition-opacity"
              >
                Enter the Marketplace
              </Link>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-brand opacity-40" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

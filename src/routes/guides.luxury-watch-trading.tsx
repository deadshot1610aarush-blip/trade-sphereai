import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const TITLE = "Luxury Watch Trading Guide — TradeSphere AI";
const DESC =
  "How to trade and value luxury watches like Rolex and Audemars Piguet using AI-driven trust scoring and valuation.";
const URL = "https://trade-sphereai.lovable.app/guides/luxury-watch-trading";

export const Route = createFileRoute("/guides/luxury-watch-trading")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "Luxury Watch Trading Guide" },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { name: "twitter:title", content: "Luxury Watch Trading Guide" },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Luxury Watch Trading Guide",
          description: DESC,
          url: URL,
          author: { "@type": "Organization", name: "TradeSphere AI" },
        }),
      },
    ],
  }),
  component: Guide,
});

function Guide() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <Navbar />
      <article className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-[11px] font-semibold text-brand uppercase tracking-widest mb-3">Guides</p>
        <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6 text-balance">
          Luxury watch trading, decoded by AI.
        </h1>
        <p className="text-lg text-muted-foreground mb-10 text-pretty">
          A practical playbook for valuing and exchanging Rolex, Audemars Piguet, Patek Philippe, and other
          high-end timepieces on a marketplace built around trust scoring.
        </p>

        <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-4">Why luxury watches are different</h2>
        <p className="text-[15px] leading-relaxed text-ink/85 mb-4">
          Reference numbers, dial variants, service history, and box-and-papers status can move a single watch's
          market value by 20% or more. Traditional marketplaces leave that interpretation to the buyer.
          TradeSphere's valuation engine ingests every active listing, recent auction comp, and dealer benchmark
          to produce a live fair-market band you can trade against.
        </p>

        <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-4">Valuing a Royal Oak (Ref. 15500ST)</h2>
        <p className="text-[15px] leading-relaxed text-ink/85 mb-4">
          The 41mm steel Royal Oak is one of the most-tracked references on the platform. Our model weighs:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[15px] text-ink/85 mb-4">
          <li>Year of production and movement caliber (3120 vs. 4302)</li>
          <li>Condition grade and presence of original tapisserie dial</li>
          <li>Full set vs. watch-only, with service papers within 24 months</li>
          <li>Regional premium — Geneva vs. New York vs. Hong Kong spot pricing</li>
        </ul>

        <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-4">How direct trades work</h2>
        <p className="text-[15px] leading-relaxed text-ink/85 mb-4">
          The Trade Engine matches your watch against thousands of active offers and proposes a delta — cash or
          another asset — to balance the swap. Every counterparty carries a cryptographic Trust Index built from
          completed trades, shipping reliability, and authenticity audits.
        </p>

        <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-4">Ready to list?</h2>
        <p className="text-[15px] leading-relaxed text-ink/85 mb-6">
          Browse the live watch marketplace, compare AI valuations against asking prices, and propose a trade in
          a single click.
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center bg-ink text-surface text-sm font-medium py-3 px-7 rounded-full hover:opacity-90 transition"
        >
          Open the marketplace →
        </Link>
      </article>
      <Footer />
    </div>
  );
}

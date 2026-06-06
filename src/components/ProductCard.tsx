import { Link } from "@tanstack/react-router";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const valuationDelta = product.aiValuation - product.price;
  const isUndervalued = valuationDelta > 0;

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block bg-card rounded-2xl ring-1 ring-black/5 hover:ring-black/10 hover:-translate-y-0.5 transition-all overflow-hidden"
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          width={800}
          height={800}
          className="size-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.trending && (
            <span className="bg-ink text-surface text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
              Trending
            </span>
          )}
          {product.acceptsTrade && (
            <span className="bg-brand/10 text-brand text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ring-1 ring-brand/15">
              Trade OK
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded ring-1 ring-black/5">
          {product.trustScore} AI
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{product.brand}</p>
            <h3 className="text-sm font-semibold leading-tight truncate">{product.title}</h3>
          </div>
        </div>
        <div className="flex items-end justify-between mt-3 pt-3 border-t border-black/5">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Price</p>
            <p className="text-base font-semibold tracking-tight">{formatPrice(product.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">AI Value</p>
            <p className={`text-xs font-semibold ${isUndervalued ? "text-brand" : "text-muted-foreground"}`}>
              {isUndervalued ? "+" : ""}
              {formatPrice(valuationDelta)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

import { Heart, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { discountPercent, formatPrice, sized, type Product } from "@/lib/store";
import { Stars } from "./Stars";

interface ProductCardProps {
  product: Product;
  currency?: string;
  onAdd: (product: Product) => void;
  onOpen: (product: Product) => void;
  favorite?: boolean;
  onToggleFavorite?: ((productId: number) => void) | undefined;
}

export function ProductBadge({ product }: { product: Product }) {
  if (!product.badge) return null;
  const tone =
    product.tone ?? (product.badge === "NEW" ? "new" : product.badge === "SALE" ? "sale" : "best");
  return (
    <span
      className={`badge-${tone} rounded-md px-2.5 py-1 text-[11px] font-bold text-badge-foreground`}
    >
      {product.badge}
    </span>
  );
}

export function ProductCard({
  product,
  currency = "$",
  onAdd,
  onOpen,
  favorite = false,
  onToggleFavorite,
}: ProductCardProps) {
  const off = discountPercent(product);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition duration-300 hover:-translate-y-1.5 hover:shadow-card">
      <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
        <ProductBadge product={product} />
        {off > 0 ? (
          <span className="rounded-md bg-brand-dark px-2 py-1 text-[11px] font-bold text-brand-light">
            -{off}%
          </span>
        ) : null}
      </div>

      {onToggleFavorite ? (
        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          aria-label={favorite ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-card/90 text-muted-foreground shadow-sm transition-colors hover:text-primary ${
            favorite ? "text-primary" : ""
          }`}
        >
          <Heart className="size-4" fill={favorite ? "currentColor" : "none"} />
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => onOpen(product)}
        className="relative block h-44 overflow-hidden bg-muted sm:h-48"
        aria-label={`View ${product.name}`}
      >
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={sized(product.image, 600, 600)}
          alt={product.name}
          loading="lazy"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-brand-dark/85 py-2 text-center text-xs font-semibold text-brand-light transition-transform duration-300 group-hover:translate-y-0">
          Quick view
        </span>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>
        <h3 className="mt-1 text-[15px] font-bold leading-snug">
          <button
            type="button"
            onClick={() => onOpen(product)}
            className="text-left hover:text-primary"
          >
            {product.name}
          </button>
        </h3>
        <Stars rating={product.rating} reviews={product.reviews} className="mt-1.5" />
        <p className="my-3 flex flex-wrap items-baseline gap-2 text-base font-bold text-foreground">
          {formatPrice(product.price, currency)}
          {product.oldPrice ? (
            <span className="text-sm font-medium text-muted-foreground line-through">
              {formatPrice(product.oldPrice, currency)}
            </span>
          ) : null}
        </p>
        {product.stock > 0 && product.stock <= 10 ? (
          <p className="-mt-2 mb-2 text-[11px] font-semibold text-destructive">
            Only {product.stock} left in stock
          </p>
        ) : null}

        <div className="mt-auto flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="size-4" /> Add to Cart
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpen(product)}
            aria-label={`Quick view ${product.name}`}
            className="px-3"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

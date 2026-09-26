import { Heart, Minus, Plus, ShoppingCart, Store, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { discountPercent, formatPrice, sized, type Product, type StoreData } from "@/lib/store";
import { ProductBadge } from "./ProductCard";
import { Stars } from "./Stars";

interface QuickViewProps {
  product: Product | null;
  store: StoreData;
  currency?: string;
  favorite?: boolean;
  onClose: () => void;
  onAdd: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onToggleFavorite?: (productId: number) => void;
  onSeeCollection?: (collectionId: string) => void;
}

/** Product detail modal: gallery, price, quantity and add-to-cart actions. */
export function QuickView({
  product,
  store,
  currency = "$",
  favorite = false,
  onClose,
  onAdd,
  onBuyNow,
  onToggleFavorite,
  onSeeCollection,
}: QuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setQuantity(1);
    setActiveImage(0);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  if (!product) return null;

  const images = product.gallery?.length ? product.gallery : [product.image];
  const currentImage = images[Math.min(activeImage, images.length - 1)] ?? product.image;
  const off = discountPercent(product);
  const collection = store.collections.find((c) => c.id === product.collection);
  const siblings = store.products.filter(
    (p) => p.collection === product.collection && p.active !== false && p.id !== product.id,
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        className="absolute inset-0 bg-overlay backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-card shadow-drawer sm:max-w-3xl sm:rounded-2xl"
      >
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="relative bg-muted">
            <img
              src={sized(currentImage, 800, 800)}
              alt={product.name}
              className="h-[280px] w-full object-cover sm:h-full sm:min-h-[420px]"
            />
            <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
              <ProductBadge product={product} />
              {off > 0 ? (
                <span className="rounded-md bg-brand-dark px-2 py-1 text-[11px] font-bold text-brand-light">
                  -{off}%
                </span>
              ) : null}
            </div>
            {images.length > 1 ? (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    aria-label={`Show image ${idx + 1}`}
                    className={`size-12 overflow-hidden rounded-md border-2 bg-card transition-colors ${
                      idx === activeImage ? "border-primary" : "border-transparent opacity-70"
                    }`}
                  >
                    <img src={sized(img, 160, 160)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {product.category}
                </p>
                <h2 className="mt-1 text-xl font-bold sm:text-2xl">{product.name}</h2>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {onToggleFavorite ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleFavorite(product.id)}
                    aria-label="Toggle wishlist"
                    className={favorite ? "text-primary" : ""}
                  >
                    <Heart className="size-5" fill={favorite ? "currentColor" : "none"} />
                  </Button>
                ) : null}
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                  <X className="size-5" />
                </Button>
              </div>
            </div>

            <Stars rating={product.rating} reviews={product.reviews} className="mt-2" size={16} />

            <div className="mt-4 flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price, currency)}
              </span>
              {product.oldPrice ? (
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.oldPrice, currency)}
                </span>
              ) : null}
            </div>
            {store.settings.maxInstallments > 1 ? (
              <p className="mt-1 text-xs text-muted-foreground">
                or {store.settings.maxInstallments}x of{" "}
                {formatPrice(product.price / store.settings.maxInstallments, currency)} interest
                free
              </p>
            ) : null}

            {product.description ? (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{product.description}</p>
            ) : null}

            <p className="mt-4 text-xs font-semibold">
              {product.stock > 10 ? (
                <span className="text-primary">✅ In stock — ships today</span>
              ) : product.stock > 0 ? (
                <span className="text-destructive">⚡ Only {product.stock} left in stock</span>
              ) : (
                <span className="text-muted-foreground">Out of stock</span>
              )}
            </p>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="grid size-10 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  className="grid size-10 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                Subtotal:{" "}
                <strong className="text-foreground">
                  {formatPrice(product.price * quantity, currency)}
                </strong>
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <Button
                size="sm"
                onClick={() => onAdd(product, quantity)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="size-4" /> Add to cart
              </Button>
              <Button
                size="sm"
                variant="dark"
                onClick={() => onBuyNow(product, quantity)}
                disabled={product.stock === 0}
              >
                <Store className="size-4" /> Buy now on WhatsApp
              </Button>
            </div>

            {collection && onSeeCollection ? (
              <button
                type="button"
                onClick={() => onSeeCollection(product.collection)}
                className="mt-5 rounded-lg bg-primary-soft px-4 py-3 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <strong className="text-foreground">
                  {siblings.length} more in {collection.name}
                </strong>
                <br />
                See every {collection.name.toLowerCase()} available in the store →
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

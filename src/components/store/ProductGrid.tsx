import { PackageSearch } from "lucide-react";

import type { Product } from "@/lib/store";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  columns?: number;
  currency?: string;
  onAdd: (product: Product) => void;
  onOpen: (product: Product) => void;
  favorites?: number[];
  onToggleFavorite?: (productId: number) => void;
  emptyMessage?: string;
  /** Renders as a horizontal snap carousel on small screens. */
  carouselOnMobile?: boolean;
}

/**
 * Responsive product grid.
 * 2 columns on mobile, 3 on tablets and `columns` (2–5) on large screens.
 */
export function ProductGrid({
  products,
  columns = 4,
  currency = "$",
  onAdd,
  onOpen,
  favorites = [],
  onToggleFavorite,
  emptyMessage = "No products found.",
  carouselOnMobile = false,
}: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <PackageSearch className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const safeColumns = Math.min(5, Math.max(2, columns));

  return (
    <div
      className={
        carouselOnMobile
          ? "no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
          : "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
      }
      style={{ ["--cols" as string]: safeColumns }}
    >
      {products.map((product) => (
        <div
          key={product.id}
          className={
            carouselOnMobile
              ? "w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-auto sm:max-w-none"
              : ""
          }
        >
          <ProductCard
            product={product}
            currency={currency}
            onAdd={onAdd}
            onOpen={onOpen}
            favorite={favorites.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}
    </div>
  );
}

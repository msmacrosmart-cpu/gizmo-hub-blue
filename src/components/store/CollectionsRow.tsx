import { ChevronRight } from "lucide-react";

import type { Collection, Product } from "@/lib/store";
import { sized } from "@/lib/store";

interface CollectionsRowProps {
  collections: Collection[];
  products: Product[];
  columns?: number;
  onSelect: (collectionId: string) => void;
}

/** "Shop by category" tiles — each one filters the catalog below. */
export function CollectionsRow({
  collections,
  products,
  columns = 5,
  onSelect,
}: CollectionsRowProps) {
  if (!collections.length) return null;
  const safeColumns = Math.min(5, Math.max(2, columns));

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
      style={{ ["--cols" as string]: safeColumns }}
    >
      {collections.map((collection) => {
        const count = products.filter((p) => p.collection === collection.id).length;
        return (
          <button
            key={collection.id}
            type="button"
            onClick={() => onSelect(collection.id)}
            className="group relative h-44 overflow-hidden rounded-xl text-left sm:h-[180px]"
            aria-label={`Shop ${collection.name}`}
          >
            <img
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={sized(collection.image, 700, 700)}
              alt={collection.name}
              loading="lazy"
            />
            <div className="category-shade relative flex h-full flex-col justify-end p-4 text-brand-light sm:p-5">
              <h3 className="text-base font-bold sm:text-lg">{collection.name}</h3>
              {collection.tagline ? (
                <p className="mt-0.5 line-clamp-1 text-[11px] text-brand-blue-soft sm:text-xs">
                  {collection.tagline}
                </p>
              ) : null}
              <span className="mt-1.5 flex items-center text-xs font-semibold text-brand-blue-soft sm:text-sm">
                {count} {count === 1 ? "product" : "products"} <ChevronRight className="size-4" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

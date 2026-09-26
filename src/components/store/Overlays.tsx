import { CircleUserRound, Heart, Search, ShoppingCart, Trash2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatPrice, sized, type Product } from "@/lib/store";
import type { NavItem } from "./Header";

/* ------------------------------- mobile menu ------------------------------- */

export function MobileMenu({
  open,
  navItems,
  storeName,
  onClose,
  onNavigate,
  onOpenAccount,
  onOpenCart,
}: {
  open: boolean;
  navItems: readonly NavItem[];
  storeName: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onOpenAccount: () => void;
  onOpenCart: () => void;
}) {
  return (
    <aside
      className={`mobile-drawer fixed right-0 top-0 z-50 h-dvh w-[min(88vw,360px)] bg-card p-6 shadow-drawer transition-transform duration-300 ${
        open ? "mobile-drawer-open" : ""
      }`}
      aria-label="Mobile navigation"
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between">
        <strong className="text-xl">{storeName}</strong>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
          <X className="size-5" />
        </Button>
      </div>
      <nav className="mt-8">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  onClose();
                  onNavigate(item.id);
                }}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-accent"
              >
                {item.label}
                <span className="text-muted-foreground">→</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            onClose();
            onOpenAccount();
          }}
        >
          <CircleUserRound className="size-5" /> My account
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            onClose();
            onOpenCart();
          }}
        >
          <ShoppingCart className="size-5" /> My cart
        </Button>
      </div>
    </aside>
  );
}

/* --------------------------------- search ---------------------------------- */

export function SearchOverlay({
  open,
  products,
  currency = "$",
  onClose,
  onSelect,
}: {
  open: boolean;
  products: Product[];
  currency?: string;
  onClose: () => void;
  onSelect: (product: Product) => void;
}) {
  const [query, setQuery] = useState("");

  if (!open) return null;

  const term = query.trim().toLowerCase();
  const results = term
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      )
    : products.slice(0, 6);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-16 sm:pt-24">
      <button
        className="absolute inset-0 bg-overlay backdrop-blur-sm"
        aria-label="Close search"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl bg-card shadow-drawer"
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, categories..."
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close search">
            <X className="size-4" />
          </Button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No products match “{query}”.
            </p>
          ) : (
            results.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  onSelect(product);
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent"
              >
                <img
                  src={sized(product.image, 120, 120)}
                  alt={product.name}
                  className="size-12 shrink-0 rounded-md object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{product.name}</span>
                  <span className="block text-xs text-muted-foreground">{product.category}</span>
                </span>
                <span className="shrink-0 text-sm font-bold">
                  {formatPrice(product.price, currency)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- account --------------------------------- */

export function AccountPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <button
        className="absolute inset-0 bg-overlay backdrop-blur-sm"
        aria-label="Close account"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Account"
        className="relative z-10 w-full max-w-sm rounded-xl bg-card p-6 shadow-drawer"
      >
        <h2 className="text-lg font-bold">My Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track orders, save favorites and check out faster.
        </p>
        <div className="mt-5 space-y-2">
          <Button variant="outline" className="w-full">
            Sign In
          </Button>
          <Button variant="outline" className="w-full">
            Create Account
          </Button>
        </div>
        <Button variant="ghost" className="mt-3 w-full" onClick={onClose}>
          Continue as guest
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------- favorites -------------------------------- */

export function FavoritesDrawer({
  open,
  products,
  currency = "$",
  onClose,
  onAdd,
  onOpen,
  onRemove,
  onClear,
}: {
  open: boolean;
  products: Product[];
  currency?: string;
  onClose: () => void;
  onAdd: (product: Product) => void;
  onOpen: (product: Product) => void;
  onRemove: (productId: number) => void;
  onClear: () => void;
}) {
  return (
    <aside
      className={`mobile-drawer fixed right-0 top-0 z-50 flex h-dvh w-[min(94vw,400px)] flex-col bg-card p-5 shadow-drawer transition-transform duration-300 sm:p-6 ${
        open ? "mobile-drawer-open" : ""
      }`}
      aria-label="Wishlist"
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Wishlist</h2>
          <p className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close wishlist">
          <X className="size-5" />
        </Button>
      </div>

      <div className="mt-5 flex-1 space-y-3 overflow-y-auto pr-1">
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Heart className="size-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No favorites yet.</p>
            <Button variant="outline" size="sm" onClick={onClose}>
              Browse products
            </Button>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex gap-3 rounded-lg border border-border p-3">
              <img
                src={sized(product.image, 160, 160)}
                alt={product.name}
                className="size-16 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{product.name}</p>
                <p className="text-sm font-bold text-primary">
                  {formatPrice(product.price, currency)}
                </p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onAdd(product)}>
                    <ShoppingCart className="size-3.5" /> Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onOpen(product)}>
                    View
                  </Button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(product.id)}
                aria-label={`Remove ${product.name} from wishlist`}
                className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {products.length > 0 ? (
        <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={onClear}>
          <Trash2 className="size-4" /> Clear wishlist
        </Button>
      ) : null}
    </aside>
  );
}

import { CircleUserRound, Heart, MapPin, Menu, Phone, Search, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { StoreData } from "@/lib/store";
import { Brand } from "./Brand";

export interface NavItem {
  label: string;
  id: string;
}

interface HeaderProps {
  store: StoreData;
  navItems: readonly NavItem[];
  cartCount: number;
  favoritesCount: number;
  onNavigate: (id: string) => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenCart: () => void;
  onOpenMenu: () => void;
  onOpenFavorites: () => void;
}

export function Header({
  store,
  navItems,
  cartCount,
  favoritesCount,
  onNavigate,
  onOpenSearch,
  onOpenAccount,
  onOpenCart,
  onOpenMenu,
  onOpenFavorites,
}: HeaderProps) {
  const { settings } = store;

  return (
    <>
      {settings.showAnnouncement && settings.announcement.trim() ? (
        <div className="bg-primary px-4 py-2 text-center text-[12px] font-medium text-primary-foreground sm:text-[13px]">
          {settings.announcement}
        </div>
      ) : null}

      {/* Utility strip (desktop) */}
      <div className="hidden border-b border-white/10 bg-brand-dark/95 text-brand-muted lg:block">
        <div className="mx-auto flex max-w-page items-center justify-between gap-6 px-10 py-2 text-[13px]">
          <span className="flex items-center gap-2">
            <MapPin className="size-3.5" /> Free shipping on orders over $
            {settings.freeShippingFrom}
          </span>
          <div className="flex items-center gap-5">
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-brand-light"
            >
              <Phone className="size-3.5" /> WhatsApp {settings.whatsappNumber}
            </a>
            <button onClick={onOpenAccount} className="transition-colors hover:text-brand-light">
              Sign in / Create account
            </button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-brand-dark text-brand-light shadow-header">
        <div className="mx-auto grid h-[68px] max-w-page grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:grid-cols-[auto_1fr_auto] lg:px-10">
          <Brand name={settings.storeName} onClick={() => onNavigate("top")} />

          <nav className="hidden justify-center lg:flex" aria-label="Main navigation">
            <ul className="flex items-center gap-7">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="text-[15px] text-brand-muted transition-colors hover:text-brand-light"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button variant="icon" size="icon" onClick={onOpenSearch} aria-label="Search products">
              <Search className="size-5" />
            </Button>
            <Button
              variant="icon"
              size="icon"
              onClick={onOpenFavorites}
              aria-label={`Wishlist with ${favoritesCount} items`}
              className="relative hidden sm:inline-flex"
            >
              <Heart className="size-5" />
              {favoritesCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {favoritesCount}
                </span>
              )}
            </Button>
            <Button
              variant="icon"
              size="icon"
              onClick={onOpenAccount}
              aria-label="Account"
              className="hidden sm:inline-flex"
            >
              <CircleUserRound className="size-5" />
            </Button>
            <Button
              variant="icon"
              size="icon"
              onClick={onOpenCart}
              aria-label={`Cart with ${cartCount} items`}
              className="relative"
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 grid size-[18px] place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>
            <Button
              variant="icon"
              size="icon"
              onClick={onOpenMenu}
              aria-label="Open menu"
              className="lg:hidden"
            >
              <Menu className="size-6" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

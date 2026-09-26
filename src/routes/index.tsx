import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { BenefitsBar } from "@/components/store/BenefitsBar";
import { CartDrawer } from "@/components/store/CartDrawer";
import { CheckoutModal } from "@/components/store/CheckoutModal";
import { CollectionsRow } from "@/components/store/CollectionsRow";
import { Header, type NavItem } from "@/components/store/Header";
import { Hero } from "@/components/store/Hero";
import {
  AccountPanel,
  FavoritesDrawer,
  MobileMenu,
  SearchOverlay,
} from "@/components/store/Overlays";
import { ProductGrid } from "@/components/store/ProductGrid";
import { QuickView } from "@/components/store/QuickView";
import {
  BlogSection,
  BrandsStrip,
  DealsBanner,
  Footer,
  Newsletter,
  PromoCards,
} from "@/components/store/Sections";
import { buildOrderMessage, openWhatsApp, type CartItem, type CustomerInfo } from "@/lib/order";
import { activeProducts, formatPrice, hydrateStore, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GizmoHub | Smart Tech for Everyday Life" },
      {
        name: "description",
        content:
          "Discover premium gadgets, smart devices and accessories selected for performance and style.",
      },
      { property: "og:title", content: "GizmoHub | Smart Tech for Everyday Life" },
      {
        property: "og:description",
        content:
          "Discover premium gadgets, smart devices and accessories selected for performance and style.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GizmoHub,
});

const navItems: readonly NavItem[] = [
  { label: "Home", id: "top" },
  { label: "Shop", id: "catalog" },
  { label: "New Arrivals", id: "new-arrivals" },
  { label: "Top Deals", id: "deals" },
  { label: "Brands", id: "brands" },
  { label: "Blog", id: "blog" },
  { label: "Contact", id: "contact" },
];

const CART_KEY = "gizmoHubCart.v1";
const FAVORITES_KEY = "gizmoHubFavorites.v1";
const CURRENCY = "$";

type Overlay = "search" | "account" | "menu" | "cart" | "checkout" | "favorites" | null;
type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

function GizmoHub() {
  const store = useStore();
  const { settings } = store;

  const [overlay, setOverlay] = useState<Overlay>(null);
  const [quickProductId, setQuickProductId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [toast, setToast] = useState<string | null>(null);

  /* ------------------------------ persistence ------------------------------ */
  useEffect(() => {
    hydrateStore();
  }, []);

  const storageReady = useRef(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_KEY);
      if (savedCart) setCart(JSON.parse(savedCart) as CartItem[]);
      const savedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites) as number[]);
    } catch {
      /* ignore corrupted storage */
    }
    storageReady.current = true;
  }, []);

  useEffect(() => {
    if (!storageReady.current) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!storageReady.current) return;
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  /* -------------------------------- helpers -------------------------------- */
  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast((current) => (current === message ? null : current)), 2600);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setOverlay(null);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const closeOverlays = useCallback(() => {
    setOverlay(null);
    setQuickProductId(null);
  }, []);

  /* --------------------------------- cart ---------------------------------- */
  const addToCart = useCallback(
    (productId: number, quantity = 1) => {
      const product = store.products.find((p) => p.id === productId);
      if (!product) return;
      setCart((current) => {
        const existing = current.find((item) => item.productId === productId);
        if (existing) {
          return current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
              : item,
          );
        }
        return [
          ...current,
          {
            id: `p-${productId}`,
            productId,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity,
          },
        ];
      });
      showToast(`${product.name} added to cart`);
      setOverlay("cart");
    },
    [store.products, showToast],
  );

  const setQuantity = useCallback((id: string, quantity: number) => {
    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(99, quantity) } : item,
          ),
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  }, []);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }, []);

  /* ------------------------------- checkout -------------------------------- */
  const submitOrder = useCallback(
    (customer: CustomerInfo) => {
      if (!cart.length) return;
      const message = buildOrderMessage(cart, customer, store, CURRENCY);
      openWhatsApp(settings.whatsappNumber, message);
      setCart([]);
      setOverlay(null);
      showToast("Order sent to WhatsApp 🎉");
    },
    [cart, store, settings.whatsappNumber, showToast],
  );

  const buyNow = useCallback(
    (productId: number, quantity = 1) => {
      const product = store.products.find((p) => p.id === productId);
      if (!product) return;
      setCart([
        {
          id: `p-${productId}`,
          productId,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity,
        },
      ]);
      setQuickProductId(null);
      setOverlay("checkout");
    },
    [store.products],
  );

  /* ------------------------------- filtering ------------------------------- */
  const catalogProducts = useMemo(() => {
    const list = activeProducts(store);
    const filtered = list.filter((product) => {
      if (filter === "all") return true;
      if (filter === "new") return product.badge === "NEW";
      if (filter === "sale")
        return product.badge === "SALE" || (product.oldPrice ?? 0) > product.price;
      if (filter === "bestsellers") return product.badge === "BESTSELLER";
      return product.collection === filter;
    });

    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "featured") sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    return sorted;
  }, [store, filter, sort]);

  const featured = useMemo(() => {
    const list = activeProducts(store).filter((p) => p.featured);
    return list.length ? list : activeProducts(store).slice(0, 4);
  }, [store]);

  const favoriteProducts = useMemo(
    () => store.products.filter((p) => favorites.includes(p.id)),
    [store.products, favorites],
  );

  const quickProduct = quickProductId
    ? (store.products.find((p) => p.id === quickProductId) ?? null)
    : null;

  const applyFilter = useCallback(
    (nextFilter: string) => {
      setFilter(nextFilter);
      setSort("featured");
      scrollTo("catalog");
    },
    [scrollTo],
  );

  const chips = useMemo(() => {
    const base = [{ id: "all", label: "All products" }];
    const collections = store.collections.map((collection) => ({
      id: collection.id,
      label: collection.name,
    }));
    return [
      ...base,
      ...collections,
      { id: "new", label: "✨ New" },
      { id: "sale", label: "🏷️ On sale" },
      { id: "bestsellers", label: "🔥 Bestsellers" },
    ];
  }, [store.collections]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const anyOverlayOpen = overlay !== null || quickProductId !== null;

  return (
    <div
      id="top"
      className={`min-h-screen overflow-x-hidden bg-background text-foreground ${
        cartCount > 0 ? "pb-20 lg:pb-0" : ""
      }`}
    >
      <Header
        store={store}
        navItems={navItems}
        cartCount={cartCount}
        favoritesCount={favorites.length}
        onNavigate={scrollTo}
        onOpenSearch={() => setOverlay("search")}
        onOpenAccount={() => setOverlay("account")}
        onOpenCart={() => setOverlay("cart")}
        onOpenMenu={() => setOverlay("menu")}
        onOpenFavorites={() => setOverlay("favorites")}
      />

      <main>
        <Hero
          slides={store.heroSlides}
          autoplayMs={settings.heroAutoplayMs}
          onNavigate={scrollTo}
        />

        <BenefitsBar benefits={store.benefits} />

        {/* Shop by category */}
        <section
          id="shop"
          className="mx-auto max-w-page scroll-mt-20 px-5 py-10 sm:px-8 lg:px-10 lg:py-[60px]"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-primary">
                Shop by category
              </p>
              <h2 className="mt-1 text-2xl font-bold sm:text-[26px]">What are you looking for?</h2>
            </div>
            <button
              onClick={() => applyFilter("all")}
              className="text-sm font-semibold text-primary hover:text-primary/80"
            >
              Browse everything <ChevronRight className="inline size-4" />
            </button>
          </div>
          <div className="mt-6">
            <CollectionsRow
              collections={store.collections}
              products={activeProducts(store)}
              columns={settings.collectionColumns}
              onSelect={applyFilter}
            />
          </div>
        </section>

        {/* Top picks */}
        <section id="top-picks" className="mx-auto max-w-page scroll-mt-20">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-8 lg:px-10">
            <h2 className="truncate text-2xl font-bold sm:text-[26px]">Top Picks</h2>
            <button
              onClick={() => applyFilter("all")}
              className="text-sm font-semibold text-primary hover:text-primary/80"
            >
              View All <ChevronRight className="inline size-4" />
            </button>
          </div>
          <div className="mt-6 px-5 pb-12 sm:px-8 lg:pb-[60px]">
            <ProductGrid
              products={featured}
              columns={settings.productColumns}
              currency={CURRENCY}
              carouselOnMobile
              onAdd={(product) => addToCart(product.id)}
              onOpen={(product) => setQuickProductId(product.id)}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </section>

        <DealsBanner settings={settings} onShopDeals={() => applyFilter("sale")} />

        <div className="pt-12 lg:pt-[60px]">
          <PromoCards onFilter={(key) => applyFilter(key === "new" ? "new" : "bestsellers")} />
        </div>

        {/* Full catalog with filters */}
        <section
          id="catalog"
          className="mx-auto max-w-page scroll-mt-20 px-5 pb-12 sm:px-8 lg:px-10 lg:pb-[60px]"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-primary">
                {filter === "all"
                  ? "Full catalog"
                  : (chips.find((chip) => chip.id === filter)?.label ?? "Collection")}
              </p>
              <h2 className="mt-1 text-2xl font-bold sm:text-[26px]">
                {filter === "all"
                  ? "All products"
                  : (chips.find((chip) => chip.id === filter)?.label ?? "Products")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {catalogProducts.length} {catalogProducts.length === 1 ? "product" : "products"}{" "}
                available
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <SlidersHorizontal className="size-4 text-muted-foreground" />
              <span className="sr-only">Sort products</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {chips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilter(chip.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  filter === chip.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <ProductGrid
              products={catalogProducts}
              columns={settings.productColumns}
              currency={CURRENCY}
              onAdd={(product) => addToCart(product.id)}
              onOpen={(product) => setQuickProductId(product.id)}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              emptyMessage="Nothing here yet — try another category."
            />
          </div>
        </section>

        <BrandsStrip names={["SoundPro", "NOVATECH", "AERO", "Zenith", "Pulse", "Gizmo"]} />

        <BlogSection />

        <Newsletter storeName={settings.storeName} />
      </main>

      <Footer store={store} onNavigate={scrollTo} />

      {/* ------------------------------ overlays ----------------------------- */}
      {overlay !== null ? (
        <button
          className="fixed inset-0 z-40 bg-overlay backdrop-blur-sm"
          aria-label="Close panel"
          onClick={closeOverlays}
        />
      ) : null}

      <MobileMenu
        open={overlay === "menu"}
        navItems={navItems}
        storeName={settings.storeName}
        onClose={closeOverlays}
        onNavigate={scrollTo}
        onOpenAccount={() => setOverlay("account")}
        onOpenCart={() => setOverlay("cart")}
      />

      <SearchOverlay
        open={overlay === "search"}
        products={activeProducts(store)}
        currency={CURRENCY}
        onClose={closeOverlays}
        onSelect={(product) => setQuickProductId(product.id)}
      />

      <AccountPanel open={overlay === "account"} onClose={closeOverlays} />

      <FavoritesDrawer
        open={overlay === "favorites"}
        products={favoriteProducts}
        currency={CURRENCY}
        onClose={closeOverlays}
        onAdd={(product) => addToCart(product.id)}
        onOpen={(product) => setQuickProductId(product.id)}
        onRemove={toggleFavorite}
        onClear={() => setFavorites([])}
      />

      <CartDrawer
        open={overlay === "cart"}
        items={cart}
        store={store}
        currency={CURRENCY}
        onClose={closeOverlays}
        onSetQuantity={setQuantity}
        onRemove={removeFromCart}
        onClear={() => setCart([])}
        onCheckout={() => setOverlay("checkout")}
      />

      <CheckoutModal
        open={overlay === "checkout"}
        items={cart}
        store={store}
        currency={CURRENCY}
        onClose={closeOverlays}
        onSubmit={submitOrder}
      />

      <QuickView
        product={quickProduct}
        store={store}
        currency={CURRENCY}
        favorite={quickProduct ? favorites.includes(quickProduct.id) : false}
        onClose={() => setQuickProductId(null)}
        onAdd={(product, quantity) => addToCart(product.id, quantity)}
        onBuyNow={(product, quantity) => buyNow(product.id, quantity)}
        onToggleFavorite={toggleFavorite}
        onSeeCollection={(collectionId) => {
          setQuickProductId(null);
          applyFilter(collectionId);
        }}
      />

      {/* -------------------------------- toast ------------------------------ */}
      {toast ? (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-brand-dark px-5 py-3 text-sm font-semibold text-brand-light shadow-drawer">
          <span className="flex items-center gap-2">
            <Check className="size-4 text-primary" /> {toast}
          </span>
        </div>
      ) : null}

      {/* Mobile sticky cart bar */}
      {cartCount > 0 && !anyOverlayOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card p-3 lg:hidden">
          <Button className="w-full" onClick={() => setOverlay("cart")}>
            View cart • {cartCount} {cartCount === 1 ? "item" : "items"} •{" "}
            {formatPrice(
              cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
              CURRENCY,
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default GizmoHub;

import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleUserRound,
  Headphones,
  Mail,
  Menu,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Trash2,
  Truck,
} from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GizmoHub | Smart Tech for Everyday Life" },
      {
        name: "description",
        content: "Discover premium gadgets, smart devices and accessories selected for performance and style.",
      },
      { property: "og:title", content: "GizmoHub | Smart Tech for Everyday Life" },
      {
        property: "og:description",
        content: "Discover premium gadgets, smart devices and accessories selected for performance and style.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GizmoHub,
});

const navItems = [
  ["Home", "top"],
  ["Shop", "shop"],
  ["New Arrivals", "new-arrivals"],
  ["Top Deals", "deals"],
  ["Brands", "brands"],
  ["Blog", "blog"],
  ["Contact", "contact"],
] as const;

// Catálogo com as imagens originais do index 1
const defaultData = {
  categories: [
    {
      name: "Audio Devices",
      image: "https://images.pexels.com/photos/3756985/pexels-photo-3756985.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      name: "Smart Watches",
      image: "https://images.pexels.com/photos/31541678/pexels-photo-31541678.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      name: "Power Solutions",
      image: "https://images.pexels.com/photos/4765366/pexels-photo-4765366.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      name: "Drones & Cameras",
      image: "https://images.pexels.com/photos/8821970/pexels-photo-8821970.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
  ],
  products: [
    {
      id: 1,
      name: "SoundPro X1",
      category: "Wireless Earbuds",
      price: "$79.99",
      badge: "NEW",
      tone: "new" as const,
      image: "https://images.pexels.com/photos/9528219/pexels-photo-9528219.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
    },
    {
      id: 2,
      name: "Active Watch 2",
      category: "Smartwatch",
      price: "$149.99",
      badge: "BESTSELLER",
      tone: "best" as const,
      image: "https://images.pexels.com/photos/12564670/pexels-photo-12564670.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      id: 3,
      name: "BoomMate",
      category: "Portable Speaker",
      price: "$89.99",
      oldPrice: "$119.99",
      badge: "SALE",
      tone: "sale" as const,
      image: "https://images.pexels.com/photos/29581125/pexels-photo-29581125.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
      id: 4,
      name: "GameMax Pro",
      category: "Gaming Mouse",
      price: "$39.99",
      oldPrice: "$59.99",
      image: "https://images.pexels.com/photos/12877898/pexels-photo-12877898.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
  ],
  heroImages: [
    "https://images.pexels.com/photos/32912307/pexels-photo-32912307.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/3962316/pexels-photo-3962316.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/4481154/pexels-photo-4481154.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
};

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

interface CustomerData {
  name: string;
  address: string;
  paymentMethod: "pix" | "cartao";
}
function GizmoHub() {
  const [categories, setCategories] = useState(defaultData.categories);
  const [products, setProducts] = useState(defaultData.products);
  const [heroImages, setHeroImages] = useState(defaultData.heroImages);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subscribed, setSubscribed] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [checkoutFormOpen, setCheckoutFormOpen] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    address: "",
    paymentMethod: "pix",
  });

  // Carregar e sincronizar dados salvos
  useEffect(() => {
    const loadSavedData = () => {
      const saved = localStorage.getItem("gizmoHubData");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.heroImages && data.heroImages.length > 0) setHeroImages(data.heroImages);
          if (data.categories && data.categories.length > 0) setCategories(data.categories);
          if (data.products && data.products.length > 0) setProducts(data.products);
        } catch (error) {
          console.error("Erro ao carregar dados salvos:", error);
        }
      }
    };

    loadSavedData();
    const interval = setInterval(loadSavedData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Timer do slider Hero
  useEffect(() => {
    if (!heroImages.length) return;
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const addToCart = (product: { id: number; name: string; price: string }) => {
    const productKey = `${product.id}-${product.name}`;
    setCart((current) => {
      const existing = current.find((item) => item.id === productKey);
      if (existing) {
        return current.map((item) =>
          item.id === productKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...current,
        {
          id: productKey,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const calculateTotal = (): number => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace("$", ""));
      return sum + (isNaN(price) ? 0 : price) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutFormOpen(true);
  };

  const handleSubmitCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customerData.name || !customerData.address) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    const total = calculateTotal().toFixed(2);
    let message = "🛒 *NOVO PEDIDO GIZMO HUB* 🛒\n\n";
    message += `👤 *Cliente:* ${customerData.name}\n`;
    message += `📍 *Endereço:* ${customerData.address}\n`;
    message += `💳 *Pagamento:* ${customerData.paymentMethod === "pix" ? "PIX" : "Cartão"}\n`;
    message += `\n📦 *ITENS DO PEDIDO:*\n`;
    message += "━━━━━━━━━━━━━━━━━━━\n";

    cart.forEach((item, index) => {
      const itemPrice = parseFloat(item.price.replace("$", ""));
      const itemTotal = (itemPrice * item.quantity).toFixed(2);
      message += `${index + 1}. ${item.name}\n`;
      message += `   💰 ${item.price} x ${item.quantity} = $${itemTotal}\n`;
    });

    message += "━━━━━━━━━━━━━━━━━━━\n";
    message += `\n💵 *TOTAL: $${total}*\n`;
    message += `\n✅ Aguardando confirmação!\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5511977888609?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");

    setCart([]);
    setCheckoutFormOpen(false);
    setCustomerData({ name: "", address: "", paymentMethod: "pix" });
    setCartOpen(false);
  };

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return (
    <div id="top" className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-dark text-brand-light shadow-header">
        <div className="mx-auto grid h-[68px] max-w-page grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:grid-cols-[auto_1fr_auto] lg:px-10">
          <button className="flex min-w-0 items-center gap-2.5" onClick={() => scrollTo("top")} aria-label="GizmoHub home">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary"><Star className="size-[18px]" fill="currentColor" /></span>
            <span className="truncate text-[22px] font-bold">GizmoHub</span>
          </button>
          <nav className="hidden justify-center lg:flex" aria-label="Main navigation">
            <ul className="flex items-center gap-7">
              {navItems.map(([label, id]) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="text-[15px] text-brand-muted transition-colors hover:text-brand-light"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button variant="icon" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search"><Search className="size-5" /></Button>
            <Button variant="icon" size="icon" onClick={() => setAccountOpen(true)} aria-label="Account" className="hidden sm:inline-flex"><CircleUserRound className="size-5" /></Button>
            <Button variant="icon" size="icon" onClick={() => setCartOpen(true)} aria-label={`Cart with ${cart.length} items`} className="relative">
              <ShoppingCart className="size-5" />
              {cart.length > 0 && (
                <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cart.length}
                </span>
              )}
            </Button>
            <Button variant="icon" size="icon" onClick={() => setMobileOpen(true)} aria-label="Open menu" className="lg:hidden"><Menu className="size-6" /></Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-surface relative overflow-hidden text-brand-light">
          <div className="mx-auto grid min-h-[590px] max-w-page items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:px-[60px] lg:py-20">
            <div className="relative z-10 max-w-xl">
              <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.12em] text-brand-blue-soft">Upgrade Your Life</p>
              <h1 className="text-[40px] font-bold leading-[1.08] sm:text-5xl lg:text-[44px]">Smart Tech.<br />Better Everyday.</h1>
              <p className="mt-5 max-w-[480px] text-base leading-7 text-brand-muted sm:text-[17px]">Discover innovative gadgets and accessories built for performance and style.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button onClick={() => scrollTo("shop")}>Explore Now <ArrowRight className="size-4" /></Button>
                <Button variant="outline" onClick={() => scrollTo("deals")}>View Deals</Button>
              </div>
              <div className="mt-7 flex gap-2" aria-label={`Slide ${heroSlide + 1} of ${heroImages.length}`}>
                {heroImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-2.5 rounded-full transition-all ${idx === heroSlide ? "w-7 bg-primary" : "w-2.5 bg-brand-light/30"}`}
                  />
                ))}
              </div>
            </div>
            <div className="hero-photo relative z-10 h-[310px] overflow-hidden rounded-2xl sm:h-[380px]">
              {heroImages.map((img, idx) => (
                <img
                  key={idx}
                  className={`absolute h-full w-full object-cover transition-opacity duration-1000 ${
                    idx === heroSlide ? "opacity-100" : "opacity-0"
                  }`}
                  src={img}
                  alt={`Tech gadget ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-b border-border bg-card" aria-label="Shopping benefits">
          <div className="mx-auto grid max-w-page grid-cols-2 gap-x-4 gap-y-7 px-5 py-7 lg:grid-cols-4 lg:px-10">
            {[
              { Icon: Truck, title: "Free Shipping", copy: "On orders over $50" },
              { Icon: RotateCcw, title: "30-Day Returns", copy: "Easy returns & refunds" },
              { Icon: ShieldCheck, title: "Secure Payments", copy: "100% secure checkout" },
              { Icon: Headphones, title: "24/7 Support", copy: "We're here to help" },
            ].map(({ Icon, title, copy }) => (
              <div key={title} className="flex min-w-0 items-center gap-3 lg:justify-center">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft"><Icon className="size-[22px] text-primary" /></span>
                <div className="min-w-0"><h2 className="text-sm font-bold sm:text-[15px]">{title}</h2><p className="mt-0.5 text-xs text-muted-foreground sm:text-[13px]">{copy}</p></div>
              </div>
            ))}
          </div>
        </section>
        {/* Categories */}
        <section id="shop" className="scroll-mt-20 mx-auto grid max-w-page grid-cols-2 gap-3 px-5 py-10 sm:gap-5 sm:px-8 lg:grid-cols-4 lg:px-10 lg:py-[60px]">
          {categories.map((category) => (
            <article key={category.name} className="group relative h-44 overflow-hidden rounded-xl sm:h-[180px]">
              <img className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src={category.image} alt={category.name} />
              <div className="category-shade relative flex h-full flex-col justify-end p-4 text-brand-light sm:p-5">
                <h2 className="text-base font-bold sm:text-lg">{category.name}</h2>
                <button onClick={() => scrollTo("top-picks")} className="mt-1 flex items-center text-xs font-semibold text-brand-blue-soft sm:text-sm">
                  Shop Now <ChevronRight className="size-4" />
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Top Picks */}
        <section id="top-picks" className="scroll-mt-20 mx-auto max-w-page">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-8 lg:px-10">
            <h2 className="truncate text-2xl font-bold sm:text-[26px]">Top Picks</h2>
            <button onClick={() => scrollTo("top")} className="text-sm font-semibold text-primary hover:text-primary/80">View All <ChevronRight className="inline size-4" /></button>
          </div>
          <div className="no-scrollbar mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-12 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-8 lg:grid-cols-4 lg:gap-6 lg:px-10 lg:pb-[60px]">
            {products.map((product) => (
              <article key={product.id} className="group relative w-[72vw] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-2">
                {product.badge && <span className={`badge-${product.tone} absolute left-3 top-3 z-10 rounded-md px-2.5 py-1 text-[11px] font-bold text-badge-foreground`}>{product.badge}</span>}
                <div className="h-44 overflow-hidden bg-muted"><img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src={product.image} alt={product.name} /></div>
                <div className="p-4">
                  <h3 className="text-[15px] font-bold">{product.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{product.category}</p>
                  <p className="my-3 text-base font-bold text-foreground">
                    {product.price}
                    {product.oldPrice && <span className="ml-2 text-sm text-muted-foreground line-through">{product.oldPrice}</span>}
                  </p>
                  <Button className="w-full" size="sm" onClick={() => addToCart({ id: product.id, name: product.name, price: product.price })}>
                    Add to Cart
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Deals Section */}
        <section id="deals" className="scroll-mt-20 productivity-surface relative mx-5 mb-12 overflow-hidden rounded-2xl text-brand-light sm:mx-8 lg:mx-10 lg:mb-[60px]">
          <div className="grid gap-8 px-6 py-9 sm:px-10 lg:grid-cols-2 lg:items-center lg:px-[60px] lg:py-[60px]">
            <div className="relative z-10">
              <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-brand-blue-soft">Work Smart, Play Hard</p>
              <h2 className="mt-2 text-[30px] font-bold leading-[1.1] sm:text-4xl">Premium Gadgets, Unbeatable Prices</h2>
              <p className="mt-4 text-base leading-7 text-brand-muted">Level up your tech game with our exclusive collection of cutting-edge devices.</p>
              <Button className="mt-6">Shop Sale Items</Button>
            </div>
            <div className="h-[220px] overflow-hidden rounded-xl"><img className="h-full w-full object-cover" src="https://images.pexels.com/photos/5904064/pexels-photo-5904064.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800" alt="Deals" /></div>
          </div>
        </section>

        {/* New Arrivals */}
        <section id="new-arrivals" className="scroll-mt-20 mx-auto grid max-w-page gap-5 px-5 pb-12 sm:px-8 lg:grid-cols-2 lg:gap-6 lg:px-10 lg:pb-[60px]">
          {[
            ["New Arrivals", "Explore the latest tech essentials.", "Shop New", "https://images.pexels.com/photos/5207559/pexels-photo-5207559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
            ["Best Sellers", "Shop our most popular picks.", "Shop Bestsellers", "https://images.pexels.com/photos/14935011/pexels-photo-14935011.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
          ].map(([title, copy, action, image]) => (
            <article key={String(title)} className="relative h-[220px] overflow-hidden rounded-2xl">
              <img className="absolute inset-0 h-full w-full object-cover" src={image} alt={String(title)} />
              <div className="promo-shade relative flex h-full flex-col justify-end p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
                <button className="mt-4 w-fit text-sm font-semibold text-primary hover:text-primary/80">{action} →</button>
              </div>
            </article>
          ))}
        </section>

        {/* Newsletter */}
        <section id="brands" className="scroll-mt-20 bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-page flex-col items-center justify-center gap-6 px-5 py-10 text-center lg:flex-row lg:gap-10">
            <span className="grid size-[60px] shrink-0 place-items-center rounded-full bg-primary-foreground/20"><Mail className="size-7" /></span>
            <div className="lg:text-left">
              <h2 className="text-xl font-bold">Join Our Newsletter</h2>
              <p className="mt-1 text-sm text-primary-soft-foreground">Get the latest updates, offers & new arrivals.</p>
            </div>
            {subscribed ? (
              <div className="flex h-12 items-center gap-2 rounded-lg bg-primary-foreground px-5 font-semibold text-primary"><Check className="size-5" /> You're subscribed</div>
            ) : (
              <form onSubmit={submitNewsletter} className="flex w-full gap-2 sm:w-auto">
                <input type="email" placeholder="Your email" required className="rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm placeholder-primary-soft-foreground focus:outline-none" />
                <Button variant="secondary" type="submit">Subscribe</Button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="scroll-mt-20 bg-brand-dark px-5 pb-5 pt-12 text-brand-muted sm:px-8 lg:px-10 lg:pt-[60px]">
        <div className="mx-auto grid max-w-page gap-9 border-b border-footer-border pb-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.2fr] lg:gap-10">
          <div>
            <button onClick={() => scrollTo("top")} className="flex items-center gap-2.5 text-xl font-bold text-brand-light">
              <span className="grid size-8 place-items-center rounded-lg bg-primary"><Star className="size-5" fill="currentColor" /></span>
              GizmoHub
            </button>
          </div>
          {[
            ["Shop", ["All Products", "New Arrivals", "Top Deals", "Accessories", "Gift Cards"]],
            ["Customer Service", ["Shipping Info", "Returns & Refunds", "Track Your Order", "FAQs", "Contact Us"]],
            ["Company", ["About Us", "Our Blog", "Careers", "Privacy Policy", "Terms of Service"]],
          ].map(([title, items]) => (
            <div key={String(title)}>
              <h2 className="mb-4 text-[15px] font-bold text-brand-light">{String(title)}</h2>
              <ul className="space-y-2.5 text-sm">
                {(items as string[]).map((item) => (
                  <li key={item}><button className="transition-colors hover:text-brand-light">{item}</button></li>
                ))}
              </ul>
            </div>
          ))}
          <div id="blog">
            <h2 className="mb-4 text-[15px] font-bold text-brand-light">Download Our App</h2>
            <div className="space-y-2.5">
              {["App Store", "Google Play"].map((store) => (
                <button key={store} className="flex w-full items-center gap-2 rounded-lg border border-border bg-brand-dark px-3 py-2 text-sm transition-colors hover:bg-brand-surface">
                  {store}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="mx-auto max-w-page pt-5 text-center text-[13px] text-footer-copy">© 2026 GizmoHub. All Rights Reserved.</p>
      </footer>

      {/* Overlays */}
      {(mobileOpen || searchOpen || accountOpen || cartOpen || checkoutFormOpen) && (
        <button
          className="fixed inset-0 z-40 bg-overlay backdrop-blur-sm"
          aria-label="Close panel"
          onClick={() => {
            setMobileOpen(false);
            setSearchOpen(false);
            setAccountOpen(false);
            setCartOpen(false);
            setCheckoutFormOpen(false);
          }}
        />
      )}

      {/* Mobile Menu */}
      <aside
        className={`mobile-drawer fixed right-0 top-0 z-50 h-dvh w-[min(88vw,360px)] bg-card p-6 shadow-drawer transition-transform duration-300 ${mobileOpen ? "mobile-drawer-open" : ""}`}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between">
          <strong className="text-xl">Menu</strong>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">✕</Button>
        </div>
        <nav className="mt-8">
          <ul className="space-y-1">
            {navItems.map(([label, id]) => (
              <li key={id}>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    scrollTo(id);
                  }}
                  className="grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent"
                >
                  {label}
                  <ChevronRight className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <Button variant="ghost" className="mt-6 w-full justify-start" onClick={() => { setMobileOpen(false); setAccountOpen(true); }}>
          <CircleUserRound className="size-5" /> My account
        </Button>
      </aside>

      {/* Search Modal */}
      {searchOpen && (
        <div role="dialog" aria-modal="true" aria-label="Search products" className="fixed left-1/2 top-24 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-xl bg-card p-5 shadow-drawer">
          <input
            type="text"
            placeholder="Search products..."
            autoFocus
            className="w-full border border-border rounded-lg bg-background px-4 py-2.5 text-sm focus:outline-none"
          />
        </div>
      )}

      {/* Account Modal */}
      {accountOpen && (
        <div role="dialog" aria-modal="true" aria-label="Account" className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-6 shadow-drawer">
          <h2 className="text-lg font-bold">My Account</h2>
          <div className="mt-4 space-y-2">
            <Button variant="outline" className="w-full">Sign In</Button>
            <Button variant="outline" className="w-full">Create Account</Button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <aside
        className={`mobile-drawer fixed right-0 top-0 z-50 h-dvh w-[min(92vw,400px)] bg-card p-6 shadow-drawer transition-transform duration-300 ${cartOpen ? "mobile-drawer-open" : ""}`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Your cart</h2>
            <p className="text-sm text-muted-foreground">{cart.length} {cart.length === 1 ? "item" : "items"}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)} aria-label="Close cart">✕</Button>
        </div>
        <div className="mt-6 space-y-3 max-h-[calc(100dvh-280px)] overflow-y-auto">
          {cart.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.price} x {item.quantity}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          {cart.length > 0 && (
            <div className="rounded-lg bg-primary-soft p-3">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-primary">${calculateTotal().toFixed(2)}</p>
            </div>
          )}
          <Button
            className="w-full"
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </div>
      </aside>

      {/* Checkout Modal */}
      {checkoutFormOpen && (
        <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-6 shadow-drawer max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Checkout</h2>
          <form onSubmit={handleSubmitCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome Completo</label>
              <input
                type="text"
                required
                value={customerData.name}
                onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                className="w-full border border-border rounded-lg bg-background px-4 py-2.5 text-sm focus:outline-none"
                placeholder="João Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Endereço de Entrega</label>
              <textarea
                required
                value={customerData.address}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                className="w-full border border-border rounded-lg bg-background px-4 py-2.5 text-sm focus:outline-none"
                placeholder="Rua, número, complemento, cidade, estado"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Forma de Pagamento</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="pix"
                    checked={customerData.paymentMethod === "pix"}
                    onChange={() => setCustomerData({ ...customerData, paymentMethod: "pix" })}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">PIX</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cartao"
                    checked={customerData.paymentMethod === "cartao"}
                    onChange={() => setCustomerData({ ...customerData, paymentMethod: "cartao" })}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Cartão de Crédito</span>
                </label>
              </div>
            </div>
            <div className="rounded-lg bg-primary-soft p-3">
              <p className="text-xs text-muted-foreground">Total do Pedido</p>
              <p className="text-2xl font-bold text-primary">${calculateTotal().toFixed(2)}</p>
            </div>
            <Button type="submit" className="w-full">
              Enviar para WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setCheckoutFormOpen(false)}
            >
              Cancelar
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default GizmoHub;
                  

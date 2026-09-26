import { ArrowRight, Mail, MessageCircle, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { sized, type StoreData } from "@/lib/store";
import { Brand } from "./Brand";

/* ------------------------------- promo blocks ------------------------------- */

interface DealsBannerProps {
  settings: StoreData["settings"];
  onShopDeals: () => void;
}

export function DealsBanner({ settings, onShopDeals }: DealsBannerProps) {
  return (
    <section
      id="deals"
      className="productivity-surface relative mx-5 scroll-mt-20 overflow-hidden rounded-2xl text-brand-light sm:mx-8 lg:mx-10 lg:mt-4"
    >
      <div className="grid gap-8 px-6 py-9 sm:px-10 lg:grid-cols-2 lg:items-center lg:px-[60px] lg:py-[60px]">
        <div className="relative z-10">
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-brand-blue-soft">
            Work Smart, Play Hard
          </p>
          <h2 className="mt-2 text-[30px] font-bold leading-[1.1] sm:text-4xl">
            Premium Gadgets, Unbeatable Prices
          </h2>
          <p className="mt-4 text-base leading-7 text-brand-muted">
            Level up your tech game with our exclusive collection of cutting-edge devices.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={onShopDeals}>Shop Sale Items</Button>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-brand-light/40 px-7 text-sm font-semibold text-brand-light transition-colors hover:bg-brand-light/10"
            >
              <MessageCircle className="size-4" /> Talk to an expert
            </a>
          </div>
        </div>
        <div className="h-[220px] overflow-hidden rounded-xl">
          <img
            className="h-full w-full object-cover"
            src={sized(
              "https://images.pexels.com/photos/5904064/pexels-photo-5904064.jpeg",
              900,
              560,
            )}
            alt="Deals"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

interface PromoCardsProps {
  onFilter: (filter: "new" | "bestsellers") => void;
}

export function PromoCards({ onFilter }: PromoCardsProps) {
  const cards = [
    {
      key: "new" as const,
      title: "New Arrivals",
      copy: "Explore the latest tech essentials.",
      action: "Shop New",
      image: "https://images.pexels.com/photos/5207559/pexels-photo-5207559.jpeg",
    },
    {
      key: "bestsellers" as const,
      title: "Best Sellers",
      copy: "Shop our most popular picks.",
      action: "Shop Bestsellers",
      image: "https://images.pexels.com/photos/14935011/pexels-photo-14935011.jpeg",
    },
  ];

  return (
    <section
      id="new-arrivals"
      className="mx-auto grid max-w-page scroll-mt-20 gap-5 px-5 pb-12 sm:px-8 lg:grid-cols-2 lg:gap-6 lg:px-10 lg:pb-[60px]"
    >
      {cards.map((card) => (
        <article key={card.key} className="relative h-[220px] overflow-hidden rounded-2xl">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={sized(card.image, 1200, 640)}
            alt={card.title}
            loading="lazy"
          />
          <div className="promo-shade relative flex h-full flex-col justify-end p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground">{card.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{card.copy}</p>
            <button
              onClick={() => onFilter(card.key)}
              className="mt-4 w-fit text-sm font-semibold text-primary hover:text-primary/80"
            >
              {card.action} →
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

/* ---------------------------------- brands --------------------------------- */

export function BrandsStrip({ names }: { names: string[] }) {
  return (
    <section id="brands" className="scroll-mt-20 border-y border-border bg-card py-8">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Brands we carry
        </p>
        <div className="mt-5 grid grid-cols-3 gap-y-5 sm:grid-cols-6">
          {names.map((name) => (
            <div key={name} className="grid place-items-center">
              <span className="text-base font-extrabold tracking-tight text-foreground/70 grayscale transition-colors hover:text-primary hover:grayscale-0 sm:text-lg">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- blog ---------------------------------- */

const posts = [
  {
    title: "10 gadgets that will actually upgrade your 2026",
    excerpt: "Our editors picked the devices worth your money this year — no fluff.",
    image: "https://images.pexels.com/photos/25450654/pexels-photo-25450654.jpeg",
    date: "Sep 12, 2026",
    tag: "Guides",
  },
  {
    title: "How to choose your first camera drone",
    excerpt: "Flight time, gimbal, range: what really matters before you buy.",
    image: "https://images.pexels.com/photos/5014710/pexels-photo-5014710.jpeg",
    date: "Aug 28, 2026",
    tag: "Drones",
  },
  {
    title: "Earbuds or over-ear headphones?",
    excerpt: "Comfort, battery and sound quality compared for every kind of listener.",
    image: "https://images.pexels.com/photos/18542243/pexels-photo-18542243.jpeg",
    date: "Aug 05, 2026",
    tag: "Audio",
  },
];

export function BlogSection() {
  return (
    <section
      id="blog"
      className="mx-auto max-w-page scroll-mt-20 px-5 py-12 sm:px-8 lg:px-10 lg:py-[60px]"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-primary">
            From the blog
          </p>
          <h2 className="mt-1 text-2xl font-bold sm:text-[26px]">Guides, reviews & tech tips</h2>
        </div>
        <span className="text-sm font-semibold text-primary">Read all articles →</span>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.title}
            className="group overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-1.5 hover:shadow-card"
          >
            <div className="h-44 overflow-hidden">
              <img
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={sized(post.image, 800, 500)}
                alt={post.title}
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {post.tag}
              </span>
              <h3 className="mt-2 text-base font-bold leading-snug">{post.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              <p className="mt-3 text-xs text-muted-foreground">{post.date}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- newsletter ------------------------------- */

export function Newsletter({ storeName }: { storeName: string }) {
  const [subscribed, setSubscribed] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return (
    <section id="newsletter" className="scroll-mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-page flex-col items-center justify-center gap-6 px-5 py-10 text-center lg:flex-row lg:gap-10">
        <span className="grid size-[60px] shrink-0 place-items-center rounded-full bg-primary-foreground/20">
          <Mail className="size-7" />
        </span>
        <div className="lg:text-left">
          <h2 className="text-xl font-bold">Join Our Newsletter</h2>
          <p className="mt-1 text-sm text-primary-soft-foreground">
            Get the latest updates, offers &amp; new arrivals from {storeName}.
          </p>
        </div>
        {subscribed ? (
          <div className="flex h-12 items-center gap-2 rounded-lg bg-primary-foreground px-5 font-semibold text-primary">
            ✓ You&apos;re subscribed
          </div>
        ) : (
          <form onSubmit={submit} className="flex w-full gap-2 sm:w-auto">
            <input
              type="email"
              placeholder="Your email"
              required
              className="min-w-0 flex-1 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm placeholder-primary-soft-foreground focus:outline-none sm:w-72"
            />
            <Button variant="secondary" type="submit">
              Subscribe <Send className="size-4" />
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------- footer --------------------------------- */

const footerColumns = [
  ["Shop", ["All Products", "New Arrivals", "Top Deals", "Accessories", "Gift Cards"]],
  [
    "Customer Service",
    ["Shipping Info", "Returns & Refunds", "Track Your Order", "FAQs", "Contact Us"],
  ],
  ["Company", ["About Us", "Our Blog", "Careers", "Privacy Policy", "Terms of Service"]],
];

export function Footer({
  store,
  onNavigate,
}: {
  store: StoreData;
  onNavigate: (id: string) => void;
}) {
  const { settings } = store;
  return (
    <footer
      id="contact"
      className="scroll-mt-20 bg-brand-dark px-5 pb-5 pt-12 text-brand-muted sm:px-8 lg:px-10 lg:pt-[60px]"
    >
      <div className="mx-auto grid max-w-page gap-9 border-b border-footer-border pb-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.2fr] lg:gap-10">
        <div>
          <Brand name={settings.storeName} onClick={() => onNavigate("top")} />
          <p className="mt-4 max-w-xs text-sm leading-6">
            Premium tech gadgets and accessories, hand-picked for performance, design and value.
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-brand-light"
            >
              <MessageCircle className="size-4" /> +{settings.whatsappNumber}
            </a>
            <a
              href={`mailto:${settings.supportEmail}`}
              className="flex items-center gap-2 transition-colors hover:text-brand-light"
            >
              <Mail className="size-4" /> {settings.supportEmail}
            </a>
          </div>
        </div>

        {footerColumns.map(([title, items]) => (
          <div key={String(title)}>
            <h2 className="mb-4 text-[15px] font-bold text-brand-light">{String(title)}</h2>
            <ul className="space-y-2.5 text-sm">
              {(items as string[]).map((item) => (
                <li key={item}>
                  <button
                    onClick={() => onNavigate("catalog")}
                    className="transition-colors hover:text-brand-light"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="mb-4 text-[15px] font-bold text-brand-light">Download Our App</h2>
          <div className="space-y-2.5">
            {["App Store", "Google Play"].map((storeName) => (
              <button
                key={storeName}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-brand-dark px-3 py-2 text-sm transition-colors hover:bg-brand-surface"
              >
                {storeName}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-border p-3">
            <p className="text-xs">
              Orders are confirmed on WhatsApp — we answer every day from 9am to 8pm.
            </p>
            <Link
              to="/admin"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue-soft hover:text-brand-light"
            >
              Store admin <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
      <p className="mx-auto max-w-page pt-5 text-center text-[13px] text-footer-copy">
        © 2026 {settings.storeName}. All Rights Reserved.
      </p>
    </footer>
  );
}

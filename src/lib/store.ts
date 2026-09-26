/**
 * GizmoHub storefront data layer.
 *
 * Everything the storefront renders (hero slides, collections, products,
 * benefits and settings) lives in a single `StoreData` object persisted to
 * localStorage. The storefront and the admin panel both read/write through the
 * same tiny external store, so edits made in /admin show up instantly and
 * survive a page reload.
 *
 * The defaults below always keep the original GizmoHub content (same names,
 * prices, badges and images) and simply add more priced products on top of it.
 */
import { useSyncExternalStore } from "react";

export type BadgeTone = "new" | "sale" | "best";
export type Badge = "NEW" | "SALE" | "BESTSELLER";
export type PaymentMethod = "pix" | "cartao";

export interface Product {
  id: number;
  name: string;
  /** Short label shown under the product name, e.g. "Smartwatch". */
  category: string;
  /** Collection (category column) this product belongs to. */
  collection: string;
  price: number;
  oldPrice?: number | undefined;
  badge?: Badge | undefined;
  tone?: BadgeTone | undefined;
  image: string;
  gallery: string[];
  description: string;
  rating: number;
  reviews: number;
  stock: number;
  featured: boolean;
  active: boolean;
}

export interface Collection {
  id: string;
  name: string;
  image: string;
  tagline: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaTarget: string;
}

export interface Benefit {
  id: string;
  icon: string;
  title: string;
  copy: string;
}

export interface StoreSettings {
  storeName: string;
  /** Full international WhatsApp number, digits only (55 + DDD + number). */
  whatsappNumber: string;
  announcement: string;
  showAnnouncement: boolean;
  freeShippingFrom: number;
  heroAutoplayMs: number;
  /** Products per row on large screens (2 columns are always used on mobile). */
  productColumns: number;
  /** Collections per row on large screens. */
  collectionColumns: number;
  pixDiscountPercent: number;
  maxInstallments: number;
  supportEmail: string;
}

export interface StoreData {
  version: number;
  settings: StoreSettings;
  heroSlides: HeroSlide[];
  benefits: Benefit[];
  collections: Collection[];
  products: Product[];
}

const STORAGE_KEY = "gizmoHubStore.v1";
const LEGACY_STORAGE_KEY = "gizmoHubData";
export const STORE_VERSION = 1;

const P = (id: string, w = 900, h = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const PEX = (id: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

/** Rewrites Pexels URLs with the size we need; other URLs are returned as-is. */
export function sized(url: string, w: number, h: number): string {
  if (!url) return url;
  if (!url.includes("images.pexels.com")) return url;
  const base = url.split("?")[0];
  return `${base}?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;
}

const ORIGINAL_HERO_1 = "https://images.pexels.com/photos/32912307/pexels-photo-32912307.jpeg";
const ORIGINAL_HERO_2 = "https://images.pexels.com/photos/3962316/pexels-photo-3962316.jpeg";
const ORIGINAL_HERO_3 = "https://images.pexels.com/photos/4481154/pexels-photo-4481154.jpeg";

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    image: ORIGINAL_HERO_1,
    eyebrow: "Upgrade Your Life",
    title: "Smart Tech.\nBetter Everyday.",
    subtitle: "Discover innovative gadgets and accessories built for performance and style.",
    ctaLabel: "Explore Now",
    ctaTarget: "catalog",
  },
  {
    id: "hero-2",
    image: ORIGINAL_HERO_2,
    eyebrow: "New Season 2026",
    title: "Sound That\nMoves With You.",
    subtitle: "Wireless earbuds, headphones and speakers tuned for pure, immersive audio.",
    ctaLabel: "Shop Audio",
    ctaTarget: "catalog",
  },
  {
    id: "hero-3",
    image: ORIGINAL_HERO_3,
    eyebrow: "Power Up",
    title: "Charge Fast.\nGo Further.",
    subtitle: "Power banks, wireless chargers and stations that keep every device alive.",
    ctaLabel: "Shop Power",
    ctaTarget: "catalog",
  },
  {
    id: "hero-4",
    image: PEX("11398246"),
    eyebrow: "Studio Sound",
    title: "Hear Every\nSingle Detail.",
    subtitle: "Over-ear headphones with adaptive noise cancelling and 40h of battery life.",
    ctaLabel: "Shop Headphones",
    ctaTarget: "catalog",
  },
  {
    id: "hero-5",
    image: PEX("31018745"),
    eyebrow: "Built To Win",
    title: "Level Up\nYour Setup.",
    subtitle: "RGB gear, mechanical keyboards and precision mice for serious players.",
    ctaLabel: "Shop Gaming",
    ctaTarget: "catalog",
  },
];

export const defaultBenefits: Benefit[] = [
  { id: "b1", icon: "truck", title: "Free Shipping", copy: "On orders over $50" },
  { id: "b2", icon: "returns", title: "30-Day Returns", copy: "Easy returns & refunds" },
  { id: "b3", icon: "shield", title: "Secure Payments", copy: "100% secure checkout" },
  { id: "b4", icon: "support", title: "24/7 Support", copy: "We're here to help" },
];

/** The four original GizmoHub collections, kept exactly as they shipped. */
export const defaultCollections: Collection[] = [
  {
    id: "audio",
    name: "Audio Devices",
    image: PEX("3756985"),
    tagline: "Earbuds, speakers & headphones",
  },
  {
    id: "smart-watches",
    name: "Smart Watches",
    image: PEX("31541678"),
    tagline: "Track every move",
  },
  {
    id: "power",
    name: "Power Solutions",
    image: PEX("4765366"),
    tagline: "Chargers & power banks",
  },
  {
    id: "drones-cameras",
    name: "Drones & Cameras",
    image: PEX("8821970"),
    tagline: "Capture from above",
  },
  {
    id: "gaming",
    name: "Gaming Gear",
    image: PEX("7862493"),
    tagline: "Mice, keyboards & headsets",
  },
];

interface SeedProduct {
  id: number;
  name: string;
  category: string;
  collection: string;
  price: number;
  oldPrice?: number;
  badge?: Badge;
  image: string;
  gallery?: string[];
  description: string;
  rating: number;
  reviews: number;
  stock: number;
  featured?: boolean;
}

const seed: SeedProduct[] = [
  /* ---------------- Smart Watches ---------------- */
  {
    id: 2,
    name: "Active Watch 2",
    category: "Smartwatch",
    collection: "smart-watches",
    price: 149.99,
    badge: "BESTSELLER",
    image: PEX("12564670"),
    gallery: [PEX("31541678"), PEX("5081914")],
    description:
      '1.85" AMOLED display, 24/7 heart-rate and SpO2 monitoring, 110+ sport modes and up to 14 days of battery life.',
    rating: 4.8,
    reviews: 1842,
    stock: 24,
    featured: true,
  },
  {
    id: 5,
    name: "Pulse Watch S3",
    category: "Smartwatch",
    collection: "smart-watches",
    price: 129.99,
    oldPrice: 169.99,
    badge: "SALE",
    image: PEX("11700618"),
    gallery: [PEX("5081914"), PEX("437038")],
    description:
      "Minimalist smartwatch with always-on display, built-in GPS, sleep tracking and a lightweight aluminium body.",
    rating: 4.6,
    reviews: 963,
    stock: 18,
  },
  {
    id: 6,
    name: "Zenith Band 5",
    category: "Fitness Band",
    collection: "smart-watches",
    price: 59.99,
    badge: "NEW",
    image: PEX("5081914"),
    gallery: [PEX("51011"), PEX("8217430")],
    description:
      "Ultra-light fitness band with 5ATM water resistance, stress monitoring and 21 days of standby battery.",
    rating: 4.4,
    reviews: 421,
    stock: 40,
  },
  {
    id: 7,
    name: "Aero Watch Ultra",
    category: "Smartwatch",
    collection: "smart-watches",
    price: 219.99,
    image: PEX("8217430"),
    gallery: [PEX("437038"), PEX("18662969")],
    description:
      "Titanium smartwatch with dual-band GPS, offline maps, sapphire glass and a bright 2000-nit display.",
    rating: 4.9,
    reviews: 512,
    stock: 9,
  },
  {
    id: 8,
    name: "Nova Fit Pro",
    category: "Fitness Band",
    collection: "smart-watches",
    price: 89.99,
    oldPrice: 119.99,
    badge: "SALE",
    image: PEX("18662969"),
    gallery: [PEX("51011"), PEX("5081914")],
    description:
      "Curved AMOLED band with 150+ watch faces, VO2 max insights and fast magnetic charging.",
    rating: 4.5,
    reviews: 733,
    stock: 31,
  },
  {
    id: 9,
    name: "Classic Steel S2",
    category: "Smartwatch",
    collection: "smart-watches",
    price: 179.99,
    image: PEX("437038"),
    gallery: [PEX("8217430"), PEX("11700618")],
    description:
      "Stainless-steel smartwatch with a rotating crown, leather strap and 10-day battery for everyday elegance.",
    rating: 4.7,
    reviews: 288,
    stock: 15,
  },
  {
    id: 10,
    name: "Nova Fit Lite",
    category: "Fitness Band",
    collection: "smart-watches",
    price: 45.99,
    image: PEX("51011"),
    gallery: [PEX("5081914"), PEX("18662969")],
    description:
      "Essential activity tracker with step, calorie and sleep tracking plus 14 days of battery for under $50.",
    rating: 4.2,
    reviews: 156,
    stock: 52,
  },

  /* ---------------- Audio Devices ---------------- */
  {
    id: 1,
    name: "SoundPro X1",
    category: "Wireless Earbuds",
    collection: "audio",
    price: 79.99,
    badge: "NEW",
    image: PEX("9528219"),
    gallery: [PEX("3921827"), PEX("33797659")],
    description:
      "Hybrid ANC earbuds with 42h total playtime, transparency mode and a pocket-friendly wireless charging case.",
    rating: 4.8,
    reviews: 2310,
    stock: 36,
    featured: true,
  },
  {
    id: 11,
    name: "AirBuds Mini 2",
    category: "Wireless Earbuds",
    collection: "audio",
    price: 49.99,
    oldPrice: 69.99,
    badge: "SALE",
    image: PEX("3921827"),
    gallery: [PEX("33797659"), PEX("35599938")],
    description:
      "Feather-light earbuds with punchy bass, IPX5 sweat resistance and 28 hours of playback with the case.",
    rating: 4.5,
    reviews: 1204,
    stock: 44,
  },
  {
    id: 12,
    name: "BassBuds Pro",
    category: "Wireless Earbuds",
    collection: "audio",
    price: 99.99,
    badge: "BESTSELLER",
    image: PEX("33797659"),
    gallery: [PEX("35599938"), PEX("9528219")],
    description:
      "Studio-tuned 12mm drivers, LDAC hi-res audio, multipoint pairing and 36h of battery with ANC off.",
    rating: 4.9,
    reviews: 3087,
    stock: 21,
  },
  {
    id: 3,
    name: "BoomMate",
    category: "Portable Speaker",
    collection: "audio",
    price: 89.99,
    oldPrice: 119.99,
    badge: "SALE",
    image: PEX("29581125"),
    gallery: [PEX("4917455"), PEX("9072408")],
    description:
      "360° portable speaker with deep bass, IP67 waterproof shell and 20 hours of non-stop music.",
    rating: 4.7,
    reviews: 1421,
    stock: 27,
    featured: true,
  },
  {
    id: 13,
    name: "BoomMate XL",
    category: "Portable Speaker",
    collection: "audio",
    price: 139.99,
    image: PEX("4917455"),
    gallery: [PEX("13465232"), PEX("9072408")],
    description:
      "Room-filling 60W speaker with dual passive radiators, party light sync and a 24-hour battery.",
    rating: 4.6,
    reviews: 688,
    stock: 12,
  },
  {
    id: 14,
    name: "Wave Outdoor",
    category: "Portable Speaker",
    collection: "audio",
    price: 74.99,
    oldPrice: 94.99,
    badge: "SALE",
    image: PEX("13465232"),
    gallery: [PEX("9072408"), PEX("29581125")],
    description:
      "Rugged travel speaker with a carabiner strap, dust-proof grille and 16 hours of playtime anywhere.",
    rating: 4.4,
    reviews: 342,
    stock: 33,
  },
  {
    id: 15,
    name: "StudioSound ANC",
    category: "Over-Ear Headphones",
    collection: "audio",
    price: 199.99,
    badge: "NEW",
    image: PEX("210927"),
    gallery: [PEX("7772548"), PEX("11398246")],
    description:
      "Adaptive noise cancelling over-ear headphones with 40h battery, memory-foam pads and hi-res LDAC audio.",
    rating: 4.9,
    reviews: 874,
    stock: 17,
    featured: true,
  },
  {
    id: 16,
    name: "Wave Headphones",
    category: "Over-Ear Headphones",
    collection: "audio",
    price: 129.99,
    oldPrice: 159.99,
    badge: "SALE",
    image: PEX("7054718"),
    gallery: [PEX("210927"), PEX("7772548")],
    description:
      "Foldable wireless headphones with 45mm drivers, crisp mids, deep bass and 30 hours of listening.",
    rating: 4.5,
    reviews: 519,
    stock: 29,
  },

  /* ---------------- Power Solutions ---------------- */
  {
    id: 17,
    name: "PowerCore 20K",
    category: "Power Bank",
    collection: "power",
    price: 49.99,
    badge: "BESTSELLER",
    image: PEX("6296911"),
    gallery: [PEX("10104318"), PEX("3921704")],
    description:
      "20 000mAh power bank with 22.5W fast charging, three outputs and a clear digital battery display.",
    rating: 4.8,
    reviews: 2760,
    stock: 48,
  },
  {
    id: 18,
    name: "SolarCharge 30K",
    category: "Power Bank",
    collection: "power",
    price: 79.99,
    oldPrice: 99.99,
    badge: "SALE",
    image: PEX("518530"),
    gallery: [PEX("6296911"), PEX("8137313")],
    description:
      "30 000mAh rugged power bank with solar top-up, dual USB-C ports and a built-in camping flashlight.",
    rating: 4.4,
    reviews: 611,
    stock: 22,
  },
  {
    id: 19,
    name: "SlimPack 10K",
    category: "Power Bank",
    collection: "power",
    price: 34.99,
    badge: "NEW",
    image: PEX("10104281"),
    gallery: [PEX("34338614"), PEX("10104318")],
    description:
      "Pocket-sized 10 000mAh battery with 20W PD output — charges a phone twice and fits in any bag.",
    rating: 4.6,
    reviews: 934,
    stock: 60,
  },
  {
    id: 20,
    name: "ChargePad 3in1",
    category: "Wireless Charger",
    collection: "power",
    price: 59.99,
    image: PEX("5961044"),
    gallery: [PEX("5948344"), PEX("7742585")],
    description:
      "3-in-1 magnetic wireless charging station for phone, earbuds and watch with a single cable.",
    rating: 4.7,
    reviews: 486,
    stock: 19,
  },
  {
    id: 21,
    name: "QuickCharge 65W",
    category: "Wall Charger",
    collection: "power",
    price: 39.99,
    badge: "BESTSELLER",
    image: PEX("5948344"),
    gallery: [PEX("5961044"), PEX("7742585")],
    description:
      "GaN 65W charger with three ports — powers a laptop, a tablet and a phone at the same time.",
    rating: 4.8,
    reviews: 1590,
    stock: 41,
  },
  {
    id: 22,
    name: "PowerStation 300W",
    category: "Portable Station",
    collection: "power",
    price: 249.99,
    image: PEX("3921704"),
    gallery: [PEX("6296911"), PEX("518530")],
    description:
      "Portable power station with a 300W pure sine inverter, AC outlet and USB-C PD for trips and blackouts.",
    rating: 4.6,
    reviews: 214,
    stock: 8,
  },
  {
    id: 23,
    name: "MagSafe Dash Mount",
    category: "Car Charger",
    collection: "power",
    price: 44.99,
    oldPrice: 59.99,
    badge: "SALE",
    image: PEX("7742585"),
    gallery: [PEX("5961044"), PEX("5948344")],
    description:
      "Magnetic 15W car charger with vent + dashboard mount and 360° rotation for safe hands-free driving.",
    rating: 4.3,
    reviews: 297,
    stock: 25,
  },

  /* ---------------- Drones & Cameras ---------------- */
  {
    id: 24,
    name: "SkyView Drone X",
    category: "Camera Drone",
    collection: "drones-cameras",
    price: 399.99,
    badge: "NEW",
    image: PEX("1336211"),
    gallery: [PEX("3722737"), PEX("14484029")],
    description:
      "Foldable 4K drone with a 3-axis gimbal, 40-minute flight time, GPS return-home and 10km transmission.",
    rating: 4.9,
    reviews: 356,
    stock: 11,
    featured: true,
  },
  {
    id: 25,
    name: "Falcon Mini Drone",
    category: "Camera Drone",
    collection: "drones-cameras",
    price: 189.99,
    oldPrice: 249.99,
    badge: "SALE",
    image: PEX("14484029"),
    gallery: [PEX("1336211"), PEX("8821970")],
    description:
      "Under-250g mini drone with 2.7K video, gesture shots, one-tap takeoff and 31 minutes of flight.",
    rating: 4.6,
    reviews: 742,
    stock: 23,
  },
  {
    id: 26,
    name: "ActionCam 4K",
    category: "Action Camera",
    collection: "drones-cameras",
    price: 229.99,
    badge: "BESTSELLER",
    image: PEX("92723"),
    gallery: [PEX("92722"), PEX("11031052")],
    description:
      "Waterproof action camera with 4K60 video, hyper-smooth stabilisation, 40m case and voice control.",
    rating: 4.8,
    reviews: 1883,
    stock: 16,
  },
  {
    id: 27,
    name: "ActionCam Go",
    category: "Action Camera",
    collection: "drones-cameras",
    price: 149.99,
    oldPrice: 189.99,
    badge: "SALE",
    image: PEX("11031052"),
    gallery: [PEX("4817132"), PEX("794619")],
    description:
      "Compact 2.7K action camera with a front touch screen, image stabilisation and a full mounting kit.",
    rating: 4.4,
    reviews: 508,
    stock: 34,
  },
  {
    id: 28,
    name: "Horizon Cam Pro",
    category: "Action Camera",
    collection: "drones-cameras",
    price: 299.99,
    badge: "NEW",
    image: PEX("4817132"),
    gallery: [PEX("92722"), PEX("794619")],
    description:
      "360° action camera with 5.7K video, horizon levelling, slow motion and live streaming built in.",
    rating: 4.7,
    reviews: 231,
    stock: 10,
  },
  {
    id: 29,
    name: "TrailCam Lens Kit",
    category: "Camera Accessory",
    collection: "drones-cameras",
    price: 79.99,
    image: PEX("794619"),
    gallery: [PEX("92723"), PEX("4817132")],
    description:
      "Three-lens accessory kit with macro, wide-angle and ND filters for every action camera mount.",
    rating: 4.3,
    reviews: 189,
    stock: 45,
  },

  /* ---------------- Gaming Gear ---------------- */
  {
    id: 4,
    name: "GameMax Pro",
    category: "Gaming Mouse",
    collection: "gaming",
    price: 39.99,
    oldPrice: 59.99,
    image: PEX("12877898"),
    gallery: [PEX("2115256"), PEX("7915503")],
    description:
      "26 000 DPI optical sensor, 8 programmable buttons, 70-hour battery and a feather-light 63g shell.",
    rating: 4.7,
    reviews: 2044,
    stock: 38,
    featured: true,
  },
  {
    id: 30,
    name: "StrikeMouse RGB",
    category: "Gaming Mouse",
    collection: "gaming",
    price: 59.99,
    badge: "NEW",
    image: PEX("2115256"),
    gallery: [PEX("34704932"), PEX("7915503")],
    description:
      "Wireless gaming mouse with 1ms response, 100-hour battery, RGB lighting and hot-swappable switches.",
    rating: 4.8,
    reviews: 617,
    stock: 20,
  },
  {
    id: 31,
    name: "MechaKey TKL",
    category: "Mechanical Keyboard",
    collection: "gaming",
    price: 119.99,
    badge: "BESTSELLER",
    image: PEX("9020272"),
    gallery: [PEX("31018745"), PEX("28993064")],
    description:
      "Tenkeyless hot-swap mechanical keyboard with per-key RGB, PBT keycaps and tri-mode connectivity.",
    rating: 4.9,
    reviews: 1122,
    stock: 14,
  },
  {
    id: 32,
    name: "GameVoice Headset",
    category: "Gaming Headset",
    collection: "gaming",
    price: 109.99,
    oldPrice: 139.99,
    badge: "SALE",
    image: PEX("11398246"),
    gallery: [PEX("28993064"), PEX("210927")],
    description:
      "Surround-sound gaming headset with a detachable noise-cancelling mic, memory foam and RGB accents.",
    rating: 4.6,
    reviews: 803,
    stock: 26,
  },
  {
    id: 33,
    name: "BattleStation Bundle",
    category: "Gaming Bundle",
    collection: "gaming",
    price: 299.99,
    image: PEX("31018745"),
    gallery: [PEX("28993064"), PEX("9020272")],
    description:
      "Complete RGB battle station: mechanical keyboard, precision mouse, headset and an XL mouse pad.",
    rating: 4.7,
    reviews: 176,
    stock: 7,
  },
  {
    id: 34,
    name: "Precision Pad XL",
    category: "Gaming Accessory",
    collection: "gaming",
    price: 29.99,
    image: PEX("7915503"),
    gallery: [PEX("12877898"), PEX("34704932")],
    description:
      "Extra-large desk mat with a micro-textured cloth surface, anti-slip base and stitched RGB edge.",
    rating: 4.5,
    reviews: 431,
    stock: 55,
  },
];

export const defaultProducts: Product[] = seed.map((item) => ({
  ...item,
  tone:
    item.badge === "NEW"
      ? "new"
      : item.badge === "SALE"
        ? "sale"
        : item.badge === "BESTSELLER"
          ? "best"
          : undefined,
  gallery: item.gallery ?? [item.image],
  featured: item.featured ?? false,
  active: true,
}));

export const defaultSettings: StoreSettings = {
  storeName: "GizmoHub",
  whatsappNumber: "5511977888609",
  announcement: "✨ Free shipping on orders over $50 — plus 5% off when you pay with Pix",
  showAnnouncement: true,
  freeShippingFrom: 50,
  heroAutoplayMs: 5000,
  productColumns: 4,
  collectionColumns: 5,
  pixDiscountPercent: 5,
  maxInstallments: 6,
  supportEmail: "hello@gizmohub.store",
};

export const defaultStoreData: StoreData = {
  version: STORE_VERSION,
  settings: defaultSettings,
  heroSlides: defaultHeroSlides,
  benefits: defaultBenefits,
  collections: defaultCollections,
  products: defaultProducts,
};

/* ----------------------------- formatting helpers ---------------------------- */

export function parsePrice(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const cleaned = value.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatPrice(value: number, currency = "$"): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${currency}${safe.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function discountPercent(product: Product): number {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

/* -------------------------------- normalizing -------------------------------- */

const legacyCollectionHints: Array<[RegExp, string]> = [
  [/watch|band|fit/i, "smart-watches"],
  [/earbud|audio|speaker|headphone|headset|sound/i, "audio"],
  [/power|charg|bank|battery|cable/i, "power"],
  [/drone|camera|gopro|video/i, "drones-cameras"],
  [/game|mouse|keyboard|pad/i, "gaming"],
];

function guessCollection(category: string, fallback = "audio"): string {
  for (const [pattern, id] of legacyCollectionHints) {
    if (pattern.test(category)) return id;
  }
  return fallback;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\r?\n|,/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeProduct(raw: unknown, index: number): Product | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const rawName = item["name"];
  const rawCategory = item["category"];
  const rawImage = item["image"];
  const rawCollection = item["collection"];
  const rawBadge = item["badge"];
  const rawTone = item["tone"];
  const rawId = item["id"];
  const rawRating = item["rating"];
  const rawReviews = item["reviews"];
  const rawStock = item["stock"];
  const rawDescription = item["description"];

  const name = typeof rawName === "string" && rawName.trim() ? rawName : `Product ${index + 1}`;
  const category = typeof rawCategory === "string" && rawCategory.trim() ? rawCategory : "Gadget";
  const image = typeof rawImage === "string" && rawImage.trim() ? rawImage : "";
  const price = parsePrice(item["price"]);
  const oldPriceRaw = parsePrice(item["oldPrice"]);
  const badge: Badge | undefined =
    rawBadge === "NEW" || rawBadge === "SALE" || rawBadge === "BESTSELLER"
      ? (rawBadge as Badge)
      : undefined;
  const tone: BadgeTone | undefined =
    rawTone === "new" || rawTone === "sale" || rawTone === "best"
      ? (rawTone as BadgeTone)
      : badge === "NEW"
        ? "new"
        : badge === "SALE"
          ? "sale"
          : badge === "BESTSELLER"
            ? "best"
            : undefined;

  const gallery = asStringArray(item["gallery"]);
  const id = typeof rawId === "number" && Number.isFinite(rawId) ? rawId : Date.now() + index;
  const fallbackImage = P(DEFAULT_PLACEHOLDER_ID);

  return {
    id,
    name,
    category,
    collection:
      typeof rawCollection === "string" && rawCollection.trim()
        ? rawCollection
        : guessCollection(category),
    price,
    oldPrice: oldPriceRaw > price ? oldPriceRaw : undefined,
    badge,
    tone,
    image: image || fallbackImage,
    gallery: gallery.length ? gallery : [image || fallbackImage],
    description: typeof rawDescription === "string" ? rawDescription : "",
    rating: typeof rawRating === "number" ? Math.min(5, Math.max(0, rawRating)) : 4.6,
    reviews: typeof rawReviews === "number" ? Math.max(0, Math.round(rawReviews)) : 120,
    stock: typeof rawStock === "number" ? Math.max(0, Math.round(rawStock)) : 25,
    featured: item["featured"] === true,
    active: item["active"] !== false,
  };
}

const DEFAULT_PLACEHOLDER_ID = "32912307";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeStoreData(input: unknown): StoreData {
  if (!input || typeof input !== "object") return defaultStoreData;
  const raw = input as Record<string, unknown>;

  const settings: StoreSettings = { ...defaultSettings, ...asRecord(raw["settings"]) };
  settings.whatsappNumber = String(settings.whatsappNumber).replace(/\D/g, "");

  const rawHeroImages = raw["heroImages"];
  const rawHero = Array.isArray(raw["heroSlides"])
    ? raw["heroSlides"]
    : Array.isArray(rawHeroImages)
      ? rawHeroImages.map((image) => ({ image }))
      : [];

  const heroSlides: HeroSlide[] = rawHero.length
    ? rawHero
        .map((entry, index) => {
          const slide = asRecord(entry);
          const image = typeof slide["image"] === "string" ? slide["image"] : "";
          if (!image.trim()) return null;
          return {
            id: typeof slide["id"] === "string" ? slide["id"] : `hero-${index + 1}`,
            image,
            eyebrow: typeof slide["eyebrow"] === "string" ? slide["eyebrow"] : "",
            title: typeof slide["title"] === "string" ? slide["title"] : "",
            subtitle: typeof slide["subtitle"] === "string" ? slide["subtitle"] : "",
            ctaLabel: typeof slide["ctaLabel"] === "string" ? slide["ctaLabel"] : "Explore Now",
            ctaTarget: typeof slide["ctaTarget"] === "string" ? slide["ctaTarget"] : "catalog",
          } satisfies HeroSlide;
        })
        .filter((slide): slide is HeroSlide => slide !== null)
    : defaultHeroSlides;

  const rawBenefits = Array.isArray(raw["benefits"]) ? raw["benefits"] : [];
  const benefits: Benefit[] = rawBenefits.length
    ? rawBenefits
        .map((entry, index) => {
          const item = asRecord(entry);
          const title = typeof item["title"] === "string" ? item["title"] : "";
          if (!title) return null;
          return {
            id: typeof item["id"] === "string" ? item["id"] : `benefit-${index + 1}`,
            icon: typeof item["icon"] === "string" ? item["icon"] : "star",
            title,
            copy: typeof item["copy"] === "string" ? item["copy"] : "",
          } satisfies Benefit;
        })
        .filter((item): item is Benefit => item !== null)
    : defaultBenefits;

  const rawCollections = Array.isArray(raw["collections"]) ? raw["collections"] : [];
  const collections: Collection[] = rawCollections.length
    ? rawCollections
        .map((entry, index) => {
          const item = asRecord(entry);
          const name = typeof item["name"] === "string" ? item["name"] : "";
          if (!name) return null;
          const rawId = typeof item["id"] === "string" ? item["id"] : "";
          return {
            id: rawId.trim() || slugify(name) || `collection-${index + 1}`,
            name,
            image: typeof item["image"] === "string" ? item["image"] : P(DEFAULT_PLACEHOLDER_ID),
            tagline: typeof item["tagline"] === "string" ? item["tagline"] : "",
          } satisfies Collection;
        })
        .filter((item): item is Collection => item !== null)
    : defaultCollections;

  const knownCollectionIds = new Set(collections.map((collection) => collection.id));
  const rawProducts = Array.isArray(raw["products"]) ? raw["products"] : [];
  const products = rawProducts
    .map((entry, index) => normalizeProduct(entry, index))
    .filter((product): product is Product => product !== null)
    .map((product) =>
      knownCollectionIds.has(product.collection)
        ? product
        : { ...product, collection: guessCollection(product.category) },
    );

  return {
    version: STORE_VERSION,
    settings,
    heroSlides: heroSlides.length ? heroSlides : defaultHeroSlides,
    benefits: benefits.length ? benefits : defaultBenefits,
    collections,
    products: products.length ? products : defaultProducts,
  };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ------------------------------- external store ------------------------------ */

let current: StoreData = defaultStoreData;
const listeners = new Set<() => void>();

export function getStoreData(): StoreData {
  return current;
}

export function subscribeStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function setStoreData(next: StoreData | ((prev: StoreData) => StoreData)): StoreData {
  const value =
    typeof next === "function" ? (next as (prev: StoreData) => StoreData)(current) : next;
  current = normalizeStoreData({ ...value, version: STORE_VERSION });
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      /* storage full or blocked — keep the in-memory state */
    }
  }
  emit();
  return current;
}

export function updateStoreData(patch: Partial<StoreData>): StoreData {
  return setStoreData((prev) => ({ ...prev, ...patch }));
}

export function resetStoreData(): StoreData {
  return setStoreData(defaultStoreData);
}

export function exportStoreData(): string {
  return JSON.stringify(current, null, 2);
}

export function importStoreData(json: string): StoreData {
  const parsed = JSON.parse(json);
  return setStoreData(normalizeStoreData(parsed));
}

/** Reads persisted data (migrating the pre-v1 `gizmoHubData` payload if needed). */
export function hydrateStore(): void {
  if (typeof window === "undefined") return;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const next = normalizeStoreData(JSON.parse(saved));
      if (JSON.stringify(next) !== JSON.stringify(current)) {
        current = next;
        emit();
      }
      return;
    }

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacy) return;
    const legacyParsed = JSON.parse(legacy) as Record<string, unknown>;
    const base = normalizeStoreData({
      ...defaultStoreData,
      heroImages: legacyParsed["heroImages"],
      products: legacyParsed["products"],
      categories: legacyParsed["categories"],
    });
    current = base;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
    emit();
  } catch (error) {
    console.error("Failed to hydrate GizmoHub store data:", error);
  }
}

/** Hook used by both the storefront and the admin panel. */
export function useStore(): StoreData {
  const data = useSyncExternalStore(subscribeStore, getStoreData, getStoreData);
  return data;
}

/* --------------------------------- selectors -------------------------------- */

export function activeProducts(store: StoreData): Product[] {
  return store.products.filter((p) => p.active !== false);
}

export function collectionById(store: StoreData, id: string): Collection | undefined {
  return store.collections.find((c) => c.id === id);
}

export function collectionName(store: StoreData, id: string): string {
  return collectionById(store, id)?.name ?? "All products";
}

export function productsInCollection(store: StoreData, id: string): Product[] {
  return activeProducts(store).filter((p) => p.collection === id);
}

export function newArrivals(store: StoreData): Product[] {
  return activeProducts(store).filter((p) => p.badge === "NEW");
}

export function dealProducts(store: StoreData): Product[] {
  return activeProducts(store).filter((p) => p.badge === "SALE" || (p.oldPrice ?? 0) > p.price);
}

export function bestSellers(store: StoreData): Product[] {
  return activeProducts(store).filter((p) => p.badge === "BESTSELLER");
}

export function featuredProducts(store: StoreData): Product[] {
  const featured = activeProducts(store).filter((p) => p.featured);
  return featured.length ? featured : activeProducts(store).slice(0, 4);
}

export function nextProductId(store: StoreData): number {
  return store.products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

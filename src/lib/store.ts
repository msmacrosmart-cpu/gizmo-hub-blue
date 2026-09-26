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
    eyebrow: "Eleve Seu Estilo de Vida",
    title: "Tecnologia Inteligente.\nMelhor no Dia a Dia.",
    subtitle: "Descubra gadgets e acessórios inovadores, feitos para performance e estilo.",
    ctaLabel: "Explorar Agora",
    ctaTarget: "catalog",
  },
  {
    id: "hero-2",
    image: ORIGINAL_HERO_2,
    eyebrow: "Nova Temporada 2026",
    title: "Som Que\nSe Move Com Você.",
    subtitle:
      "Fones sem fio, headphones e caixas de som afinados para um áudio puro e imersivo.",
    ctaLabel: "Comprar Áudio",
    ctaTarget: "catalog",
  },
  {
    id: "hero-3",
    image: ORIGINAL_HERO_3,
    eyebrow: "Recarregue",
    title: "Carregue Rápido.\nVá Mais Longe.",
    subtitle: "Power banks, carregadores sem fio e estações que mantêm todo dispositivo ligado.",
    ctaLabel: "Comprar Energia",
    ctaTarget: "catalog",
  },
  {
    id: "hero-4",
    image: PEX("11398246"),
    eyebrow: "Som de Estúdio",
    title: "Ouça Cada\nPequeno Detalhe.",
    subtitle: "Headphones over-ear com cancelamento de ruído adaptativo e 40h de bateria.",
    ctaLabel: "Comprar Headphones",
    ctaTarget: "catalog",
  },
  {
    id: "hero-5",
    image: PEX("31018745"),
    eyebrow: "Feito Para Vencer",
    title: "Evolua\nSeu Setup.",
    subtitle: "Equipamentos RGB, teclados mecânicos e mouses de precisão para jogadores sérios.",
    ctaLabel: "Comprar Gaming",
    ctaTarget: "catalog",
  },
];

export const defaultBenefits: Benefit[] = [
  { id: "b1", icon: "truck", title: "Frete Grátis", copy: "Em compras acima de R$50" },
  { id: "b2", icon: "returns", title: "Devolução em 30 Dias", copy: "Trocas e devoluções facilitadas" },
  { id: "b3", icon: "shield", title: "Pagamento Seguro", copy: "Finalização de compra 100% segura" },
  { id: "b4", icon: "support", title: "Suporte 24/7", copy: "Estamos aqui para ajudar" },
];

/** The four original GizmoHub collections, kept exactly as they shipped. */
export const defaultCollections: Collection[] = [
  {
    id: "audio",
    name: "Dispositivos de Áudio",
    image: PEX("3756985"),
    tagline: "Fones, caixas de som e headphones",
  },
  {
    id: "smart-watches",
    name: "Relógios Inteligentes",
    image: PEX("31541678"),
    tagline: "Acompanhe cada movimento",
  },
  {
    id: "power",
    name: "Soluções de Energia",
    image: PEX("4765366"),
    tagline: "Carregadores e power banks",
  },
  {
    id: "drones-cameras",
    name: "Drones & Câmeras",
    image: PEX("8821970"),
    tagline: "Capture do alto",
  },
  {
    id: "gaming",
    name: "Equipamentos Gamer",
    image: PEX("7862493"),
    tagline: "Mouses, teclados e headsets",
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
      'Tela AMOLED de 1,85", monitoramento de frequência cardíaca e SpO2 24 horas por dia, mais de 110 modos esportivos e até 14 dias de bateria.',
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
      "Smartwatch minimalista com tela sempre ativa, GPS integrado, monitoramento de sono e corpo leve em alumínio.",
    rating: 4.6,
    reviews: 963,
    stock: 18,
  },
  {
    id: 6,
    name: "Zenith Band 5",
    category: "Pulseira Fitness",
    collection: "smart-watches",
    price: 59.99,
    badge: "NEW",
    image: PEX("5081914"),
    gallery: [PEX("51011"), PEX("8217430")],
    description:
      "Pulseira fitness ultraleve com resistência à água de 5ATM, monitoramento de estresse e 21 dias de bateria em standby.",
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
      "Smartwatch de titânio com GPS dual-band, mapas offline, vidro de safira e tela brilhante de 2000 nits.",
    rating: 4.9,
    reviews: 512,
    stock: 9,
  },
  {
    id: 8,
    name: "Nova Fit Pro",
    category: "Pulseira Fitness",
    collection: "smart-watches",
    price: 89.99,
    oldPrice: 119.99,
    badge: "SALE",
    image: PEX("18662969"),
    gallery: [PEX("51011"), PEX("5081914")],
    description:
      "Pulseira AMOLED curva com mais de 150 mostradores, análise de VO2 máximo e carregamento magnético rápido.",
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
      "Smartwatch em aço inoxidável com coroa giratória, pulseira de couro e 10 dias de bateria para o dia a dia com elegância.",
    rating: 4.7,
    reviews: 288,
    stock: 15,
  },
  {
    id: 10,
    name: "Nova Fit Lite",
    category: "Pulseira Fitness",
    collection: "smart-watches",
    price: 45.99,
    image: PEX("51011"),
    gallery: [PEX("5081914"), PEX("18662969")],
    description:
      "Monitor de atividades essencial com contagem de passos, calorias e sono, além de 14 dias de bateria por menos de R$50.",
    rating: 4.2,
    reviews: 156,
    stock: 52,
  },

  /* ---------------- Audio Devices ---------------- */
  {
    id: 1,
    name: "SoundPro X1",
    category: "Fones de Ouvido Sem Fio",
    collection: "audio",
    price: 79.99,
    badge: "NEW",
    image: PEX("9528219"),
    gallery: [PEX("3921827"), PEX("33797659")],
    description:
      "Fones com cancelamento de ruído híbrido, 42h de reprodução total, modo transparência e estojo de carregamento sem fio compacto.",
    rating: 4.8,
    reviews: 2310,
    stock: 36,
    featured: true,
  },
  {
    id: 11,
    name: "AirBuds Mini 2",
    category: "Fones de Ouvido Sem Fio",
    collection: "audio",
    price: 49.99,
    oldPrice: 69.99,
    badge: "SALE",
    image: PEX("3921827"),
    gallery: [PEX("33797659"), PEX("35599938")],
    description:
      "Fones leves como pluma com grave potente, resistência ao suor IPX5 e 28 horas de reprodução com o estojo.",
    rating: 4.5,
    reviews: 1204,
    stock: 44,
  },
  {
    id: 12,
    name: "BassBuds Pro",
    category: "Fones de Ouvido Sem Fio",
    collection: "audio",
    price: 99.99,
    badge: "BESTSELLER",
    image: PEX("33797659"),
    gallery: [PEX("35599938"), PEX("9528219")],
    description:
      "Drivers de 12mm afinados em estúdio, áudio hi-res LDAC, pareamento multiponto e 36h de bateria com ANC desligado.",
    rating: 4.9,
    reviews: 3087,
    stock: 21,
  },
  {
    id: 3,
    name: "BoomMate",
    category: "Caixa de Som Portátil",
    collection: "audio",
    price: 89.99,
    oldPrice: 119.99,
    badge: "SALE",
    image: PEX("29581125"),
    gallery: [PEX("4917455"), PEX("9072408")],
    description:
      "Caixa de som portátil 360° com grave profundo, carcaça à prova d'água IP67 e 20 horas de música sem parar.",
    rating: 4.7,
    reviews: 1421,
    stock: 27,
    featured: true,
  },
  {
    id: 13,
    name: "BoomMate XL",
    category: "Caixa de Som Portátil",
    collection: "audio",
    price: 139.99,
    image: PEX("4917455"),
    gallery: [PEX("13465232"), PEX("9072408")],
    description:
      "Caixa de som de 60W que enche o ambiente, com dois radiadores passivos, luzes sincronizadas para festas e 24 horas de bateria.",
    rating: 4.6,
    reviews: 688,
    stock: 12,
  },
  {
    id: 14,
    name: "Wave Outdoor",
    category: "Caixa de Som Portátil",
    collection: "audio",
    price: 74.99,
    oldPrice: 94.99,
    badge: "SALE",
    image: PEX("13465232"),
    gallery: [PEX("9072408"), PEX("29581125")],
    description:
      "Caixa de som robusta para viagem com alça mosquetão, grade à prova de poeira e 16 horas de reprodução em qualquer lugar.",
    rating: 4.4,
    reviews: 342,
    stock: 33,
  },
  {
    id: 15,
    name: "StudioSound ANC",
    category: "Headphone Over-Ear",
    collection: "audio",
    price: 199.99,
    badge: "NEW",
    image: PEX("210927"),
    gallery: [PEX("7772548"), PEX("11398246")],
    description:
      "Headphone over-ear com cancelamento de ruído adaptativo, 40h de bateria, almofadas de espuma viscoelástica e áudio hi-res LDAC.",
    rating: 4.9,
    reviews: 874,
    stock: 17,
    featured: true,
  },
  {
    id: 16,
    name: "Wave Headphones",
    category: "Headphone Over-Ear",
    collection: "audio",
    price: 129.99,
    oldPrice: 159.99,
    badge: "SALE",
    image: PEX("7054718"),
    gallery: [PEX("210927"), PEX("7772548")],
    description:
      "Headphone sem fio dobrável com drivers de 45mm, médios nítidos, graves profundos e 30 horas de uso.",
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
      "Power bank de 20.000mAh com carregamento rápido de 22,5W, três saídas e display digital de bateria.",
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
      "Power bank robusto de 30.000mAh com recarga solar, duas portas USB-C e lanterna de camping integrada.",
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
      "Bateria de bolso de 10.000mAh com saída PD de 20W — carrega um celular duas vezes e cabe em qualquer bolsa.",
    rating: 4.6,
    reviews: 934,
    stock: 60,
  },
  {
    id: 20,
    name: "ChargePad 3in1",
    category: "Carregador Sem Fio",
    collection: "power",
    price: 59.99,
    image: PEX("5961044"),
    gallery: [PEX("5948344"), PEX("7742585")],
    description:
      "Estação de carregamento sem fio magnética 3 em 1 para celular, fones e relógio com um único cabo.",
    rating: 4.7,
    reviews: 486,
    stock: 19,
  },
  {
    id: 21,
    name: "QuickCharge 65W",
    category: "Carregador de Parede",
    collection: "power",
    price: 39.99,
    badge: "BESTSELLER",
    image: PEX("5948344"),
    gallery: [PEX("5961044"), PEX("7742585")],
    description:
      "Carregador GaN de 65W com três portas — carrega notebook, tablet e celular ao mesmo tempo.",
    rating: 4.8,
    reviews: 1590,
    stock: 41,
  },
  {
    id: 22,
    name: "PowerStation 300W",
    category: "Estação Portátil",
    collection: "power",
    price: 249.99,
    image: PEX("3921704"),
    gallery: [PEX("6296911"), PEX("518530")],
    description:
      "Estação de energia portátil com inversor de onda senoidal pura de 300W, saída AC e USB-C PD para viagens e quedas de energia.",
    rating: 4.6,
    reviews: 214,
    stock: 8,
  },
  {
    id: 23,
    name: "MagSafe Dash Mount",
    category: "Carregador Veicular",
    collection: "power",
    price: 44.99,
    oldPrice: 59.99,
    badge: "SALE",
    image: PEX("7742585"),
    gallery: [PEX("5961044"), PEX("5948344")],
    description:
      "Carregador veicular magnético de 15W com suporte para saída de ar e painel, rotação de 360° para dirigir com segurança sem usar as mãos.",
    rating: 4.3,
    reviews: 297,
    stock: 25,
  },

  /* ---------------- Drones & Cameras ---------------- */
  {
    id: 24,
    name: "SkyView Drone X",
    category: "Drone com Câmera",
    collection: "drones-cameras",
    price: 399.99,
    badge: "NEW",
    image: PEX("1336211"),
    gallery: [PEX("3722737"), PEX("14484029")],
    description:
      "Drone dobrável 4K com estabilizador de 3 eixos, 40 minutos de voo, retorno automático por GPS e transmissão de 10km.",
    rating: 4.9,
    reviews: 356,
    stock: 11,
    featured: true,
  },
  {
    id: 25,
    name: "Falcon Mini Drone",
    category: "Drone com Câmera",
    collection: "drones-cameras",
    price: 189.99,
    oldPrice: 249.99,
    badge: "SALE",
    image: PEX("14484029"),
    gallery: [PEX("1336211"), PEX("8821970")],
    description:
      "Mini drone com menos de 250g, vídeo em 2.7K, fotos por gestos, decolagem com um toque e 31 minutos de voo.",
    rating: 4.6,
    reviews: 742,
    stock: 23,
  },
  {
    id: 26,
    name: "ActionCam 4K",
    category: "Câmera de Ação",
    collection: "drones-cameras",
    price: 229.99,
    badge: "BESTSELLER",
    image: PEX("92723"),
    gallery: [PEX("92722"), PEX("11031052")],
    description:
      "Câmera de ação à prova d'água com vídeo 4K60, estabilização ultra suave, estojo para 40m e controle por voz.",
    rating: 4.8,
    reviews: 1883,
    stock: 16,
  },
  {
    id: 27,
    name: "ActionCam Go",
    category: "Câmera de Ação",
    collection: "drones-cameras",
    price: 149.99,
    oldPrice: 189.99,
    badge: "SALE",
    image: PEX("11031052"),
    gallery: [PEX("4817132"), PEX("794619")],
    description:
      "Câmera de ação compacta em 2.7K com tela sensível ao toque frontal, estabilização de imagem e kit completo de suportes.",
    rating: 4.4,
    reviews: 508,
    stock: 34,
  },
  {
    id: 28,
    name: "Horizon Cam Pro",
    category: "Câmera de Ação",
    collection: "drones-cameras",
    price: 299.99,
    badge: "NEW",
    image: PEX("4817132"),
    gallery: [PEX("92722"), PEX("794619")],
    description:
      "Câmera de ação 360° com vídeo em 5.7K, nivelamento de horizonte, câmera lenta e transmissão ao vivo integrada.",
    rating: 4.7,
    reviews: 231,
    stock: 10,
  },
  {
    id: 29,
    name: "TrailCam Lens Kit",
    category: "Acessório para Câmera",
    collection: "drones-cameras",
    price: 79.99,
    image: PEX("794619"),
    gallery: [PEX("92723"), PEX("4817132")],
    description:
      "Kit com três lentes acessórias — macro, grande angular e filtros ND — compatível com qualquer suporte de câmera de ação.",
    rating: 4.3,
    reviews: 189,
    stock: 45,
  },

  /* ---------------- Gaming Gear ---------------- */
  {
    id: 4,
    name: "GameMax Pro",
    category: "Mouse Gamer",
    collection: "gaming",
    price: 39.99,
    oldPrice: 59.99,
    image: PEX("12877898"),
    gallery: [PEX("2115256"), PEX("7915503")],
    description:
      "Sensor óptico de 26.000 DPI, 8 botões programáveis, 70 horas de bateria e carcaça leve como pluma de 63g.",
    rating: 4.7,
    reviews: 2044,
    stock: 38,
    featured: true,
  },
  {
    id: 30,
    name: "StrikeMouse RGB",
    category: "Mouse Gamer",
    collection: "gaming",
    price: 59.99,
    badge: "NEW",
    image: PEX("2115256"),
    gallery: [PEX("34704932"), PEX("7915503")],
    description:
      "Mouse gamer sem fio com resposta de 1ms, 100 horas de bateria, iluminação RGB e switches hot-swap.",
    rating: 4.8,
    reviews: 617,
    stock: 20,
  },
  {
    id: 31,
    name: "MechaKey TKL",
    category: "Teclado Mecânico",
    collection: "gaming",
    price: 119.99,
    badge: "BESTSELLER",
    image: PEX("9020272"),
    gallery: [PEX("31018745"), PEX("28993064")],
    description:
      "Teclado mecânico tenkeyless hot-swap com RGB por tecla, keycaps em PBT e conectividade tri-modo.",
    rating: 4.9,
    reviews: 1122,
    stock: 14,
  },
  {
    id: 32,
    name: "GameVoice Headset",
    category: "Headset Gamer",
    collection: "gaming",
    price: 109.99,
    oldPrice: 139.99,
    badge: "SALE",
    image: PEX("11398246"),
    gallery: [PEX("28993064"), PEX("210927")],
    description:
      "Headset gamer com som surround, microfone removível com cancelamento de ruído, espuma viscoelástica e detalhes em RGB.",
    rating: 4.6,
    reviews: 803,
    stock: 26,
  },
  {
    id: 33,
    name: "BattleStation Bundle",
    category: "Kit Gamer",
    collection: "gaming",
    price: 299.99,
    image: PEX("31018745"),
    gallery: [PEX("28993064"), PEX("9020272")],
    description:
      "Estação de batalha RGB completa: teclado mecânico, mouse de precisão, headset e mousepad XL.",
    rating: 4.7,
    reviews: 176,
    stock: 7,
  },
  {
    id: 34,
    name: "Precision Pad XL",
    category: "Acessório Gamer",
    collection: "gaming",
    price: 29.99,
    image: PEX("7915503"),
    gallery: [PEX("12877898"), PEX("34704932")],
    description:
      "Mousepad extra grande com superfície em tecido microtexturizado, base antiderrapante e borda costurada com RGB.",
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
  announcement: "✨ Frete grátis em compras acima de R$50 — mais 5% de desconto pagando no Pix",
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

export function formatPrice(value: number, currency = "R$ "): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${currency}${safe.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Portuguese label shown for a product badge (the underlying value stays in English for logic). */
export function badgeLabel(badge: Badge): string {
  switch (badge) {
    case "NEW":
      return "NOVO";
    case "SALE":
      return "OFERTA";
    case "BESTSELLER":
      return "MAIS VENDIDO";
    default:
      return badge;
  }
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

function nextId(products: readonly Product[]): number {
  return products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
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

  const name = typeof rawName === "string" && rawName.trim() ? rawName : `Produto ${index + 1}`;
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
            ctaLabel: typeof slide["ctaLabel"] === "string" ? slide["ctaLabel"] : "Explorar Agora",
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

    // Migration from the pre-v1 payload: keep the new default catalog and add
    // any custom product the store owner had created on top of it.
    const legacyProducts = (Array.isArray(legacyParsed["products"]) ? legacyParsed["products"] : [])
      .map((entry, index) => normalizeProduct(entry, index))
      .filter((product): product is Product => product !== null);
    const defaultIds = new Set(defaultProducts.map((product) => product.id));
    const extraProducts = legacyProducts
      .filter((product) => !defaultIds.has(product.id))
      .map((product) => ({
        ...product,
        id: defaultIds.has(product.id) ? nextId(defaultProducts) : product.id,
      }));

    const legacyHero = Array.isArray(legacyParsed["heroImages"])
      ? legacyParsed["heroImages"].filter((value): value is string => typeof value === "string")
      : [];

    const migrated = normalizeStoreData({
      ...defaultStoreData,
      heroSlides:
        legacyHero.length > defaultHeroSlides.length
          ? legacyHero.map((image, index) => ({ image, id: `hero-${index + 1}` }))
          : defaultHeroSlides,
      products: [...defaultProducts, ...extraProducts],
    });

    current = migrated;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
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
  return collectionById(store, id)?.name ?? "Todos os produtos";
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

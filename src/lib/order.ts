/**
 * Cart + WhatsApp checkout helpers.
 *
 * The storefront finishes every order inside WhatsApp: we collect the customer
 * details, build a nicely formatted (and emoji rich) message and open
 * wa.me with the text pre-filled.
 */
import type { PaymentMethod, Product, StoreData } from "./store";
import { formatPrice } from "./store";

export interface CartItem {
  /** Unique key — usually the product id. */
  id: string;
  productId: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  reference: string;
  paymentMethod: PaymentMethod;
  cardInstallments: string;
  changeFor: string;
  notes: string;
}

export const emptyCustomer: CustomerInfo = {
  name: "",
  phone: "",
  email: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  reference: "",
  paymentMethod: "pix",
  cardInstallments: "1x",
  changeFor: "",
  notes: "",
};

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
  freeShipping: boolean;
}

const FLAT_SHIPPING = 9.99;

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function calcTotals(items: CartItem[], settings: StoreData["settings"]): OrderTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + (Number.isFinite(item.price) ? item.price : 0) * item.quantity,
    0,
  );
  const itemCount = cartCount(items);
  const freeShipping = subtotal >= settings.freeShippingFrom;
  const shipping = itemCount === 0 ? 0 : freeShipping ? 0 : FLAT_SHIPPING;
  const discount =
    settings.pixDiscountPercent > 0 ? (subtotal * settings.pixDiscountPercent) / 100 : 0;
  return {
    subtotal,
    discount,
    shipping,
    total: Math.max(0, subtotal - discount + shipping),
    itemCount,
    freeShipping,
  };
}

/** Totals for the payment method that is currently selected at checkout. */
export function totalsForMethod(
  items: CartItem[],
  settings: StoreData["settings"],
  method: PaymentMethod,
): OrderTotals {
  const base = calcTotals(items, settings);
  if (method === "pix") return base;
  return { ...base, discount: 0, total: Math.max(0, base.subtotal + base.shipping) };
}

export function buildAddress(customer: CustomerInfo): string {
  const line1 = [customer.street, customer.number].filter(Boolean).join(", ");
  const parts = [line1, customer.complement, customer.neighborhood].filter(Boolean);
  const cityLine = [customer.city, customer.state].filter(Boolean).join(" / ");
  const cepLine = customer.cep ? `CEP ${customer.cep}` : "";
  return [...parts, cityLine, cepLine].filter(Boolean).join(" — ");
}

export function validateCustomer(customer: CustomerInfo): string | null {
  if (!customer.name.trim()) return "Informe seu nome completo.";
  if (customer.phone.replace(/\D/g, "").length < 10) return "Informe um WhatsApp válido com DDD.";
  if (!customer.street.trim()) return "Informe o endereço de entrega (rua/avenida).";
  if (!customer.number.trim()) return "Informe o número do endereço.";
  if (!customer.city.trim()) return "Informe a cidade de entrega.";
  return null;
}

function orderCode(): string {
  const now = new Date();
  const stamp = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getFullYear()).slice(-2)}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `GH-${stamp}-${random}`;
}

function formatDateTime(): string {
  const now = new Date();
  return `${now.toLocaleDateString("pt-BR")} às ${now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

/**
 * Builds the message sent to the store's WhatsApp. Everything the seller needs
 * to fulfill the order is here: customer, address, payment and itemised totals.
 */
export function buildOrderMessage(
  items: CartItem[],
  customer: CustomerInfo,
  store: StoreData,
  currency = "$",
): string {
  const { settings } = store;
  const totals = totalsForMethod(items, settings, customer.paymentMethod);
  const line = "━━━━━━━━━━━━━━━━━━━━";

  const parts: string[] = [];
  parts.push(`🛒 *NOVO PEDIDO — ${settings.storeName.toUpperCase()}* 🛒`);
  parts.push(`🧾 *Pedido:* ${orderCode()}`);
  parts.push(`📅 ${formatDateTime()}`);
  parts.push("");
  parts.push(`👤 *DADOS DO CLIENTE*`);
  parts.push(`*Nome:* ${customer.name.trim()}`);
  parts.push(`📱 *WhatsApp:* ${customer.phone.trim()}`);
  if (customer.email.trim()) parts.push(`📧 *E-mail:* ${customer.email.trim()}`);
  parts.push("");
  parts.push(`📍 *ENDEREÇO DE ENTREGA*`);
  parts.push(buildAddress(customer) || "—");
  if (customer.reference.trim()) parts.push(`📌 *Referência:* ${customer.reference.trim()}`);
  parts.push("");
  parts.push(`💳 *FORMA DE PAGAMENTO*`);
  if (customer.paymentMethod === "pix") {
    parts.push(
      `*Pix* ${settings.pixDiscountPercent > 0 ? `(${settings.pixDiscountPercent}% de desconto)` : ""}`,
    );
  } else {
    parts.push(
      `*Cartão de crédito* — ${customer.cardInstallments} ${
        settings.maxInstallments > 1 ? `(até ${settings.maxInstallments}x)` : ""
      }`,
    );
  }
  if (customer.notes.trim()) {
    parts.push("");
    parts.push(`📝 *OBSERVAÇÕES*`);
    parts.push(customer.notes.trim());
  }
  parts.push("");
  parts.push(`📦 *ITENS DO PEDIDO*`);
  parts.push(line);
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    parts.push(`${index + 1}️⃣  *${item.name}*`);
    parts.push(
      `      #${String(item.productId).padStart(3, "0")} • ${formatPrice(item.price, currency)} x ${item.quantity} = 💰 ${formatPrice(itemTotal, currency)}`,
    );
  });
  parts.push(line);
  parts.push("");
  parts.push(`🧮 *RESUMO DO PEDIDO*`);
  parts.push(
    `Produtos (${totals.itemCount} ${totals.itemCount === 1 ? "item" : "itens"}): ${formatPrice(totals.subtotal, currency)}`,
  );
  if (totals.discount > 0)
    parts.push(
      `🎁 Desconto Pix (${settings.pixDiscountPercent}%): -${formatPrice(totals.discount, currency)}`,
    );
  parts.push(
    totals.freeShipping
      ? "🚚 Frete: *GRÁTIS* 🎉"
      : `🚚 Frete: ${formatPrice(totals.shipping, currency)}`,
  );
  parts.push("");
  parts.push(`💵 *TOTAL: ${formatPrice(totals.total, currency)}*`);
  if (
    customer.paymentMethod === "cartao" &&
    Number(customer.cardInstallments.replace(/\D/g, "")) > 1
  ) {
    const times = Number(customer.cardInstallments.replace(/\D/g, "")) || 1;
    parts.push(`   ou ${times}x de ${formatPrice(totals.total / times, currency)}`);
  }
  parts.push("");
  parts.push(`✅ *Aguardo a confirmação do pedido!*`);

  return parts.join("\n");
}

/** Pre-sales question about a single product, also sent through WhatsApp. */
export function buildProductQuestionMessage(
  product: Product,
  store: StoreData,
  currency = "$",
): string {
  const lines = [
    "🛍️ *OLÁ, " + store.settings.storeName.toUpperCase() + "!*",
    "",
    "Tenho interesse neste produto:",
    "",
    `📦 *${product.name}* (#${String(product.id).padStart(3, "0")})`,
    `🏷️ ${product.category}`,
    `💵 ${formatPrice(product.price, currency)}${
      product.oldPrice ? ` (antes ${formatPrice(product.oldPrice, currency)})` : ""
    }`,
    "",
    "Ainda está disponível? Gostaria de saber sobre frete e prazo de entrega. ✅",
  ];
  return lines.join("\n");
}

export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(phone: string, message: string): void {
  const url = whatsappLink(phone, message);
  if (typeof window === "undefined") return;
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) window.location.href = url;
}

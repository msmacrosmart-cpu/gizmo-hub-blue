import { CreditCard, Loader2, Lock, MapPin, MessageCircle, QrCode, User, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  calcTotals,
  cartCount,
  emptyCustomer,
  totalsForMethod,
  validateCustomer,
  type CartItem,
  type CustomerInfo,
} from "@/lib/order";
import { formatPrice, sized, type StoreData } from "@/lib/store";

interface CheckoutModalProps {
  open: boolean;
  items: CartItem[];
  store: StoreData;
  currency?: string;
  onClose: () => void;
  onSubmit: (customer: CustomerInfo) => void;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20";
const labelClass = "mb-1.5 block text-xs font-semibold text-foreground";

function Field({
  label,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-[11px] font-medium text-destructive">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

export function CheckoutModal({
  open,
  items,
  store,
  currency = "$",
  onClose,
  onSubmit,
}: CheckoutModalProps) {
  const { settings } = store;
  const [customer, setCustomer] = useState<CustomerInfo>(emptyCustomer);
  const [error, setError] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const totals = totalsForMethod(items, settings, customer.paymentMethod);
  const base = calcTotals(items, settings);
  const count = cartCount(items);
  const set = <K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) =>
    setCustomer((prev) => ({ ...prev, [key]: value }));

  const maskPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
      return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  };

  const maskCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    return digits.replace(/^(\d{5})(\d)/, "$1-$2");
  };

  const lookupCep = async (cep: string) => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = (await response.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (!data.erro) {
        setCustomer((prev) => ({
          ...prev,
          street: prev.street || data.logradouro || prev.street,
          neighborhood: prev.neighborhood || data.bairro || prev.neighborhood,
          city: prev.city || data.localidade || prev.city,
          state: prev.state || data.uf || prev.state,
        }));
      }
    } catch {
      /* offline or blocked — the customer can still type the address */
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateCustomer(customer);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSubmit(customer);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <button
        className="absolute inset-0 bg-overlay backdrop-blur-sm"
        aria-label="Close checkout"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        className="relative z-10 max-h-[94dvh] w-full overflow-y-auto rounded-t-2xl bg-card shadow-drawer sm:max-w-3xl sm:rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-card px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-lg font-bold sm:text-xl">Finalizar pedido</h2>
            <p className="text-xs text-muted-foreground">
              Preencha seus dados e enviaremos o pedido no WhatsApp.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close checkout">
            <X className="size-5" />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 px-5 py-5 sm:px-7 lg:grid-cols-[1.4fr_1fr]"
        >
          <div className="space-y-6">
            {/* Customer */}
            <fieldset className="space-y-3">
              <legend className="mb-1 flex items-center gap-2 text-sm font-bold">
                <User className="size-4 text-primary" /> 1. Seus dados
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Nome completo *" className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={customer.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="João Silva"
                    autoComplete="name"
                  />
                </Field>
                <Field label="WhatsApp *" hint="Com DDD, ex: (11) 97788-8609">
                  <input
                    className={inputClass}
                    value={customer.phone}
                    onChange={(e) => set("phone", maskPhone(e.target.value))}
                    placeholder="(11) 97788-8609"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </Field>
                <Field label="E-mail">
                  <input
                    className={inputClass}
                    type="email"
                    value={customer.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="joao@email.com"
                    autoComplete="email"
                  />
                </Field>
              </div>
            </fieldset>

            {/* Address */}
            <fieldset className="space-y-3">
              <legend className="mb-1 flex items-center gap-2 text-sm font-bold">
                <MapPin className="size-4 text-primary" /> 2. Endereço de entrega
              </legend>
              <div className="grid gap-3 sm:grid-cols-6">
                <Field label="CEP" className="sm:col-span-2">
                  <div className="relative">
                    <input
                      className={inputClass}
                      value={customer.cep}
                      onChange={(e) => set("cep", maskCep(e.target.value))}
                      onBlur={(e) => lookupCep(e.target.value)}
                      placeholder="01234-567"
                      inputMode="numeric"
                    />
                    {cepLoading ? (
                      <Loader2 className="absolute right-3 top-3 size-4 animate-spin text-muted-foreground" />
                    ) : null}
                  </div>
                </Field>
                <Field label="Rua / Avenida *" className="sm:col-span-4">
                  <input
                    className={inputClass}
                    value={customer.street}
                    onChange={(e) => set("street", e.target.value)}
                    placeholder="Rua das Flores"
                  />
                </Field>
                <Field label="Número *" className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={customer.number}
                    onChange={(e) => set("number", e.target.value)}
                    placeholder="123"
                  />
                </Field>
                <Field label="Complemento" className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={customer.complement}
                    onChange={(e) => set("complement", e.target.value)}
                    placeholder="Apto 12"
                  />
                </Field>
                <Field label="Bairro" className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={customer.neighborhood}
                    onChange={(e) => set("neighborhood", e.target.value)}
                    placeholder="Centro"
                  />
                </Field>
                <Field label="Cidade *" className="sm:col-span-3">
                  <input
                    className={inputClass}
                    value={customer.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="São Paulo"
                  />
                </Field>
                <Field label="Estado" className="sm:col-span-1">
                  <input
                    className={`${inputClass} uppercase`}
                    value={customer.state}
                    onChange={(e) => set("state", e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="SP"
                    maxLength={2}
                  />
                </Field>
                <Field label="Ponto de referência" className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={customer.reference}
                    onChange={(e) => set("reference", e.target.value)}
                    placeholder="Próximo ao mercado"
                  />
                </Field>
              </div>
            </fieldset>

            {/* Payment */}
            <fieldset className="space-y-3">
              <legend className="mb-1 flex items-center gap-2 text-sm font-bold">
                <CreditCard className="size-4 text-primary" /> 3. Forma de pagamento
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => set("paymentMethod", "pix")}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    customer.paymentMethod === "pix"
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <QrCode className="size-4 text-primary" /> Pix
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {settings.pixDiscountPercent > 0
                      ? `${settings.pixDiscountPercent}% de desconto • aprovação imediata`
                      : "Aprovação imediata"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => set("paymentMethod", "cartao")}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    customer.paymentMethod === "cartao"
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <CreditCard className="size-4 text-primary" /> Cartão de crédito
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Parcele em até {settings.maxInstallments}x
                  </span>
                </button>
              </div>
              {customer.paymentMethod === "cartao" ? (
                <Field label="Parcelas">
                  <select
                    className={inputClass}
                    value={customer.cardInstallments}
                    onChange={(e) => set("cardInstallments", e.target.value)}
                  >
                    {Array.from({ length: settings.maxInstallments }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={`${n}x`}>
                        {`${n}x de ${formatPrice(totals.subtotal / n, currency)}${
                          n === 1 ? " (à vista)" : ""
                        }`}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : null}
            </fieldset>

            <Field label="Observações do pedido">
              <textarea
                className={`${inputClass} min-h-[80px]`}
                value={customer.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Cor preferida, horário para entrega, presente, etc."
              />
            </Field>
          </div>

          {/* Order summary */}
          <aside className="h-fit rounded-xl border border-border bg-background p-4 lg:sticky lg:top-24">
            <h3 className="text-sm font-bold">Resumo do pedido</h3>
            <div className="mt-3 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2">
                  <img
                    src={sized(item.image, 120, 120)}
                    alt={item.name}
                    className="size-12 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="truncate font-semibold">{item.name}</p>
                    <p className="text-muted-foreground">
                      {item.quantity} x {formatPrice(item.price, currency)}
                    </p>
                  </div>
                  <span className="text-xs font-bold">
                    {formatPrice(item.price * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Produtos ({count})</span>
                <span>{formatPrice(base.subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                <span>{base.freeShipping ? "Grátis" : formatPrice(base.shipping, currency)}</span>
              </div>
              {totals.discount > 0 ? (
                <div className="flex justify-between font-medium text-primary">
                  <span>Desconto Pix ({settings.pixDiscountPercent}%)</span>
                  <span>-{formatPrice(totals.discount, currency)}</span>
                </div>
              ) : null}
              <div className="flex items-baseline justify-between pt-2 text-sm font-bold">
                <span>Total</span>
                <span className="text-xl text-primary">{formatPrice(totals.total, currency)}</span>
              </div>
              {customer.paymentMethod === "cartao" ? (
                <p className="text-[11px] text-muted-foreground">
                  {customer.cardInstallments} de{" "}
                  {formatPrice(
                    totals.total /
                      Math.max(1, Number(customer.cardInstallments.replace(/\D/g, "")) || 1),
                    currency,
                  )}
                </p>
              ) : null}
            </div>

            {error ? (
              <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="mt-4 w-full" disabled={!items.length}>
              <MessageCircle className="size-4" /> Enviar pedido no WhatsApp
            </Button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Lock className="size-3" /> Seus dados são enviados apenas para a loja
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}

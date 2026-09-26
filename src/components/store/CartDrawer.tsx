import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { calcTotals, cartCount, type CartItem } from "@/lib/order";
import { formatPrice, sized, type StoreData } from "@/lib/store";

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  store: StoreData;
  currency?: string;
  onClose: () => void;
  onSetQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

export function CartDrawer({
  open,
  items,
  store,
  currency = "$",
  onClose,
  onSetQuantity,
  onRemove,
  onClear,
  onCheckout,
}: CartDrawerProps) {
  const { settings } = store;
  const totals = calcTotals(items, settings);
  const remaining = Math.max(0, settings.freeShippingFrom - totals.subtotal);
  const progress = Math.min(
    100,
    Math.round((totals.subtotal / Math.max(1, settings.freeShippingFrom)) * 100),
  );
  const count = cartCount(items);

  return (
    <aside
      className={`mobile-drawer fixed right-0 top-0 z-50 flex h-dvh w-[min(94vw,420px)] flex-col bg-card p-5 shadow-drawer transition-transform duration-300 sm:p-6 ${
        open ? "mobile-drawer-open" : ""
      }`}
      aria-label="Shopping cart"
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Your cart</h2>
          <p className="text-sm text-muted-foreground">
            {count} {count === 1 ? "item" : "items"}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close cart">
          <X className="size-5" />
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="mt-4 rounded-lg bg-primary-soft p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Truck className="size-4 text-primary" />
            {totals.freeShipping
              ? "🎉 You unlocked free shipping!"
              : `Add ${formatPrice(remaining, currency)} more for free shipping`}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <ShoppingBag className="size-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Button variant="outline" size="sm" onClick={onClose}>
              Start shopping
            </Button>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-3 rounded-lg border border-border p-3">
              <img
                src={sized(item.image, 160, 160)}
                alt={item.name}
                className="size-16 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center rounded-md border border-border">
                    <button
                      type="button"
                      onClick={() => onSetQuantity(item.id, item.quantity - 1)}
                      className="grid size-7 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onSetQuantity(item.id, item.quantity + 1)}
                      className="grid size-7 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      {formatPrice(item.price * item.quantity, currency)}
                    </p>
                    {item.quantity > 1 ? (
                      <p className="text-[11px] text-muted-foreground">
                        {formatPrice(item.price, currency)} each
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 ? (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(totals.subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{totals.freeShipping ? "Free" : formatPrice(totals.shipping, currency)}</span>
            </div>
            {settings.pixDiscountPercent > 0 ? (
              <div className="flex justify-between text-muted-foreground">
                <span>Pix discount ({settings.pixDiscountPercent}%)</span>
                <span>-{formatPrice(totals.discount, currency)}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between pt-1 text-base font-bold text-foreground">
              <span>Total</span>
              <span className="text-xl text-primary">{formatPrice(totals.total, currency)}</span>
            </div>
          </div>

          <Button className="w-full" onClick={onCheckout}>
            Checkout
          </Button>
          <Button variant="ghost" size="sm" className="w-full" onClick={onClear}>
            <Trash2 className="size-4" /> Clear cart
          </Button>
        </div>
      ) : null}
    </aside>
  );
}

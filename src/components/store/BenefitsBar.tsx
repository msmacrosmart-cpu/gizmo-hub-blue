import {
  CreditCard,
  Gift,
  Headphones,
  Lock,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { Benefit } from "@/lib/store";

export const benefitIcons: Record<string, LucideIcon> = {
  truck: Truck,
  returns: RotateCcw,
  shield: ShieldCheck,
  support: Headphones,
  gift: Gift,
  star: Star,
  zap: Zap,
  credit: CreditCard,
  lock: Lock,
  chat: MessageCircle,
};

export const benefitIconNames = Object.keys(benefitIcons);

export function BenefitIcon({ name, className }: { name: string; className?: string }) {
  const Icon = benefitIcons[name] ?? Star;
  return <Icon className={className} />;
}

interface BenefitsBarProps {
  benefits: Benefit[];
}

/**
 * Trust bar.
 * Mobile: 2 items per row (2 on top, 2 on the bottom) — desktop: a single row of 4.
 */
export function BenefitsBar({ benefits }: BenefitsBarProps) {
  if (!benefits.length) return null;

  return (
    <section className="border-b border-border bg-card" aria-label="Shopping benefits">
      <div className="mx-auto grid max-w-page grid-cols-2 gap-3 px-5 py-6 sm:gap-4 sm:px-8 lg:grid-cols-4 lg:gap-6 lg:px-10 lg:py-7">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-background/60 p-3 text-left lg:justify-center lg:border-0 lg:bg-transparent lg:p-0"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft">
              <BenefitIcon name={benefit.icon} className="size-[22px] text-primary" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-[13px] font-bold sm:text-sm lg:text-[15px]">
                {benefit.title}
              </h2>
              <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground sm:text-[13px]">
                {benefit.copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

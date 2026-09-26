import { Star } from "lucide-react";

interface BrandProps {
  name: string;
  variant?: "light" | "dark";
  onClick?: () => void;
  className?: string;
}

/** GizmoHub logo lockup used in the header, footer and admin panel. */
export function Brand({ name, variant = "light", onClick, className = "" }: BrandProps) {
  const label = variant === "light" ? "text-brand-light" : "text-foreground";
  const Component = onClick ? "button" : "div";
  return (
    <Component
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className={`flex min-w-0 items-center gap-2.5 text-[22px] font-bold ${label} ${className}`}
      aria-label={`${name} home`}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary">
        <Star className="size-[18px] text-primary-foreground" fill="currentColor" />
      </span>
      <span className="truncate">{name}</span>
    </Component>
  );
}

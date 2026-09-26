import { Star } from "lucide-react";

interface StarsProps {
  rating: number;
  reviews?: number;
  size?: number;
  className?: string;
}

/** Simple star rating used on product cards and in the quick view. */
export function Stars({ rating, reviews, size = 14, className = "" }: StarsProps) {
  const rounded = Math.round(rating);
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span
        className="flex items-center gap-0.5"
        aria-label={`${rating.toFixed(1)} out of 5 stars`}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={i < rounded ? "text-brand-blue-soft" : "text-muted-foreground/40"}
            fill={i < rounded ? "currentColor" : "none"}
          />
        ))}
      </span>
      <span className="text-xs text-muted-foreground">
        {rating.toFixed(1)}
        {typeof reviews === "number" && reviews > 0 ? ` (${reviews.toLocaleString("en-US")})` : ""}
      </span>
    </div>
  );
}

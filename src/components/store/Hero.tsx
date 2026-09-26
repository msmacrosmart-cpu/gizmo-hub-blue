import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { HeroSlide } from "@/lib/store";
import { sized } from "@/lib/store";

interface HeroProps {
  slides: HeroSlide[];
  autoplayMs: number;
  onNavigate: (id: string) => void;
}

/** Hero carousel: cross-fade between slides, autoplay + manual controls. */
export function Hero({ slides, autoplayMs, onNavigate }: HeroProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  useEffect(() => {
    setIndex(0);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || paused) return;
    const delay = Math.max(1500, autoplayMs || 5000);
    const timer = window.setTimeout(() => {
      setIndex((prev) => (prev + 1) % total);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [index, total, paused, autoplayMs]);

  if (!total) return null;

  const go = (next: number) => setIndex(((next % total) + total) % total);
  const active = slides[Math.min(index, total - 1)];

  return (
    <section
      id="hero"
      className="hero-surface relative overflow-hidden text-brand-light"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="mx-auto grid min-h-[590px] max-w-page items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:px-[60px] lg:py-20">
        {/* Copy — every slide fades in place, so the block never jumps height */}
        <div className="relative z-10 grid max-w-xl">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              aria-hidden={i !== index}
              className={`col-start-1 row-start-1 transition-opacity duration-700 ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {slide.eyebrow ? (
                <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.12em] text-brand-blue-soft">
                  {slide.eyebrow}
                </p>
              ) : null}
              <h1 className="whitespace-pre-line text-[40px] font-bold leading-[1.08] sm:text-5xl lg:text-[46px]">
                {slide.title}
              </h1>
              {slide.subtitle ? (
                <p className="mt-5 max-w-[480px] text-base leading-7 text-brand-muted sm:text-[17px]">
                  {slide.subtitle}
                </p>
              ) : null}
              <div className="mt-7 flex flex-wrap gap-3">
                <Button onClick={() => onNavigate(slide.ctaTarget || "catalog")}>
                  {slide.ctaLabel || "Explore Now"} <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline" onClick={() => onNavigate("deals")}>
                  View Deals
                </Button>
              </div>
              <div
                className="mt-7 flex items-center gap-2"
                aria-label={`Slide ${index + 1} of ${total}`}
              >
                {slides.map((slideDot, idx) => (
                  <button
                    key={slideDot.id}
                    type="button"
                    onClick={() => go(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-current={idx === index}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === index
                        ? "w-7 bg-primary"
                        : "w-2.5 bg-brand-light/30 hover:bg-brand-light/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Photo */}
        <div className="hero-photo relative z-10 h-[310px] overflow-hidden rounded-2xl sm:h-[380px]">
          {slides.map((slide, i) => (
            <img
              key={slide.id}
              className={`absolute h-full w-full object-cover transition-opacity duration-1000 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              src={sized(slide.image, 900, 1200)}
              alt={slide.title.replace(/\n/g, " ") || `GizmoHub slide ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-brand-dark/60 text-brand-light backdrop-blur transition-colors hover:bg-primary"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-brand-dark/60 text-brand-light backdrop-blur transition-colors hover:bg-primary"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}
          <span className="absolute bottom-3 left-3 z-10 rounded-full bg-brand-dark/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-light backdrop-blur">
            {index + 1} / {total}
          </span>
        </div>
      </div>
      <p className="sr-only">{active?.title}</p>
    </section>
  );
}

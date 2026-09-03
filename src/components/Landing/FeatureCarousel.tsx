"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LANDING_CAROUSEL_SLIDES } from "@/constants/nav.constants";
import { cn } from "@/lib/utils";

const AUTO_MS = 5500;

export function FeatureCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = LANDING_CAROUSEL_SLIDES.length;

  const go = useCallback(
    (next: number) => setIndex((next + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const prevIndex = (index - 1 + count) % count;
  const nextIndex = (index + 1) % count;

  return (
    <section
      id="carousel"
      className="carousel relative overflow-hidden border-t border-[#52ADFF]/15 py-14 sm:py-20 md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Interactive product carousel"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#52ADFF]/12 blur-[120px] sm:h-[28rem] sm:w-[28rem]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#52ADFF]/20 bg-white/80 px-3 py-1 font-mono text-[10px] font-semibold text-slate-600 shadow-sm sm:px-3.5 sm:text-xs">
            <span>INTERACTIVE CAROUSEL</span>
          </div>
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#1A1A1A] sm:text-4xl md:text-5xl">
            Walk the loop.{" "}
            <span className="landing-gradient-text">One stage at a time.</span>
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:mt-4 sm:text-base md:text-lg">
            Slide through how a raw list becomes a connected send — then a
            number you can grow from.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="carousel-nav absolute top-1/2 left-0 z-10 -translate-y-1/2 sm:static sm:translate-y-0"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-4 sm:size-5" />
            </button>

            <div className="grid w-full grid-cols-1 items-stretch gap-4 px-10 sm:px-0 md:grid-cols-[0.72fr_1fr_0.72fr]">
              <CarouselCard
                slide={LANDING_CAROUSEL_SLIDES[prevIndex]}
                dimmed
                className="hidden md:flex"
                onClick={() => go(prevIndex)}
              />
              <CarouselCard
                slide={LANDING_CAROUSEL_SLIDES[index]}
                active
              />
              <CarouselCard
                slide={LANDING_CAROUSEL_SLIDES[nextIndex]}
                dimmed
                className="hidden md:flex"
                onClick={() => go(nextIndex)}
              />
            </div>

            <button
              type="button"
              onClick={() => go(index + 1)}
              className="carousel-nav absolute top-1/2 right-0 z-10 -translate-y-1/2 sm:static sm:translate-y-0"
              aria-label="Next slide"
            >
              <ChevronRight className="size-4 sm:size-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 sm:mt-8">
          {LANDING_CAROUSEL_SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show ${slide.title}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index
                  ? "w-8 bg-[linear-gradient(90deg,#52ADFF,#20FFA3)]"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CarouselCard({
  slide,
  active = false,
  dimmed = false,
  className,
  onClick,
}: {
  slide: (typeof LANDING_CAROUSEL_SLIDES)[number];
  active?: boolean;
  dimmed?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const classes = cn(
    "flex min-h-[220px] flex-col rounded-2xl border p-5 text-left transition-all duration-500 sm:min-h-[280px] sm:p-6 md:p-8",
    active &&
      "border-[#52ADFF]/45 bg-white shadow-[0_0_40px_rgba(82,173,255,0.22)]",
    dimmed &&
      "cursor-pointer border-slate-200 bg-white/70 opacity-60 hover:opacity-90",
    className
  );

  const inner = (
    <>
      <p className="font-mono text-[10px] tracking-[0.18em] text-[#52ADFF] uppercase sm:text-[11px] sm:tracking-[0.22em]">
        {slide.step} · {slide.cue}
      </p>
      <h3
        className={cn(
          "font-heading mt-3 font-bold tracking-tight text-[#1A1A1A] sm:mt-4",
          active ? "text-xl sm:text-2xl md:text-3xl" : "text-lg sm:text-xl"
        )}
      >
        {slide.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 sm:mt-3 sm:text-base">
        {slide.body}
      </p>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {inner}
      </button>
    );
  }

  return <article className={classes}>{inner}</article>;
}

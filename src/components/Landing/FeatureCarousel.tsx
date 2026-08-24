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
      className="carousel relative overflow-hidden border-t border-white/5 py-20 md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Interactive product carousel"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/8 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 font-mono text-xs text-slate-300">
            <span>INTERACTIVE CAROUSEL</span>
          </div>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Walk the loop.{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              One stage at a time.
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-400 sm:text-lg">
            Slide through how a raw list becomes a connected send — then a
            number you can grow from.
          </p>
        </div>

        <div className="relative mx-auto flex max-w-5xl items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="carousel-nav"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="grid w-full grid-cols-1 items-stretch gap-4 md:grid-cols-[0.72fr_1fr_0.72fr]">
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
            className="carousel-nav"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {LANDING_CAROUSEL_SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show ${slide.title}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-8 bg-cyan-300" : "w-2.5 bg-white/30 hover:bg-white/50"
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
    "flex min-h-[280px] flex-col rounded-2xl border p-6 text-left transition-all duration-500 sm:p-8",
    active &&
      "border-cyan-400/50 bg-[#0C101D] shadow-[0_0_40px_rgba(56,189,248,0.18)]",
    dimmed &&
      "cursor-pointer border-white/8 bg-[#0C101D]/50 opacity-55 hover:opacity-80",
    className
  );

  const inner = (
    <>
      <p className="font-mono text-[11px] tracking-[0.22em] text-cyan-300/80 uppercase">
        {slide.step} · {slide.cue}
      </p>
      <h3
        className={cn(
          "font-heading mt-4 font-bold tracking-tight text-white",
          active ? "text-2xl sm:text-3xl" : "text-xl"
        )}
      >
        {slide.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400 sm:text-base">
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

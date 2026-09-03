"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PHILOSOPHY_SLIDES } from "@/constants/nav.constants";
import { cn } from "@/lib/utils";

const AUTO_MS = 7000;

function PhilosophyMark({
  kind,
}: {
  kind: (typeof PHILOSOPHY_SLIDES)[number]["mark"];
}) {
  return (
    <svg
      viewBox="0 0 72 72"
      className="size-12 text-[#52ADFF] sm:size-16 md:size-20"
      fill="none"
      aria-hidden
    >
      {kind === "add" ? (
        <circle cx="36" cy="36" r="7" fill="currentColor" />
      ) : null}
      {kind === "connect" ? (
        <>
          <line
            x1="22"
            y1="36"
            x2="50"
            y2="36"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.7"
          />
          <circle cx="20" cy="36" r="6" fill="#52ADFF" />
          <circle cx="52" cy="36" r="6" fill="#20FFA3" />
        </>
      ) : null}
      {kind === "grow" ? (
        <>
          <line x1="36" y1="22" x2="22" y2="48" stroke="#52ADFF" strokeWidth="1.75" />
          <line x1="36" y1="22" x2="50" y2="48" stroke="#3AD6C8" strokeWidth="1.75" />
          <line x1="22" y1="48" x2="50" y2="48" stroke="#20FFA3" strokeWidth="1.75" />
          <circle cx="36" cy="22" r="5.5" fill="#52ADFF" />
          <circle cx="22" cy="48" r="5.5" fill="#3AD6C8" />
          <circle cx="50" cy="48" r="5.5" fill="#20FFA3" />
        </>
      ) : null}
    </svg>
  );
}

export function BrandStory() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const slide = PHILOSOPHY_SLIDES[index];
  const count = PHILOSOPHY_SLIDES.length;

  const go = useCallback((next: number) => {
    setIndex((next + count) % count);
  }, [count]);

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  function onTouchStart(e: TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: TouchEvent) {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (dx > 56) prev();
    if (dx < -56) next();
  }

  return (
    <section
      id="brand-story"
      className="philosophy"
      aria-roledescription="carousel"
      aria-label="Brand philosophy"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="philosophy__track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {PHILOSOPHY_SLIDES.map((item, i) => (
          <div key={item.id} className="philosophy__slide" aria-hidden={i !== index}>
            <Image
              src={item.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={cn(
                "object-cover transition-transform duration-[7000ms] ease-out",
                i === index ? "scale-105" : "scale-100"
              )}
            />
          </div>
        ))}
      </div>

      <div className="philosophy__veil" aria-hidden />

      <div className="relative z-10 flex min-h-[min(100dvh,920px)] flex-col items-center justify-center px-4 py-24 sm:min-h-[100dvh] sm:px-6 sm:py-28 lg:px-8">
        <p className="mb-4 font-mono text-[10px] font-semibold tracking-[0.28em] text-[#52ADFF] uppercase sm:mb-6 sm:text-[11px]">
          Philosophy
        </p>

        <div className="mb-5 sm:mb-8">
          <PhilosophyMark kind={slide.mark} />
        </div>

        <p className="mb-2 font-mono text-[10px] tracking-[0.22em] text-white/70 uppercase sm:mb-3 sm:text-xs">
          {slide.kicker}
        </p>

        <h2 className="font-heading max-w-4xl px-1 text-center text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          {slide.title}
        </h2>
        <p className="landing-gradient-text mt-3 max-w-2xl px-1 text-center text-base font-medium sm:mt-4 sm:text-lg md:text-xl">
          {slide.statement}
        </p>
        <p className="mt-4 max-w-2xl px-1 text-center text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-base">
          {slide.body}
        </p>

        <p className="mt-8 max-w-xl px-2 text-center font-mono text-[10px] tracking-[0.14em] text-white/55 uppercase sm:mt-10 sm:text-[11px] sm:tracking-[0.18em]">
          Keep Adding. Keep Connecting. Keep Growing.
        </p>
      </div>

      <button
        type="button"
        onClick={prev}
        className="philosophy__nav philosophy__nav--prev"
        aria-label="Previous philosophy"
      >
        <ChevronLeft className="size-4 sm:size-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="philosophy__nav philosophy__nav--next"
        aria-label="Next philosophy"
      >
        <ChevronRight className="size-4 sm:size-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-8">
        {PHILOSOPHY_SLIDES.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${item.title}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index
                ? "w-8 bg-[linear-gradient(90deg,#52ADFF,#20FFA3)]"
                : "w-2.5 bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </section>
  );
}

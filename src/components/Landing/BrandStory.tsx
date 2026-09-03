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
      className="size-10 text-[#2A78F6] sm:size-12"
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
          <circle cx="20" cy="36" r="6" fill="#2A78F6" />
          <circle cx="52" cy="36" r="6" fill="#1A5FCC" />
        </>
      ) : null}
      {kind === "grow" ? (
        <>
          <line
            x1="36"
            y1="22"
            x2="22"
            y2="48"
            stroke="#2A78F6"
            strokeWidth="1.75"
          />
          <line
            x1="36"
            y1="22"
            x2="50"
            y2="48"
            stroke="#1A5FCC"
            strokeWidth="1.75"
          />
          <line
            x1="22"
            y1="48"
            x2="50"
            y2="48"
            stroke="#2A78F6"
            strokeWidth="1.75"
          />
          <circle cx="36" cy="22" r="5.5" fill="#2A78F6" />
          <circle cx="22" cy="48" r="5.5" fill="#1A5FCC" />
          <circle cx="50" cy="48" r="5.5" fill="#2A78F6" />
        </>
      ) : null}
    </svg>
  );
}

export function BrandStory() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = PHILOSOPHY_SLIDES.length;

  const go = useCallback(
    (next: number) => setIndex((next + count) % count),
    [count]
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      AUTO_MS
    );
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
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <p className="mb-3 inline-flex items-center rounded-full border border-[#2A78F6]/20 bg-[#2A78F6]/8 px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.22em] text-[#2A78F6] uppercase sm:text-[11px]">
            Philosophy
          </p>
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-black sm:text-4xl md:text-5xl">
            The loop behind{" "}
            <span className="text-[#2A78F6]">every lead.</span>
          </h2>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
          <div className="philosophy__frame">
            <div
              className="philosophy__track"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {PHILOSOPHY_SLIDES.map((item, i) => (
                <div
                  key={item.id}
                  className="philosophy__slide"
                  aria-hidden={i !== index}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className={cn(
                      "object-cover object-center transition-transform duration-[7000ms] ease-out",
                      i === index ? "scale-105" : "scale-100"
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="philosophy__veil" aria-hidden />

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
          </div>

          <div className="flex w-full flex-col items-start text-left">
            <div className="grid w-full">
              {PHILOSOPHY_SLIDES.map((item, i) => (
                <div
                  key={item.id}
                  aria-hidden={i !== index}
                  className={cn(
                    "col-start-1 row-start-1 flex flex-col items-start transition-opacity duration-300",
                    i === index
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  )}
                >
                  <div className="mb-4">
                    <PhilosophyMark kind={item.mark} />
                  </div>
                  <p className="mb-2 font-mono text-[10px] tracking-[0.22em] text-[#2A78F6] uppercase sm:text-xs">
                    {item.kicker}
                  </p>
                  <h3 className="font-heading text-3xl font-extrabold tracking-tight text-black sm:text-4xl md:text-5xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base font-medium text-[#2A78F6] sm:text-lg">
                    {item.statement}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 font-mono text-[10px] tracking-[0.14em] text-neutral-400 uppercase sm:text-[11px] sm:tracking-[0.18em]">
              Keep Adding. Keep Connecting. Keep Growing.
            </p>

            <div className="mt-8 flex items-center gap-2">
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
                      ? "w-8 bg-[#2A78F6]"
                      : "w-2.5 bg-neutral-300 hover:bg-neutral-400"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

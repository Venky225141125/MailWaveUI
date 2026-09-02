"use client";

import { useEffect, useState } from "react";
import { Cpu, Pause, Play } from "lucide-react";
import { HOW_IT_WORKS_STAGES } from "@/constants/nav.constants";
import { cn } from "@/lib/utils";

export function HowItWorks() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const stage = HOW_IT_WORKS_STAGES[activeStepIndex];
  const progress =
    ((activeStepIndex + 1) / HOW_IT_WORKS_STAGES.length) * 100;

  useEffect(() => {
    if (!isPlaying) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsPlaying(false);
      return;
    }
    const interval = window.setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % HOW_IT_WORKS_STAGES.length);
    }, 1800);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  return (
    <section
      id="how-it-works"
      className="pipeline relative overflow-hidden border-y border-[#52ADFF]/15 bg-white/60 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-[#52ADFF]/15 blur-[100px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-56 w-56 rounded-full bg-[#20FFA3]/12 blur-[90px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#52ADFF]/25 bg-[#52ADFF]/10 px-3.5 py-1 font-mono text-xs font-semibold text-[#4285F4]">
            <Cpu className="size-3.5" />
            <span>CONTINUOUS DATA CONDUIT</span>
          </div>

          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[#1A1A1A] sm:text-5xl">
            Automated pipeline from ingestion to{" "}
            <span className="landing-gradient-text">exponential reach.</span>
          </h2>

          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Watch individual leads transform along an intelligent data highway
            that scrubs, verifies, segments, and broadcasts automatically.
          </p>
        </div>

        <div className="mx-auto mb-8 flex max-w-5xl items-center justify-between rounded-xl border border-[#52ADFF]/20 bg-white/90 px-4 py-2 font-mono text-xs shadow-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="size-2 animate-ping rounded-full bg-[#52ADFF]" />
            <span>Active Conduit: {stage.name}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#52ADFF]/10 px-3 py-1 font-semibold text-slate-700 transition-colors hover:bg-[#52ADFF]/20"
          >
            {isPlaying ? (
              <Pause className="size-3.5" />
            ) : (
              <Play className="size-3.5" />
            )}
            <span>{isPlaying ? "Pause Pipeline" : "Resume Pipeline"}</span>
          </button>
        </div>

        <div className="mx-auto max-w-6xl overflow-x-auto pb-6">
          <div className="relative grid min-w-[760px] grid-cols-7 gap-2 rounded-2xl border border-[#52ADFF]/20 bg-white p-4 shadow-[0_20px_50px_-28px_rgba(66,133,244,0.4)]">
            <div className="pointer-events-none absolute top-1/2 right-8 left-8 z-0 h-1 -translate-y-1/2 bg-slate-100">
              <div
                className="h-full bg-[linear-gradient(90deg,#52ADFF,#20FFA3)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {HOW_IT_WORKS_STAGES.map((item, idx) => {
              const isCurrent = activeStepIndex === idx;
              const isPassed = activeStepIndex >= idx;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setIsPlaying(false);
                  }}
                  aria-current={isCurrent}
                  className={cn(
                    "relative z-10 flex cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all duration-300",
                    isCurrent &&
                      "scale-105 border-[#52ADFF] bg-[#F0F7FF] shadow-[0_0_25px_rgba(82,173,255,0.3)]",
                    !isCurrent &&
                      isPassed &&
                      "border-[#52ADFF]/30 bg-white text-slate-700",
                    !isCurrent &&
                      !isPassed &&
                      "border-slate-100 bg-slate-50/80 text-slate-400"
                  )}
                >
                  <div>
                    <div className="mb-1 font-mono text-[10px] tracking-wider text-[#52ADFF] uppercase">
                      {item.tag}
                    </div>
                    <div
                      className={cn(
                        "font-heading text-sm font-extrabold sm:text-base",
                        isCurrent && "text-[#1A1A1A]",
                        !isCurrent && isPassed && "text-slate-800",
                        !isCurrent && !isPassed && "text-slate-400"
                      )}
                    >
                      {item.name}
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] leading-tight text-slate-500">
                    {item.desc}
                  </div>

                  {isCurrent ? (
                    <span className="absolute -top-1.5 -right-1.5 size-3.5 rounded-full border-2 border-white bg-[#20FFA3] shadow-[0_0_8px_#20FFA3]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-2 max-w-3xl rounded-2xl border border-[#52ADFF]/20 bg-white/90 px-6 py-6 text-center shadow-sm backdrop-blur-sm sm:px-8">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#52ADFF] uppercase">
            {stage.tag}
          </p>
          <p className="font-heading mt-2 text-xl font-bold text-[#1A1A1A] sm:text-2xl">
            {stage.name}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {stage.detail}
          </p>
        </div>
      </div>
    </section>
  );
}

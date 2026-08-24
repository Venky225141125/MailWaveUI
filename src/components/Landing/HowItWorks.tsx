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
      className="pipeline relative overflow-hidden border-y border-white/5 bg-[#090C16] py-20 md:py-28"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3.5 py-1 font-mono text-xs text-cyan-300">
            <Cpu className="size-3.5" />
            <span>CONTINUOUS DATA CONDUIT</span>
          </div>

          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Automated pipeline from ingestion to{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              exponential reach.
            </span>
          </h2>

          <p className="mt-4 text-base text-slate-400 sm:text-lg">
            Watch individual leads transform along an intelligent data highway
            that scrubs, verifies, segments, and broadcasts automatically.
          </p>
        </div>

        <div className="mx-auto mb-8 flex max-w-5xl items-center justify-between rounded-xl border border-white/5 bg-slate-900/60 px-4 py-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="size-2 animate-ping rounded-full bg-cyan-400" />
            <span>Active Conduit: {stage.name}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            className="flex cursor-pointer items-center gap-1.5 rounded bg-white/5 px-3 py-1 text-slate-300 transition-colors hover:bg-white/10"
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
          <div className="relative grid min-w-[760px] grid-cols-7 gap-2 rounded-2xl border border-white/10 bg-[#0C101D] p-4 shadow-2xl">
            <div className="pointer-events-none absolute top-1/2 right-8 left-8 z-0 h-1 -translate-y-1/2 bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 transition-all duration-500"
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
                      "scale-105 border-cyan-400/80 bg-slate-900 shadow-[0_0_25px_rgba(56,189,248,0.25)]",
                    !isCurrent &&
                      isPassed &&
                      "border-cyan-500/30 bg-slate-950/80 text-slate-300",
                    !isCurrent &&
                      !isPassed &&
                      "border-white/5 bg-slate-950/40 text-slate-500"
                  )}
                >
                  <div>
                    <div className="mb-1 font-mono text-[10px] tracking-wider text-cyan-400 uppercase">
                      {item.tag}
                    </div>
                    <div
                      className={cn(
                        "font-heading text-sm font-extrabold sm:text-base",
                        isCurrent && "text-white",
                        !isCurrent && isPassed && "text-slate-200",
                        !isCurrent && !isPassed && "text-slate-500"
                      )}
                    >
                      {item.name}
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] leading-tight text-slate-400">
                    {item.desc}
                  </div>

                  {isCurrent ? (
                    <span className="absolute -top-1.5 -right-1.5 size-3.5 rounded-full border-2 border-[#0C101D] bg-cyan-400 shadow-[0_0_8px_#38BDF8]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-2 max-w-3xl rounded-2xl border border-white/8 bg-white/[0.03] px-6 py-6 text-center backdrop-blur-sm sm:px-8">
          <p className="font-mono text-[11px] tracking-[0.2em] text-cyan-300/80 uppercase">
            {stage.tag}
          </p>
          <p className="font-heading mt-2 text-xl font-bold text-white sm:text-2xl">
            {stage.name}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            {stage.detail}
          </p>
        </div>
      </div>
    </section>
  );
}

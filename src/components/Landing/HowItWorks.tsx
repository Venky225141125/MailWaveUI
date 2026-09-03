"use client";

import { useEffect, useState } from "react";
import { Cpu, Pause, Play } from "lucide-react";
import { HOW_IT_WORKS_STAGES } from "@/constants/nav.constants";
import { cn } from "@/lib/utils";

export function HowItWorks() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const stage = HOW_IT_WORKS_STAGES[activeStepIndex];
  const progress = ((activeStepIndex + 1) / HOW_IT_WORKS_STAGES.length) * 100;

  useEffect(() => {
    if (!isPlaying) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setIsPlaying(false); return; }
    const interval = window.setInterval(() => setActiveStepIndex((prev) => (prev + 1) % HOW_IT_WORKS_STAGES.length), 1800);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  return (
    <section id="how-it-works" className="pipeline relative overflow-hidden border-y border-black/5 bg-[#f8fafc] py-14 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute top-0 left-1/2 h-64 w-[min(100vw,40rem)] -translate-x-1/2 rounded-full bg-[#2A78F6]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12 md:mb-14">
          <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-[#2A78F6]/20 bg-[#2A78F6]/8 px-3 py-1 font-mono text-[10px] font-semibold text-[#2A78F6] sm:px-3.5 sm:text-xs">
            <Cpu className="size-3.5 shrink-0" />
            <span className="truncate">CONTINUOUS DATA CONDUIT</span>
          </div>

          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-black sm:text-4xl md:text-5xl">
            Automated pipeline from ingestion to{" "}
            <span className="text-[#2A78F6]">exponential reach.</span>
          </h2>

          <p className="mt-3 text-sm text-neutral-600 sm:mt-4 sm:text-base md:text-lg">
            Watch individual leads transform along an intelligent data highway
            that scrubs, verifies, segments, and broadcasts automatically.
          </p>
        </div>

        <div className="mx-auto mb-6 flex max-w-5xl flex-col gap-3 rounded-xl border border-black/6 bg-white px-3 py-3 font-mono text-xs shadow-sm sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-2">
          <div className="flex min-w-0 items-center gap-2 text-neutral-600">
            <span className="size-2 shrink-0 animate-ping rounded-full bg-[#2A78F6]" />
            <span className="truncate">Active Conduit: {stage.name}</span>
          </div>
          <button type="button" onClick={() => setIsPlaying((p) => !p)}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#2A78F6]/8 px-3 py-2 font-semibold text-black transition-colors hover:bg-[#2A78F6]/15 sm:w-auto sm:py-1">
            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            <span>{isPlaying ? "Pause Pipeline" : "Resume Pipeline"}</span>
          </button>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="pipeline-stages">
            <div className="pipeline-stages__rail" aria-hidden>
              <div className="h-full bg-[#2A78F6] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            {HOW_IT_WORKS_STAGES.map((item, idx) => {
              const isCurrent = activeStepIndex === idx;
              const isPassed = activeStepIndex >= idx;
              return (
                <button key={item.name} type="button"
                  onClick={() => { setActiveStepIndex(idx); setIsPlaying(false); }}
                  aria-current={isCurrent}
                  className={cn(
                    "relative z-10 flex min-h-[7.5rem] cursor-pointer flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-300 sm:min-h-[8.5rem] sm:p-4 xl:scale-100",
                    isCurrent && "border-[#2A78F6] bg-[#EEF4FF] shadow-[0_0_20px_rgba(42,120,246,0.2)] xl:scale-105",
                    !isCurrent && isPassed && "border-[#2A78F6]/25 bg-white text-neutral-700",
                    !isCurrent && !isPassed && "border-neutral-100 bg-white text-neutral-400 xl:bg-neutral-50/80"
                  )}>
                  <div>
                    <div className="mb-1 font-mono text-[10px] tracking-wider text-[#2A78F6] uppercase">{item.tag}</div>
                    <div className={cn("font-heading text-sm font-extrabold sm:text-base",
                      isCurrent && "text-black", !isCurrent && isPassed && "text-neutral-800", !isCurrent && !isPassed && "text-neutral-400")}>
                      {item.name}
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] leading-snug text-neutral-500 sm:leading-tight">{item.desc}</div>
                  {isCurrent ? <span className="absolute -top-1.5 -right-1.5 size-3.5 rounded-full border-2 border-white bg-[#2A78F6] shadow-[0_0_8px_#2A78F6]" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-black/6 bg-white px-4 py-5 text-center shadow-sm sm:mt-8 sm:px-8 sm:py-6">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#2A78F6] uppercase">{stage.tag}</p>
          <p className="font-heading mt-2 text-lg font-bold text-black sm:text-xl md:text-2xl">{stage.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">{stage.detail}</p>
        </div>
      </div>
    </section>
  );
}

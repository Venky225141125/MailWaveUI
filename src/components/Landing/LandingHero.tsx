"use client";

import {
  ArrowRight,
  CheckCircle2,
  Network,
  Sparkles,
  Zap,
} from "lucide-react";
import { ParticleHeroText } from "@/components/Landing/ParticleHeroText";
import { BRAND_NAME } from "@/constants/upload.constants";

interface LandingHeroProps {
  onOpenGetStarted: () => void;
  onOpenDemo: () => void;
}

export function LandingHero({
  onOpenGetStarted,
  onOpenDemo,
}: LandingHeroProps) {
  return (
    <section
      id="hero-section"
      className="bg-grid-subtle relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[350px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-500/15 via-indigo-600/10 to-purple-600/10 blur-[120px] sm:w-[900px]" />
      <div className="pointer-events-none absolute top-10 left-10 -z-10 size-72 rounded-full bg-cyan-500/5 blur-[90px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-900/80 px-3.5 py-1.5 font-mono text-xs text-cyan-300 shadow-sm backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan-500" />
            </span>
            <span className="font-semibold tracking-wide">
              {BRAND_NAME.toUpperCase()} 2.0
            </span>
          </div>
        </div>

        <div className="mb-4">
          <ParticleHeroText />
        </div>

        <div className="mx-auto mb-6 max-w-5xl text-center">
          <h1 className="font-heading text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              KEEP ADDING.
            </span>
            <span className="block bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              KEEP CONNECTING.
            </span>
            <span className="block bg-gradient-to-b from-indigo-200 via-purple-300 to-white bg-clip-text text-transparent">
              KEEP GROWING.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed font-normal text-slate-300 sm:text-xl md:text-2xl">
            Turn every lead into a connection. Build your network. Grow your
            reach.
            <span className="mt-2 block text-base font-light text-slate-400 sm:text-lg">
              Build, connect, and activate your lead database with a smarter
              email broadcasting and validation platform.
            </span>
          </p>
        </div>

        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onOpenGetStarted}
            className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.35)] transition-all hover:opacity-95 sm:w-auto"
          >
            <span>Start Building Your Network</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={onOpenDemo}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-4 text-base font-medium text-slate-200 transition-all hover:border-cyan-500/30 hover:bg-white/[0.08] sm:w-auto"
          >
            <Sparkles className="size-4 text-cyan-400" />
            <span>Interactive Platform Tour</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-slate-400 sm:gap-10 sm:text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>99.4% Validated Deliverability</span>
          </div>
          <div className="flex items-center gap-2">
            <Network className="size-4 text-cyan-400" />
            <span>Multi-Node Lead Deduplication</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-indigo-400" />
            <span>Sub-Second Broadcast Conduits</span>
          </div>
        </div>
      </div>
    </section>
  );
}

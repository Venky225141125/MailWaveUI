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
      className="bg-grid-subtle relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-36 md:pb-24"
    >
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[280px] w-[min(100vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2A78F6]/15 blur-[100px] sm:h-[380px] sm:w-[960px]" />
      <div className="pointer-events-none absolute top-16 right-[8%] -z-10 hidden size-64 rounded-full bg-[#2A78F6]/10 blur-[90px] sm:block" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex justify-center sm:mb-6">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#2A78F6]/20 bg-white px-3 py-1.5 font-mono text-[10px] shadow-sm sm:gap-2.5 sm:px-3.5 sm:text-xs">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#2A78F6] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#2A78F6]" />
            </span>
            <span className="truncate font-semibold tracking-wide text-[#2A78F6]">
              {BRAND_NAME.toUpperCase()} 2.0
            </span>
          </div>
        </div>

        <div className="mb-3 sm:mb-4">
          <ParticleHeroText />
        </div>

        <div className="mx-auto mb-6 max-w-5xl text-center">
          <h1 className="font-heading text-[1.85rem] leading-[1.08] font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block">KEEP ADDING.</span>
            <span className="block text-[#2A78F6]">KEEP CONNECTING.</span>
            <span className="block">KEEP GROWING.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-4xl text-base leading-relaxed text-neutral-600 sm:mt-6 sm:text-lg md:text-xl lg:text-2xl">
            Turn every lead into a connection. Build your network. Grow your reach.
            <span className="mt-2 block text-sm text-neutral-500 sm:text-base md:text-lg">
              Build, connect, and activate your lead database with a smarter
              email broadcasting and validation platform.
            </span>
          </p>
        </div>

        <div className="mb-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mb-12 sm:flex-row sm:items-center sm:gap-4">
          <button type="button" onClick={onOpenGetStarted} className="landing-btn-primary w-full sm:w-auto">
            <span className="text-center">Start Building Your Network</span>
            <ArrowRight className="size-4 shrink-0" />
          </button>
          <button type="button" onClick={onOpenDemo} className="landing-btn-secondary w-full sm:w-auto">
            <Sparkles className="size-4 shrink-0 text-[#2A78F6]" />
            <span className="text-center">Interactive Platform Tour</span>
          </button>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 font-mono text-xs text-neutral-500 sm:max-w-none sm:grid-cols-3 sm:gap-6 sm:text-sm lg:gap-10">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-black/5 bg-white px-3 py-2.5 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
            <CheckCircle2 className="size-4 shrink-0 text-[#2A78F6]" />
            <span className="text-left leading-snug">99.4% Validated Deliverability</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl border border-black/5 bg-white px-3 py-2.5 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
            <Network className="size-4 shrink-0 text-[#2A78F6]" />
            <span className="text-left leading-snug">Multi-Node Lead Deduplication</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl border border-black/5 bg-white px-3 py-2.5 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
            <Zap className="size-4 shrink-0 text-[#2A78F6]" />
            <span className="text-left leading-snug">Sub-Second Broadcast Conduits</span>
          </div>
        </div>
      </div>
    </section>
  );
}

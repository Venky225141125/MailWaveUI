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
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[380px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(82,173,255,0.28),rgba(32,255,163,0.12),transparent_70%)] blur-[80px] sm:w-[960px]" />
      <div className="pointer-events-none absolute top-16 right-[8%] -z-10 size-64 rounded-full bg-[#52ADFF]/15 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-10 left-[6%] -z-10 size-72 rounded-full bg-[#20FFA3]/12 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#52ADFF]/25 bg-white/80 px-3.5 py-1.5 font-mono text-xs text-[#1A1A1A] shadow-sm backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#52ADFF] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#52ADFF]" />
            </span>
            <span className="font-semibold tracking-wide text-[#4285F4]">
              {BRAND_NAME.toUpperCase()} 2.0
            </span>
          </div>
        </div>

        <div className="mb-4">
          <ParticleHeroText />
        </div>

        <div className="mx-auto mb-6 max-w-5xl text-center">
          <h1 className="font-heading text-4xl leading-[1.05] font-extrabold tracking-tight text-[#1A1A1A] sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block">KEEP ADDING.</span>
            <span className="landing-gradient-text block">KEEP CONNECTING.</span>
            <span className="block text-slate-700">KEEP GROWING.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed font-normal text-slate-600 sm:text-xl md:text-2xl">
            Turn every lead into a connection. Build your network. Grow your
            reach.
            <span className="mt-2 block text-base font-normal text-slate-500 sm:text-lg">
              Build, connect, and activate your lead database with a smarter
              email broadcasting and validation platform.
            </span>
          </p>
        </div>

        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onOpenGetStarted}
            className="landing-btn-primary w-full sm:w-auto"
          >
            <span>Start Building Your Network</span>
            <ArrowRight className="size-4" />
          </button>

          <button
            type="button"
            onClick={onOpenDemo}
            className="landing-btn-secondary w-full sm:w-auto"
          >
            <Sparkles className="size-4 text-[#52ADFF]" />
            <span>Interactive Platform Tour</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-slate-500 sm:gap-10 sm:text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-[#20FFA3]" />
            <span>99.4% Validated Deliverability</span>
          </div>
          <div className="flex items-center gap-2">
            <Network className="size-4 text-[#52ADFF]" />
            <span>Multi-Node Lead Deduplication</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-[#4285F4]" />
            <span>Sub-Second Broadcast Conduits</span>
          </div>
        </div>
      </div>
    </section>
  );
}

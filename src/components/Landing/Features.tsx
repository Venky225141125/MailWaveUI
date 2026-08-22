"use client";

import {
  BarChart3,
  Layers,
  Mail,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import { LANDING_FEATURES } from "@/constants/nav.constants";

const ICONS = {
  upload: Upload,
  shield: ShieldCheck,
  layers: Layers,
  mail: Mail,
  chart: BarChart3,
  users: Users,
} as const;

export function Features() {
  return (
    <section
      id="features"
      className="features relative overflow-hidden py-20 md:py-28"
    >
      <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-16 left-0 h-64 w-64 rounded-full bg-cyan-500/8 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 font-mono text-xs text-slate-300">
            <span className="size-1.5 rounded-full bg-cyan-400" />
            <span>PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Tools that add, connect,{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              and grow the network.
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-400 sm:text-lg">
            Integrate Leads is the loop in software: ingest lists, verify every
            inbox, join campaigns to people, and watch reach compound.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
}: {
  feature: (typeof LANDING_FEATURES)[number];
}) {
  const Icon = ICONS[feature.icon];

  return (
    <article className="feature-card group">
      <div className="feature-card__glow" aria-hidden />
      <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-300 transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/10 group-hover:shadow-[0_0_18px_rgba(56,189,248,0.35)]">
        <Icon className="size-5" />
      </div>
      <p className="font-mono text-[10px] tracking-[0.2em] text-cyan-300/80 uppercase">
        {feature.tag}
      </p>
      <h3 className="font-heading mt-2 text-lg font-bold tracking-tight text-white">
        {feature.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        {feature.body}
      </p>
    </article>
  );
}

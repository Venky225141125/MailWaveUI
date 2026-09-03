"use client";

import { BarChart3, Layers, Mail, ShieldCheck, Upload, Users } from "lucide-react";
import { LANDING_FEATURES } from "@/constants/nav.constants";

const ICONS = { upload: Upload, shield: ShieldCheck, layers: Layers, mail: Mail, chart: BarChart3, users: Users } as const;

export function Features() {
  return (
    <section id="features" className="features relative overflow-hidden py-14 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute right-0 bottom-0 h-56 w-56 rounded-full bg-[#2A78F6]/8 blur-[120px] sm:h-80 sm:w-80" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12 md:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2A78F6]/15 bg-white px-3 py-1 font-mono text-[10px] font-semibold text-neutral-600 shadow-sm sm:px-3.5 sm:text-xs">
            <span className="size-1.5 rounded-full bg-[#2A78F6]" />
            <span>PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-black sm:text-4xl md:text-5xl">
            Tools that add, connect,{" "}
            <span className="text-[#2A78F6]">and grow the network.</span>
          </h2>
          <p className="mt-3 text-sm text-neutral-600 sm:mt-4 sm:text-base md:text-lg">
            Integrate Leads is the loop in software: ingest lists, verify every
            inbox, join campaigns to people, and watch reach compound.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {LANDING_FEATURES.map((feature) => <FeatureCard key={feature.id} feature={feature} />)}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: (typeof LANDING_FEATURES)[number] }) {
  const Icon = ICONS[feature.icon];
  return (
    <article className="feature-card group">
      <div className="feature-card__glow" aria-hidden />
      <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl border border-[#2A78F6]/15 bg-[#2A78F6]/8 text-[#2A78F6] transition-all duration-300 group-hover:scale-110 group-hover:border-[#2A78F6]/35 group-hover:bg-[#2A78F6]/15 group-hover:shadow-[0_0_14px_rgba(42,120,246,0.25)] sm:mb-5 sm:size-11">
        <Icon className="size-5" />
      </div>
      <p className="font-mono text-[10px] tracking-[0.2em] text-[#2A78F6] uppercase">{feature.tag}</p>
      <h3 className="font-heading mt-2 text-base font-bold tracking-tight text-black sm:text-lg">{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:mt-3">{feature.body}</p>
    </article>
  );
}

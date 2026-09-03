"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LandingHero } from "@/components/Landing/LandingHero";
import { LandingHeroSplit } from "@/components/Landing/LandingHeroSplit";
import {
  LANDING_HERO_VARIANT,
  type LandingHeroVariant,
} from "@/constants/landing.constants";

interface LandingHeroSwitchProps {
  onOpenGetStarted: () => void;
  onOpenDemo: () => void;
}

function resolveVariant(raw: string | null): LandingHeroVariant {
  if (raw === "original" || raw === "split") return raw;
  return LANDING_HERO_VARIANT;
}

function LandingHeroByVariant({
  variant,
  onOpenGetStarted,
  onOpenDemo,
}: LandingHeroSwitchProps & { variant: LandingHeroVariant }) {
  if (variant === "split") {
    return (
      <LandingHeroSplit
        onOpenGetStarted={onOpenGetStarted}
        onOpenDemo={onOpenDemo}
      />
    );
  }

  return (
    <LandingHero onOpenGetStarted={onOpenGetStarted} onOpenDemo={onOpenDemo} />
  );
}

function LandingHeroWithQuery(props: LandingHeroSwitchProps) {
  const searchParams = useSearchParams();
  const variant = resolveVariant(searchParams.get("hero"));
  return <LandingHeroByVariant variant={variant} {...props} />;
}

export function LandingHeroSwitch(props: LandingHeroSwitchProps) {
  return (
    <Suspense
      fallback={
        <LandingHeroByVariant variant={LANDING_HERO_VARIANT} {...props} />
      }
    >
      <LandingHeroWithQuery {...props} />
    </Suspense>
  );
}

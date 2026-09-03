export type LandingHeroVariant = "original" | "split";

/**
 * Default landing hero. Switch to `"original"` to restore ParticleHero + static H1.
 * Override at runtime with `?hero=original` or `?hero=split` (no rebuild).
 */
export const LANDING_HERO_VARIANT: LandingHeroVariant = "split";

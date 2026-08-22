"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { LandingNavbar } from "@/components/Landing/LandingNavbar";
import { LandingHero } from "@/components/Landing/LandingHero";
import { BrandStory } from "@/components/Landing/BrandStory";
import { HowItWorks } from "@/components/Landing/HowItWorks";
import { Features } from "@/components/Landing/Features";
import { FeatureCarousel } from "@/components/Landing/FeatureCarousel";
// import { NetworkLab } from "@/components/Landing/NetworkLab";
import { LandingFooter } from "@/components/Landing/LandingFooter";
import { SignInRoleModal } from "@/components/Landing/SignInRoleModal";
import { ROUTES } from "@/constants/routes.constants";

export function LandingPage() {
  const router = useRouter();
  const [signInOpen, setSignInOpen] = useState(false);

  const openLogin = useCallback(() => setSignInOpen(true), []);
  const closeLogin = useCallback(() => setSignInOpen(false), []);
  const openGetStarted = useCallback(() => {
    router.push(ROUTES.register.client);
  }, [router]);

  const openDemo = useCallback(() => {
    const element = document.querySelector("#features");
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return (
    <div className="landing">
      <LandingNavbar
        onOpenLogin={openLogin}
        onOpenGetStarted={openGetStarted}
      />
      <main>
        <LandingHero
          onOpenGetStarted={openGetStarted}
          onOpenDemo={openDemo}
        />
        <BrandStory />
        <HowItWorks />
        <Features />
        <FeatureCarousel />
        {/* <NetworkLab /> */}
      </main>
      <LandingFooter
        onOpenLogin={openLogin}
        onOpenGetStarted={openGetStarted}
      />
      <SignInRoleModal open={signInOpen} onClose={closeLogin} />
    </div>
  );
}

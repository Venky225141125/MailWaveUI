import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE } from "@/constants/upload.constants";
import { ROUTES } from "@/constants/routes.constants";
import { LinkButton } from "@/components/shared/link-button";

export function LandingHero() {
  return (
    <div className="relative flex min-h-dvh flex-1 items-center justify-center overflow-hidden bg-[#f8fafc] px-4 py-10 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 15% 0%, rgb(37 99 235 / 0.1), transparent 55%),
            radial-gradient(ellipse 55% 40% at 95% 90%, rgb(6 182 212 / 0.08), transparent 50%)
          `,
        }}
      />

      <div className="relative w-full max-w-lg animate-[fade-up_0.55s_var(--ease-out)_both]">
        <div className="mb-7 text-center sm:mb-9">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-[#2563eb] text-sm font-bold tracking-tight text-white shadow-[0_8px_24px_rgb(37_99_235_/_0.35)]">
            MW
          </div>
          <p className="text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-4xl">
            {BRAND_NAME}
          </p>
          <p className="mt-2 text-sm font-medium text-[#2563eb] sm:text-base">
            {BRAND_TAGLINE}
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#64748b]">
            Upload email lists, validate every address before you send, then run
            campaigns against confirmed-good inboxes — with clear open and
            delivery metrics.
          </p>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-[var(--shadow-auth)] sm:p-8">
          <p className="text-sm font-semibold tracking-tight text-[#0f172a]">
            Sign in
          </p>
          <p className="mt-1 text-xs text-[#64748b]">
            Choose your workspace role to continue.
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:gap-3">
            <LinkButton href={ROUTES.login.superAdmin} className="w-full">
              Super Admin
            </LinkButton>
            <LinkButton
              href={ROUTES.login.client}
              variant="secondary"
              className="w-full"
            >
              Client
            </LinkButton>
            <LinkButton
              href={ROUTES.login.user}
              variant="secondary"
              className="w-full"
            >
              Team User
            </LinkButton>
          </div>

          <div className="mt-6 border-t border-[#e2e8f0] pt-5 text-center text-sm">
            <p className="text-[#64748b]">New here?</p>
            <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2">
              <Link
                href={ROUTES.register.client}
                className="font-medium text-[#2563eb] hover:text-[#1d4ed8]"
              >
                Register as Client
              </Link>
              <Link
                href={ROUTES.register.freelancer}
                className="font-medium text-[#2563eb] hover:text-[#1d4ed8]"
              >
                Register as Freelancer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

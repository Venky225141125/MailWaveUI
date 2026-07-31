import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE } from "@/constants/upload.constants";
import { ROUTES } from "@/constants/routes.constants";
import { LinkButton } from "@/components/ui/LinkButton";

export function LandingHero() {
  return (
    <div className="relative flex min-h-dvh flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--brand-muted)_0%,_transparent_55%),linear-gradient(180deg,_var(--surface-muted)_0%,_var(--surface)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-20 hidden h-72 w-72 rounded-full bg-[var(--brand)]/10 blur-3xl sm:block"
      />

      <div className="relative w-full max-w-lg">
        <div className="mb-6 text-center sm:mb-8">
          <p className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            {BRAND_NAME}
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
            {BRAND_TAGLINE}
          </p>
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-[var(--text-muted)] sm:mt-4 sm:text-sm">
            Upload email lists, validate every address before you send, then run
            campaigns against confirmed-good inboxes — with clear open and
            delivery metrics.
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-md)] sm:p-8">
          <p className="text-sm font-medium text-[var(--text)]">Sign in</p>
          <div className="mt-3 flex flex-col gap-2.5 sm:mt-4 sm:gap-3">
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

          <div className="mt-5 border-t border-[var(--border)] pt-4 text-center text-sm sm:mt-6">
            <p className="text-[var(--text-muted)]">New here?</p>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
              <Link
                href={ROUTES.register.client}
                className="font-medium text-[var(--brand)] hover:underline"
              >
                Register as Client
              </Link>
              <Link
                href={ROUTES.register.freelancer}
                className="font-medium text-[var(--brand)] hover:underline"
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

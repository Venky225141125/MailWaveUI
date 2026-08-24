import Link from "next/link";
import { BRAND_NAME } from "@/constants/upload.constants";
import { ROUTES } from "@/constants/routes.constants";
import { LinkButton } from "@/components/shared/link-button";

export default function NotFound() {
  return (
    <div className="auth-scene">
      <div className="auth-scene__bg" aria-hidden />
      <div className="auth-scene__blob auth-scene__blob--one" aria-hidden />
      <div className="auth-scene__blob auth-scene__blob--two" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-lg px-4 text-center">
        <p className="text-sm font-semibold tracking-wide text-[var(--brand)]">
          {BRAND_NAME}
        </p>
        <p
          className="mt-4 bg-gradient-to-br from-[var(--brand)] to-[var(--info)] bg-clip-text text-8xl font-bold tracking-tighter text-transparent"
          aria-hidden
        >
          404
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
          This page drifted out of the inbox
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
          The link you followed doesn&apos;t match any route in Integrated Leads. It may
          have been moved, or the address could have a typo.
        </p>

        <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <LinkButton href={ROUTES.home} className="w-full sm:w-auto">
            Back to home
          </LinkButton>
          <Link
            href={ROUTES.login.client}
            className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-muted)]"
          >
            Client login
          </Link>
        </div>

        <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-3 text-left">
          {[
            { label: "Validate", hint: "Clean lists first" },
            { label: "Campaign", hint: "Send with confidence" },
            { label: "Measure", hint: "Track every open" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-3 shadow-[var(--shadow-sm)] backdrop-blur"
            >
              <p className="text-xs font-semibold text-[var(--text)]">
                {item.label}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                {item.hint}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

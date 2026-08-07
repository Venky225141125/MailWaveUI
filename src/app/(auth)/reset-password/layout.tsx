import Link from "next/link";
import { BRAND_NAME } from "@/constants/upload.constants";
import { ROUTES } from "@/constants/routes.constants";

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-scene">
      <div className="auth-scene__bg" aria-hidden />
      <div className="auth-scene__blob auth-scene__blob--one" aria-hidden />
      <div className="auth-scene__blob auth-scene__blob--two" aria-hidden />

      <div className="auth-scene__inner">
        <div className="auth-scene__topbar">
          <Link
            href={ROUTES.home}
            className="font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            ← Back to home
          </Link>
          <span className="font-semibold tracking-tight text-[var(--text)]">
            {BRAND_NAME}
          </span>
        </div>
        <div className="auth-card">{children}</div>
      </div>
    </div>
  );
}

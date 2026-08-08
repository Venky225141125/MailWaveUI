import Link from "next/link";
import { BRAND_NAME } from "@/constants/upload.constants";
import { ROUTES } from "@/constants/routes.constants";
import { AuthLink } from "@/components/Auth/LoginForm";

interface RegisterSplitLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  highlights: Array<{ title: string; body: string }>;
  footerNote: React.ReactNode;
  children: React.ReactNode;
}

export function RegisterSplitLayout({
  eyebrow,
  title,
  description,
  highlights,
  footerNote,
  children,
}: RegisterSplitLayoutProps) {
  return (
    <div className="register-split">
      <aside className="register-split__context" aria-label="Registration overview">
        <div className="register-split__context-inner">
          <Link href={ROUTES.home} className="register-split__brand">
            {BRAND_NAME}
          </Link>
          <p className="register-split__eyebrow">{eyebrow}</p>
          <h1 className="register-split__title">{title}</h1>
          <p className="register-split__desc">{description}</p>

          <ul className="register-split__highlights">
            {highlights.map((item) => (
              <li key={item.title}>
                <span className="register-split__bullet" aria-hidden />
                <div>
                  <p className="register-split__highlight-title">{item.title}</p>
                  <p className="register-split__highlight-body">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="register-split__context-footer">{footerNote}</p>
        </div>
      </aside>

      <section className="register-split__form-pane">
        <div className="register-split__form-scroll">
          <div className="register-split__form-card !p-6">
            <div className="register-split__mobile-bar">
              <Link href={ROUTES.home} className="register-split__back">
                ← Home
              </Link>
              <span className="register-split__form-brand">{BRAND_NAME}</span>
            </div>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}

export function RegisterLoginHint({ light = false }: { light?: boolean }) {
  return (
    <>
      Already have an account?{" "}
      <AuthLink
        href={ROUTES.login.client}
        className={light ? "!text-[#5eead4]" : ""}
      >
        Log in
      </AuthLink>
    </>
  );
}

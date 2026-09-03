"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  MessageSquare,
  Send,
} from "lucide-react";
import { BRAND_NAME } from "@/constants/upload.constants";
import { cn } from "@/lib/utils";

const INTEREST_OPTIONS = [
  "General inquiry",
  "Product demo",
  "Partnership",
  "Support",
  "Other",
] as const;

type FormState = {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  name: "",
  email: "",
  company: "",
  interest: "General inquiry",
  message: "",
};

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.message.trim()) {
    errors.message = "Tell us how we can help.";
  } else if (values.message.trim().length < 12) {
    errors.message = "Message should be at least a short sentence.";
  }
  return errors;
}

export function ContactUs() {
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    // UI-only submit until a contact API is wired
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setSubmitting(false);
    setSent(true);
  }

  function handleReset() {
    setValues(INITIAL);
    setErrors({});
    setSent(false);
  }

  return (
    <section
      id="contact"
      className="contact relative overflow-hidden border-t border-black/5 py-14 sm:py-20 md:py-28"
    >
      <div className="pointer-events-none absolute top-10 right-0 h-64 w-64 rounded-full bg-[#2A78F6]/8 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#2A78F6]/6 blur-[90px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2A78F6]/20 bg-[#2A78F6]/8 px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.2em] text-[#2A78F6] uppercase sm:px-3.5 sm:text-xs">
            <MessageSquare className="size-3.5" />
            <span>Contact Us</span>
          </div>
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-black sm:text-4xl md:text-5xl">
            Let&apos;s grow your network{" "}
            <span className="text-[#2A78F6]">together.</span>
          </h2>
          <p className="mt-3 text-sm text-neutral-600 sm:mt-4 sm:text-base md:text-lg">
            Have a question about {BRAND_NAME}, need a demo, or want to talk
            partnership? Send a note — we&apos;ll get back to you.
          </p>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <aside className="contact__aside flex flex-col justify-between rounded-2xl border border-[#2A78F6]/15 bg-[#2A78F6] p-6 text-white sm:p-8">
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] text-white/70 uppercase">
                Get in touch
              </p>
              <h3 className="font-heading mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                We&apos;re here when you&apos;re ready to add the next lead.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
                Share a bit about your team and goals. Our team will reply with
                the next best step — demo, onboarding, or a direct answer.
              </p>
            </div>

            <ul className="mt-8 flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Phone className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">
                    Phone
                  </p>
                  <a
                    href="tel:+919491489066"
                    className="mt-0.5 block text-sm font-medium transition-opacity hover:opacity-90"
                  >
                    +91 – 9491489066
                  </a>
                  <a
                    href="tel:+19434709703"
                    className="mt-0.5 block text-sm font-medium transition-opacity hover:opacity-90"
                  >
                    +1 943-470-9703
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">
                    Address
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed font-medium">
                    MIG 2 - Door No 554, Road No 1,
                    <br />
                    KPHB Colony, Hyderabad
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Clock3 className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">
                    Response time
                  </p>
                  <p className="mt-0.5 text-sm font-medium">
                    Usually within 1 business day
                  </p>
                </div>
              </li>
            </ul>
          </aside>

          <div className="contact__form-card rounded-2xl border border-black/6 bg-white p-5 shadow-[0_12px_40px_-20px_rgba(42,120,246,0.25)] sm:p-8">
            {sent ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-[#2A78F6]/10 text-[#2A78F6]">
                  <CheckCircle2 className="size-7" />
                </span>
                <h3 className="font-heading mt-5 text-2xl font-bold text-black">
                  Message sent
                </h3>
                <p className="mt-2 max-w-sm text-sm text-neutral-600">
                  Thanks for reaching out. We&apos;ve received your note and
                  will reply soon.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="landing-btn-secondary mt-6"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    htmlFor="contact-name"
                    error={errors.name}
                  >
                    <input
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Jane Doe"
                      className={cn("contact-input", errors.name && "contact-input--error")}
                      aria-invalid={Boolean(errors.name)}
                    />
                  </Field>
                  <Field
                    label="Work email"
                    htmlFor="contact-email"
                    error={errors.email}
                  >
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="jane@company.com"
                      className={cn("contact-input", errors.email && "contact-input--error")}
                      aria-invalid={Boolean(errors.email)}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Company" htmlFor="contact-company">
                    <input
                      id="contact-company"
                      name="company"
                      autoComplete="organization"
                      value={values.company}
                      onChange={(e) => update("company", e.target.value)}
                      placeholder="Optional"
                      className="contact-input"
                    />
                  </Field>
                  <Field label="I'm interested in" htmlFor="contact-interest">
                    <select
                      id="contact-interest"
                      name="interest"
                      value={values.interest}
                      onChange={(e) => update("interest", e.target.value)}
                      className="contact-input contact-select"
                    >
                      {INTEREST_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field
                  label="Message"
                  htmlFor="contact-message"
                  error={errors.message}
                >
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us about your team, volume, or what you want to achieve…"
                    className={cn(
                      "contact-input contact-textarea",
                      errors.message && "contact-input--error"
                    )}
                    aria-invalid={Boolean(errors.message)}
                  />
                </Field>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-neutral-500">
                    By submitting, you agree we may reply about {BRAND_NAME}{" "}
                    products and services.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="landing-btn-primary w-full shrink-0 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    <span>{submitting ? "Sending…" : "Send message"}</span>
                    <Send className="size-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold tracking-wide text-black"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

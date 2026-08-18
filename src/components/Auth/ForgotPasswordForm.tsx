"use client";

import { useState } from "react";
import { forgotPassword } from "@/services/authService";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { toastApiError, toastSuccess } from "@/lib/helpers";

const GENERIC_CONFIRMATION =
  "If an account exists for that email, we've sent a password reset link.";

interface ForgotPasswordFormProps {
  title: string;
  description?: string;
  footer?: React.ReactNode;
}

export function ForgotPasswordForm({
  title,
  description,
  footer,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSubmitted(true);
      toastSuccess("Check your email", GENERIC_CONFIRMATION);
    } catch (err) {
      toastApiError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="auth-card__title">{title}</h1>
      {description ? <p className="auth-card__desc">{description}</p> : null}
      {submitted ? (
        <p className="auth-card__desc mt-3">{GENERIC_CONFIRMATION}</p>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      {footer ? <div className="auth-card__footer">{footer}</div> : null}
    </div>
  );
}

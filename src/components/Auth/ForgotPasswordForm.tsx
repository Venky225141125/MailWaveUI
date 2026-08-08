"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import { forgotPassword } from "@/services/authService";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      // Even on a backend error we don't want to leak whether the email exists via a
      // different message, but a genuine network/server failure is still worth surfacing.
      setError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="auth-card__title">{title}</h1>
      {description ? <p className="auth-card__desc">{description}</p> : null}
      {submitted ? (
        <Alert tone="success" message={GENERIC_CONFIRMATION} />
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <Alert message={error} />
          <Input
            label="Email"
            type="email"
            required
            autoComplete="email"
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

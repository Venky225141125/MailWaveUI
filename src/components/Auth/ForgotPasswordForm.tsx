"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import { forgotPassword } from "@/services/authService";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";
import { FORM_PLACEHOLDERS } from "@/constants/form-placeholders.constants";
import { toastError, toastSuccess } from "@/lib/helpers/toast.utils";

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
      toastSuccess(GENERIC_CONFIRMATION);
    } catch (err) {
      // Even on a backend error we don't want to leak whether the email exists via a
      // different message, but a genuine network/server failure is still worth surfacing.
      toastError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="auth-card__title">{title}</h1>
      {description ? <p className="auth-card__desc">{description}</p> : null}
      {submitted ? (
        <p className="text-sm text-muted-foreground">{GENERIC_CONFIRMATION}</p>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={FORM_PLACEHOLDERS.auth.email}
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

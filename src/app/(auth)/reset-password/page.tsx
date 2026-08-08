"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api";
import { resetPassword } from "@/services/authService";
import { AuthLink } from "@/components/Auth/LoginForm";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";
import { ROUTES } from "@/constants/routes.constants";

function ResetPasswordContent() {
  const token = useSearchParams().get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      await resetPassword({ token, newPassword, confirmPassword });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div>
        <h1 className="auth-card__title">Invalid reset link</h1>
        <Alert
          message="This password reset link is missing its token. Please request a new one from the login page."
        />
        <div className="auth-card__footer">
          <AuthLink href={ROUTES.home}>← Back to home</AuthLink>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <h1 className="auth-card__title">Password reset</h1>
        <Alert tone="success" message="Your password has been reset. You can now log in." />
        <div className="auth-card__footer">
          <AuthLink href={ROUTES.home}>← Back to home</AuthLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="auth-card__title">Set a new password</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <Alert message={error} />
        <Input
          label="New password"
          type="password"
          required
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Confirm new password"
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Resetting…" : "Reset password"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}

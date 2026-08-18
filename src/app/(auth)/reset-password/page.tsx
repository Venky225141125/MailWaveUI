"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLink } from "@/components/Auth/LoginForm";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { ROUTES } from "@/constants/routes.constants";
import { toastApiError, toastError, toastSuccess } from "@/lib/helpers";
import { resetPassword } from "@/services/authService";

function ResetPasswordContent() {
  const token = useSearchParams().get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      toastError(
        "Invalid reset link",
        "This password reset link is missing its token. Please request a new one."
      );
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      await resetPassword({ token, newPassword, confirmPassword });
      setDone(true);
      toastSuccess("Password reset", "You can now log in with your new password.");
    } catch (err) {
      toastApiError(err);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div>
        <h1 className="auth-card__title">Invalid reset link</h1>
        <p className="auth-card__desc">
          This password reset link is missing its token. Please request a new
          one from the login page.
        </p>
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
        <p className="auth-card__desc">
          Your password has been reset. You can now log in.
        </p>
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
        <Input
          label="New password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Confirm new password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Re-enter your new password"
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

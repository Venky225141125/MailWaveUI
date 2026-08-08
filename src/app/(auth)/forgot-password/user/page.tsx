"use client";

import { ForgotPasswordForm } from "@/components/Auth/ForgotPasswordForm";
import { AuthLink } from "@/components/Auth/LoginForm";
import { ROUTES } from "@/constants/routes.constants";

export default function UserForgotPasswordPage() {
  return (
    <ForgotPasswordForm
      title="Reset your password"
      description="Team member accounts."
      footer={<AuthLink href={ROUTES.login.user}>← Back to sign in</AuthLink>}
    />
  );
}

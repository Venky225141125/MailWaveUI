"use client";

import { ForgotPasswordForm } from "@/components/Auth/ForgotPasswordForm";
import { AuthLink } from "@/components/Auth/LoginForm";
import { ROUTES } from "@/constants/routes.constants";

export default function SuperAdminForgotPasswordPage() {
  return (
    <ForgotPasswordForm
      title="Reset Super Admin password"
      footer={<AuthLink href={ROUTES.login.superAdmin}>← Back to sign in</AuthLink>}
    />
  );
}

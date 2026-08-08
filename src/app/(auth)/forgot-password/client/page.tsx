"use client";

import { ForgotPasswordForm } from "@/components/Auth/ForgotPasswordForm";
import { AuthLink } from "@/components/Auth/LoginForm";
import { ROUTES } from "@/constants/routes.constants";

export default function ClientForgotPasswordPage() {
  return (
    <ForgotPasswordForm
      title="Reset Client password"
      description="For organizations and approved freelancers."
      footer={<AuthLink href={ROUTES.login.client}>← Back to sign in</AuthLink>}
    />
  );
}

"use client";

import { LoginForm, AuthLink } from "@/components/Auth/LoginForm";
import { loginClient } from "@/services/authService";
import { CLIENT_LOGIN_ERROR_COPY } from "@/constants/error-messages.constants";
import { ROUTES } from "@/constants/routes.constants";

export default function ClientLoginPage() {
  return (
    <LoginForm
      title="Client Login"
      description="For organizations and approved freelancers."
      identifierLabel="Email"
      identifierType="email"
      identifierName="email"
      errorCopy={CLIENT_LOGIN_ERROR_COPY}
      onLogin={(email, password) => loginClient({ email, password })}
      footer={
        <>
          <div className="text-gray-400">Don't have an account?{" "}</div>
          <AuthLink href={ROUTES.register.client}>Register as Client</AuthLink>{" "}
          or{" "}
          <AuthLink href={ROUTES.register.freelancer}>
            Register as Freelancer
          </AuthLink>
        </>
      }
    />
  );
}

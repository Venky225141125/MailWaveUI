"use client";

import { LoginForm, AuthLink } from "@/components/Auth/LoginForm";
import { loginUser } from "@/services/authService";
import { ROUTES } from "@/constants/routes.constants";

export default function UserLoginPage() {
  return (
    <LoginForm
      title="User Login"
      description="Team member accounts are created by your Client admin."
      identifierLabel="Email"
      identifierType="email"
      identifierName="email"
      onLogin={(email, password) => loginUser({ email, password })}
      footer={
        <>
          Looking for Client access?{" "}
          <AuthLink href={ROUTES.login.client}>Client Login</AuthLink>
        </>
      }
    />
  );
}

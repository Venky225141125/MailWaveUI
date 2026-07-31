"use client";

import { LoginForm, AuthLink } from "@/components/Auth/LoginForm";
import { loginSuperAdmin } from "@/services/authService";
import { ROUTES } from "@/constants/routes.constants";

export default function SuperAdminLoginPage() {
  return (
    <LoginForm
      title="Super Admin Login"
      identifierLabel="Username or email"
      identifierName="username"
      onLogin={(usernameOrEmail, password) =>
        loginSuperAdmin({ usernameOrEmail, password })
      }
      footer={
        <>
          Platform operator access only.{" "}
          <AuthLink href={ROUTES.home}>Return home</AuthLink>
        </>
      }
    />
  );
}

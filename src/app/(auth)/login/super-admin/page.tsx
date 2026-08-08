"use client";

import { LoginForm, AuthLink } from "@/components/Auth/LoginForm";
import { loginSuperAdmin, resendOtp, verifyOtp } from "@/services/authService";
import { ROUTES } from "@/constants/routes.constants";

export default function SuperAdminLoginPage() {
  return (
    <LoginForm
      title="Super Admin Login"
      identifierLabel="Username or email"
      identifierName="username"
      forgotPasswordHref={ROUTES.forgotPassword.superAdmin}
      onLogin={(usernameOrEmail, password) =>
        loginSuperAdmin({ usernameOrEmail, password })
      }
      onVerifyOtp={(challengeToken, code) => verifyOtp({ challengeToken, code })}
      onResendOtp={(challengeToken) => resendOtp({ challengeToken })}
      footer={
        <>
          Platform operator access only.{" "}
          <AuthLink href={ROUTES.home}>Return home</AuthLink>
        </>
      }
    />
  );
}

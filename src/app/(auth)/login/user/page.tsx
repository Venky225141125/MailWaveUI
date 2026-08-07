"use client";

import { LoginForm, AuthLink } from "@/components/Auth/LoginForm";
import { loginUser, resendOtp, verifyOtp } from "@/services/authService";
import { ROUTES } from "@/constants/routes.constants";

export default function UserLoginPage() {
  return (
    <LoginForm
      title="User Login"
      description="Team member accounts are created by your Client admin."
      identifierLabel="Email"
      identifierType="email"
      identifierName="email"
      forgotPasswordHref={ROUTES.forgotPassword.user}
      onLogin={(email, password) => loginUser({ email, password })}
      onVerifyOtp={(challengeToken, code) => verifyOtp({ challengeToken, code })}
      onResendOtp={(challengeToken) => resendOtp({ challengeToken })}
      footer={
        <>
          Looking for Client access?{" "}
          <AuthLink href={ROUTES.login.client}>Client Login</AuthLink>
        </>
      }
    />
  );
}

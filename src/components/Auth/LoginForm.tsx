"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { setSession, roleHomePath } from "@/lib/auth";
import type { AuthResponse, OtpChallengeResponse } from "@/types";
import { Alert } from "@/components/shared/alert";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

const RESEND_COOLDOWN_SECONDS = 30;

interface LoginFormProps {
  title: string;
  description?: string;
  identifierLabel: string;
  identifierType?: "email" | "text";
  identifierName: "email" | "username";
  submitLabel?: string;
  footer?: React.ReactNode;
  errorCopy?: Record<string, string>;
  forgotPasswordHref?: string;
  onLogin: (identifier: string, password: string) => Promise<OtpChallengeResponse>;
  onVerifyOtp: (challengeToken: string, code: string) => Promise<AuthResponse>;
  onResendOtp?: (challengeToken: string) => Promise<OtpChallengeResponse>;
}

export function LoginForm({
  title,
  description,
  identifierLabel,
  identifierType = "text",
  identifierName,
  submitLabel = "Sign in",
  footer,
  errorCopy,
  forgotPasswordHref,
  onLogin,
  onVerifyOtp,
  onResendOtp,
}: LoginFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [challenge, setChallenge] = useState<OtpChallengeResponse | null>(null);
  const [code, setCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await onLogin(identifier, password);
      setChallenge(result);
      setCode("");
      setOtpError(null);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setStep("otp");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(errorCopy?.[err.errorCode] ?? err.message);
      } else {
        setError(GENERIC_ERROR);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!challenge) return;
    setOtpError(null);
    setOtpLoading(true);
    try {
      const auth = await onVerifyOtp(challenge.challengeToken, code);
      setSession(auth);
      router.push(roleHomePath(auth.role));
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleResend() {
    if (!challenge || !onResendOtp || cooldown > 0) return;
    setOtpError(null);
    setResendLoading(true);
    try {
      const result = await onResendOtp(challenge.challengeToken);
      setChallenge(result);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setResendLoading(false);
    }
  }

  function handleBack() {
    setStep("credentials");
    setChallenge(null);
    setCode("");
    setOtpError(null);
  }

  if (step === "otp" && challenge) {
    return (
      <div>
        <h1 className="auth-card__title">Enter verification code</h1>
        <p className="auth-card__desc">
          We sent a 6-digit code to {challenge.maskedEmail}
        </p>
        <form onSubmit={handleOtpSubmit} className="auth-form">
          <Alert message={otpError} />
          <Input
            label="Verification code"
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          />
          <Button type="submit" disabled={otpLoading || code.length !== 6} className="w-full">
            {otpLoading ? "Verifying…" : "Verify & Sign in"}
          </Button>
        </form>
        <div className="auth-card__footer flex flex-col gap-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resendLoading || !onResendOtp}
            className="font-medium text-[var(--brand)] transition-colors hover:underline disabled:opacity-60 disabled:hover:no-underline"
          >
            {resendLoading
              ? "Resending…"
              : cooldown > 0
                ? `Resend code (${cooldown}s)`
                : "Resend code"}
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="font-medium text-[var(--text-muted)] transition-colors hover:underline"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="auth-card__title">{title}</h1>
      {description ? (
        <p className="auth-card__desc">{description}</p>
      ) : null}
      <form onSubmit={handleCredentialsSubmit} className="auth-form">
        <Alert message={error} />
        <Input
          label={identifierLabel}
          type={identifierType}
          name={identifierName}
          required
          autoComplete={identifierName === "email" ? "email" : "username"}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {forgotPasswordHref ? (
          <Link
            href={forgotPasswordHref}
            className="self-end text-xs font-medium text-[var(--brand)] hover:underline"
          >
            Forgot password?
          </Link>
        ) : null}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in…" : submitLabel}
        </Button>
      </form>
      {footer ? <div className="auth-card__footer">{footer}</div> : null}
    </div>
  );
}

export function AuthLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`font-medium text-[var(--brand)] transition-colors hover:underline ${className}`}
    >
      {children}
    </Link>
  );
}

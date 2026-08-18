"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ApiError } from "@/lib/api";
import { setSession, roleHomePath } from "@/lib/auth";
import type { AuthResponse, OtpChallengeResponse } from "@/types";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toastApiError, toastError, toastInfo, toastSuccess } from "@/lib/helpers";
import { cn } from "@/lib/utils";

const RESEND_COOLDOWN_SECONDS = 30;

interface LoginFormProps {
  title: string;
  description?: string;
  identifierLabel: string;
  identifierType?: "email" | "text";
  identifierName: "email" | "username";
  identifierPlaceholder?: string;
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
  identifierPlaceholder,
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
  const [loading, setLoading] = useState(false);

  const [challenge, setChallenge] = useState<OtpChallengeResponse | null>(null);
  const [code, setCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpInvalid, setOtpInvalid] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const verifyingRef = useRef(false);

  const resolvedPlaceholder =
    identifierPlaceholder ??
    (identifierType === "email"
      ? "you@company.com"
      : "username or you@company.com");

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await onLogin(identifier, password);
      setChallenge(result);
      setCode("");
      setOtpInvalid(false);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setStep("otp");
      toastInfo("Check your inbox", `We sent a 6-digit code to ${result.maskedEmail}`);
    } catch (err) {
      if (err instanceof ApiError) {
        toastError(errorCopy?.[err.errorCode] ?? err.message);
      } else {
        toastApiError(err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtpCode(nextCode: string) {
    if (!challenge || nextCode.length !== 6 || verifyingRef.current) return;
    verifyingRef.current = true;
    setOtpLoading(true);
    setOtpInvalid(false);
    try {
      const auth = await onVerifyOtp(challenge.challengeToken, nextCode);
      setSession({
        token: auth.token,
        role: auth.role,
        id: auth.id,
        username: auth.username,
        status: auth.status ?? "ACTIVE",
      });
      toastSuccess("Welcome back");
      router.push(roleHomePath(auth.role));
    } catch (err) {
      verifyingRef.current = false;
      setOtpInvalid(true);
      setCode("");
      toastApiError(err);
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    await verifyOtpCode(code);
  }

  async function handleResend() {
    if (!challenge || !onResendOtp || cooldown > 0) return;
    setResendLoading(true);
    try {
      const result = await onResendOtp(challenge.challengeToken);
      setChallenge(result);
      setCode("");
      setOtpInvalid(false);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      toastSuccess("Code resent", `A new code was sent to ${result.maskedEmail}`);
    } catch (err) {
      toastApiError(err);
    } finally {
      setResendLoading(false);
    }
  }

  function handleBack() {
    setStep("credentials");
    setChallenge(null);
    setCode("");
    setOtpInvalid(false);
    verifyingRef.current = false;
  }

  if (step === "otp" && challenge) {
    return (
      <div>
        <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mail className="size-5" />
        </div>
        <h1 className="auth-card__title">Check your email</h1>
        <p className="auth-card__desc">
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-foreground">{challenge.maskedEmail}</span>
        </p>
        <form onSubmit={handleOtpSubmit} className="auth-form">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="otp-code">Verification code</Label>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || resendLoading || !onResendOtp || otpLoading}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:underline disabled:pointer-events-none disabled:opacity-50"
              >
                <RefreshCw className={cn("size-3.5", resendLoading && "animate-spin")} />
                {resendLoading
                  ? "Sending…"
                  : cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : "Resend code"}
              </button>
            </div>
            <InputOTP
              id="otp-code"
              maxLength={6}
              value={code}
              onChange={(value) => {
                setCode(value);
                if (otpInvalid) setOtpInvalid(false);
              }}
              onComplete={(value) => {
                void verifyOtpCode(value);
              }}
              pattern={REGEXP_ONLY_DIGITS}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              disabled={otpLoading}
              aria-invalid={otpInvalid}
              aria-label="6-digit verification code"
              containerClassName="justify-center"
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    aria-invalid={otpInvalid}
                    className="size-11 text-base font-medium"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {otpInvalid ? (
              <p className="text-center text-xs font-medium text-destructive">
                That code didn’t match. Try again.
              </p>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                The code expires shortly. Paste works too.
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={otpLoading || code.length !== 6}
            className="w-full"
          >
            {otpLoading ? "Verifying…" : "Verify & Sign in"}
          </Button>
        </form>
        <div className="auth-card__footer">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to login
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
        <Input
          label={identifierLabel}
          type={identifierType}
          name={identifierName}
          required
          autoComplete={identifierName === "email" ? "email" : "username"}
          placeholder={resolvedPlaceholder}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
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

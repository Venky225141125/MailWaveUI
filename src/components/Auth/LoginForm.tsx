"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { setSession, roleHomePath } from "@/lib/auth";
import type { AuthResponse } from "@/types";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

interface LoginFormProps {
  title: string;
  description?: string;
  identifierLabel: string;
  identifierType?: "email" | "text";
  identifierName: "email" | "username";
  submitLabel?: string;
  footer?: React.ReactNode;
  errorCopy?: Record<string, string>;
  onLogin: (identifier: string, password: string) => Promise<AuthResponse>;
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
  onLogin,
}: LoginFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const auth = await onLogin(identifier, password);
      setSession(auth);
      router.push(roleHomePath(auth.role));
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

  return (
    <div>
      <h1 className="auth-card__title">{title}</h1>
      {description ? (
        <p className="auth-card__desc">{description}</p>
      ) : null}
      <form onSubmit={handleSubmit} className="auth-form">
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

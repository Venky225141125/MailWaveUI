"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { setSession, roleHomePath } from "@/lib/auth";
import type { AuthResponse } from "@/lib/types";
import { FormError } from "@/components/FormError";

const CLIENT_LOGIN_ERROR_COPY: Record<string, string> = {
  ACCOUNT_PENDING_APPROVAL:
    "Your freelancer account is awaiting Super Admin approval. You'll be able to log in once it's approved.",
  ACCOUNT_DISABLED:
    "Your account has been disabled. Contact your Super Admin for help.",
  ACCOUNT_REJECTED:
    "Your account registration was rejected. Contact your Super Admin for details.",
};

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const auth = await apiFetch<AuthResponse>("/auth/login/client", {
        method: "POST",
        body: { email, password },
        auth: false,
      });
      setSession(auth);
      router.push(roleHomePath(auth.role));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(CLIENT_LOGIN_ERROR_COPY[err.errorCode] ?? err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Client Login
      </h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <FormError message={error} />
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No account?{" "}
        <Link
          href="/register/client"
          className="font-medium text-sky-600 hover:underline dark:text-sky-400"
        >
          Register as Client
        </Link>{" "}
        or{" "}
        <Link
          href="/register/freelancer"
          className="font-medium text-sky-600 hover:underline dark:text-sky-400"
        >
          Register as Freelancer
        </Link>
      </p>
    </div>
  );
}

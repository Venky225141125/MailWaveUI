"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { setSession, roleHomePath } from "@/lib/auth";
import type { AuthResponse } from "@/lib/types";
import { FormError } from "@/components/FormError";

const REGISTER_ERROR_COPY: Record<string, string> = {
  ORG_NOT_IN_CLIENT_LIST:
    "Organization not in client list — contact your Super Admin to get your organization registered first.",
  USERNAME_TAKEN: "That username is already taken. Please choose another.",
  EMAIL_TAKEN: "That official email is already registered.",
};

interface FormState {
  companyName: string;
  companyWebsite: string;
  username: string;
  officialEmail: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_STATE: FormState = {
  companyName: "",
  companyWebsite: "",
  username: "",
  officialEmail: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterClientPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const auth = await apiFetch<AuthResponse>("/auth/register/client", {
        method: "POST",
        body: form,
        auth: false,
      });
      setSession(auth);
      router.push(roleHomePath(auth.role));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(REGISTER_ERROR_COPY[err.errorCode] ?? err.message);
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
        Register as Client
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Your organization must already be registered by a Super Admin — the
        company name and website must match exactly.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <FormError message={error} />

        <Field
          label="Company Name"
          value={form.companyName}
          onChange={(v) => update("companyName", v)}
        />
        <Field
          label="Company Website"
          value={form.companyWebsite}
          onChange={(v) => update("companyWebsite", v)}
          placeholder="https://example.com"
        />
        <Field
          label="Username"
          value={form.username}
          onChange={(v) => update("username", v)}
        />
        <Field
          label="Official Email"
          type="email"
          value={form.officialEmail}
          onChange={(v) => update("officialEmail", v)}
        />
        <Field
          label="Phone Number"
          value={form.phoneNumber}
          onChange={(v) => update("phoneNumber", v)}
        />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => update("password", v)}
        />
        <Field
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(v) => update("confirmPassword", v)}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {loading ? "Registering…" : "Register"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login/client"
          className="font-medium text-sky-600 hover:underline dark:text-sky-400"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      />
    </div>
  );
}

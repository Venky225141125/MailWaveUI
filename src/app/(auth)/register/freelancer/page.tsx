"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import { FormError, FormSuccess } from "@/components/FormError";

interface FreelancerRegisterResponse {
  id: number;
  status: string;
  message: string;
}

interface FormState {
  username: string;
  panCard: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_STATE: FormState = {
  username: "",
  panCard: "",
  phoneNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterFreelancerPage() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [addressProof, setAddressProof] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!addressProof) {
      setError("Please attach a proof of address (PDF or image).");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("username", form.username);
      fd.append("panCard", form.panCard);
      fd.append("phoneNumber", form.phoneNumber);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("confirmPassword", form.confirmPassword);
      fd.append("addressProof", addressProof);

      await apiFetch<FreelancerRegisterResponse>(
        "/auth/register/freelancer",
        {
          method: "POST",
          body: fd,
          auth: false,
        }
      );

      setSuccess(
        "Registration submitted — you'll be able to log in once a Super Admin approves your account."
      );
      setForm(INITIAL_STATE);
      setAddressProof(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
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
        Register as Freelancer
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Freelancer accounts require Super Admin approval before you can log
        in.
      </p>

      {success ? (
        <div className="mt-6 flex flex-col gap-4">
          <FormSuccess message={success} />
          <Link
            href="/login/client"
            className="rounded-md bg-zinc-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Go to Client Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <FormError message={error} />

          <Field
            label="Username"
            value={form.username}
            onChange={(v) => update("username", v)}
          />
          <Field
            label="PAN Card"
            value={form.panCard}
            onChange={(v) => update("panCard", v)}
          />
          <Field
            label="Phone Number"
            value={form.phoneNumber}
            onChange={(v) => update("phoneNumber", v)}
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => update("email", v)}
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

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Address Proof (PDF or image)
            </label>
            <input
              type="file"
              required
              accept=".pdf,image/*"
              onChange={(e) => setAddressProof(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white dark:text-zinc-300 dark:file:bg-zinc-100 dark:file:text-zinc-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {loading ? "Submitting…" : "Submit registration"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already approved?{" "}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
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
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      />
    </div>
  );
}

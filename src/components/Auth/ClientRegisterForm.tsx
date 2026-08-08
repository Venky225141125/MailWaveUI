"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { setSession, roleHomePath } from "@/lib/auth";
import { registerClient } from "@/services/authService";
import { Alert } from "@/components/shared/alert";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import {
  RegisterLoginHint,
  RegisterSplitLayout,
} from "@/components/Auth/RegisterSplitLayout";
import {
  CLIENT_REGISTER_ERROR_COPY,
  GENERIC_ERROR,
} from "@/constants/error-messages.constants";
import {
  clientRegisterSchema,
  zodFieldErrors,
} from "@/lib/helpers/validation.utils";
import type { ClientRegisterPayload } from "@/types";

const INITIAL: ClientRegisterPayload = {
  companyName: "",
  companyWebsite: "",
  username: "",
  officialEmail: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

const FIELD_API_MAP: Record<string, keyof ClientRegisterPayload> = {
  USERNAME_TAKEN: "username",
  EMAIL_TAKEN: "officialEmail",
  ORG_NOT_IN_CLIENT_LIST: "companyName",
};

export function ClientRegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ClientRegisterPayload, string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<
    Partial<Record<keyof ClientRegisterPayload, boolean>>
  >({});

  function update<K extends keyof ClientRegisterPayload>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validateField(key: keyof ClientRegisterPayload, value: string) {
    const draft = { ...form, [key]: value };
    const result = clientRegisterSchema.safeParse(draft);
    if (result.success) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      return;
    }
    const errors = zodFieldErrors(result.error);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (errors[key]) next[key] = errors[key];
      else delete next[key];
      return next;
    });
  }

  function handleBlur(key: keyof ClientRegisterPayload) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    validateField(key, form[key]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsed = clientRegisterSchema.safeParse(form);
    if (!parsed.success) {
      setFieldErrors(
        zodFieldErrors(parsed.error) as Partial<
          Record<keyof ClientRegisterPayload, string>
        >
      );
      setTouched(
        Object.keys(form).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {} as Partial<Record<keyof ClientRegisterPayload, boolean>>
        )
      );
      setFormError("Please fix the highlighted fields and try again.");
      return;
    }

    setLoading(true);
    try {
      const auth = await registerClient(parsed.data);
      setSession({
        token: auth.token,
        role: auth.role,
        id: auth.id,
        username: auth.username,
        status: auth.status ?? "ACTIVE",
      });
      router.push(roleHomePath(auth.role));
    } catch (err) {
      if (err instanceof ApiError) {
        const field = FIELD_API_MAP[err.errorCode];
        const message =
          CLIENT_REGISTER_ERROR_COPY[err.errorCode] ?? err.message;
        if (field) {
          setFieldErrors((prev) => ({ ...prev, [field]: message }));
          setTouched((prev) => ({ ...prev, [field]: true }));
        }
        setFormError(message);
      } else {
        setFormError(GENERIC_ERROR);
      }
    } finally {
      setLoading(false);
    }
  }

  function err(key: keyof ClientRegisterPayload) {
    return touched[key] ? fieldErrors[key] : undefined;
  }

  return (
    <RegisterSplitLayout
      eyebrow="Organization signup"
      title="Join MailWave as a Client"
      description="Provision team users, monitor list validation, and oversee campaigns from one place."
      highlights={[
        {
          title: "Whitelist first",
          body: "Company name and website must already match the Super Admin whitelist.",
        },
        {
          title: "Manage your team",
          body: "Create User accounts and share one-time temporary passwords.",
        },
        {
          title: "See progress roll up",
          body: "Track uploads, validity rates, and campaign results across your team.",
        },
      ]}
      footerNote={<RegisterLoginHint light />}
    >
      <h1 className="auth-card__title mb-2">Create client account</h1>
      <p className="auth-card__desc">
        All fields are required. Company name and website must match the
        whitelist.
      </p>

      <form onSubmit={handleSubmit} className="register-form" noValidate>
        <Alert
          message={formError}
          className="!px-2 !py-1.5 !text-xs leading-snug"
        />

        <Input
          density="compact"
          label="Company Name"
          required
          autoComplete="organization"
          value={form.companyName}
          error={err("companyName")}
          onChange={(e) => update("companyName", e.target.value)}
          onBlur={() => handleBlur("companyName")}
          className="mb-2"
        />
        <div className="register-form__grid register-form__grid--2 space-x-2 mb-2">
          <Input
            density="compact"
            label="Company Website"
            required
            placeholder="https://example.com"
            autoComplete="url"
            value={form.companyWebsite}
            error={err("companyWebsite")}
            onChange={(e) => update("companyWebsite", e.target.value)}
            onBlur={() => handleBlur("companyWebsite")}
          />
          <Input
            density="compact"
            label="Username"
            required
            autoComplete="username"
            value={form.username}
            error={err("username")}
            onChange={(e) => update("username", e.target.value)}
            onBlur={() => handleBlur("username")}
          />
        </div>

        <div className="register-form__grid register-form__grid--2 space-x-2 mb-2">
          <Input
            density="compact"
            label="Official Email"
            type="email"
            required
            autoComplete="email"
            value={form.officialEmail}
            error={err("officialEmail")}
            onChange={(e) => update("officialEmail", e.target.value)}
            onBlur={() => handleBlur("officialEmail")}
          />
          <Input
            density="compact"
            label="Phone Number"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            value={form.phoneNumber}
            error={err("phoneNumber")}
            onChange={(e) => update("phoneNumber", e.target.value)}
            onBlur={() => handleBlur("phoneNumber")}
          />
        </div>


        <div className="register-form__grid register-form__grid--2 space-x-2 mb-2">
          <Input
            density="compact"
            label="Password"
            type="password"
            required
            autoComplete="new-password"
            hint="8+ chars · upper · lower · number"
            value={form.password}
            error={err("password")}
            onChange={(e) => update("password", e.target.value)}
            onBlur={() => handleBlur("password")}
          />
          <Input
            density="compact"
            label="Confirm Password"
            type="password"
            required
            autoComplete="new-password"
            value={form.confirmPassword}
            error={err("confirmPassword")}
            onChange={(e) => update("confirmPassword", e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
          />
        </div>

        <Button type="submit" size="sm" disabled={loading} className="w-full">
          {loading ? "Registering…" : "Create account"}
        </Button>
      </form>

      <p className="register-form__footer">
        <RegisterLoginHint />
      </p>
    </RegisterSplitLayout>
  );
}

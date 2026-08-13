"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import { registerFreelancer } from "@/services/authService";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { LinkButton } from "@/components/shared/link-button";
import {
  RegisterLoginHint,
  RegisterSplitLayout,
} from "@/components/Auth/RegisterSplitLayout";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";
import { FORM_PLACEHOLDERS } from "@/constants/form-placeholders.constants";
import { ROUTES } from "@/constants/routes.constants";
import {
  freelancerRegisterSchema,
  validateAddressProof,
  zodFieldErrors,
} from "@/lib/helpers/validation.utils";
import { toastError, toastSuccess } from "@/lib/helpers/toast.utils";

interface FormState {
  username: string;
  panCard: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const INITIAL: FormState = {
  username: "",
  panCard: "",
  phoneNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
};

type FieldKey = keyof FormState | "addressProof";

const SUCCESS_MESSAGE =
  "Registration submitted — you'll be able to log in once a Super Admin approves your account.";

export function FreelancerRegisterForm() {
  const [form, setForm] = useState(INITIAL);
  const [addressProof, setAddressProof] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>(
    {}
  );
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    const nextValue = key === "panCard" ? value.toUpperCase() : value;
    setForm((prev) => ({ ...prev, [key]: nextValue }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validateField(key: keyof FormState, value: string) {
    const draft = { ...form, [key]: value };
    const result = freelancerRegisterSchema.safeParse(draft);
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

  function handleBlur(key: keyof FormState) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    validateField(key, form[key]);
  }

  function handleFileChange(file: File | null) {
    setAddressProof(file);
    setTouched((prev) => ({ ...prev, addressProof: true }));
    const message = validateAddressProof(file);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (message) next.addressProof = message;
      else delete next.addressProof;
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);

    const parsed = freelancerRegisterSchema.safeParse(form);
    const fileError = validateAddressProof(addressProof);
    const nextErrors: Partial<Record<FieldKey, string>> = parsed.success
      ? {}
      : (zodFieldErrors(parsed.error) as Partial<Record<FieldKey, string>>);

    if (fileError) nextErrors.addressProof = fileError;

    if (!parsed.success || fileError) {
      setFieldErrors(nextErrors);
      setTouched({
        username: true,
        panCard: true,
        phoneNumber: true,
        email: true,
        password: true,
        confirmPassword: true,
        addressProof: true,
      });
      toastError("Please fix the highlighted fields and try again.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("username", parsed.data.username);
      fd.append("panCard", parsed.data.panCard);
      fd.append("phoneNumber", parsed.data.phoneNumber);
      fd.append("email", parsed.data.email);
      fd.append("password", parsed.data.password);
      fd.append("confirmPassword", parsed.data.confirmPassword);
      fd.append("addressProof", addressProof as File);

      await registerFreelancer(fd);
      toastSuccess(SUCCESS_MESSAGE);
      setSuccess(true);
      setForm(INITIAL);
      setAddressProof(null);
      setFieldErrors({});
      setTouched({});
    } catch (err) {
      if (err instanceof ApiError) {
        const code = err.errorCode;
        if (code === "USERNAME_TAKEN") {
          setFieldErrors((prev) => ({ ...prev, username: err.message }));
        } else if (code === "EMAIL_TAKEN") {
          setFieldErrors((prev) => ({ ...prev, email: err.message }));
        }
        toastError(err.message);
      } else {
        toastError(GENERIC_ERROR);
      }
    } finally {
      setLoading(false);
    }
  }

  function err(key: FieldKey) {
    return touched[key] ? fieldErrors[key] : undefined;
  }

  return (
    <RegisterSplitLayout
      eyebrow="Freelancer application"
      title="Apply to use MailWave independently"
      description="Apply with identity documents. Access stays locked until Super Admin approval."
      highlights={[
        {
          title: "Manual approval",
          body: "Submitting does not grant login — wait for Super Admin review.",
        },
        {
          title: "Identity checks",
          body: "Valid PAN plus address proof (PDF or image, max 5 MB).",
        },
        {
          title: "Same client tools",
          body: "Once approved, log in as a Client and create team Users.",
        },
      ]}
      footerNote={<RegisterLoginHint light />}
    >
      {success ? (
        <div className="flex flex-col gap-3">
          <h1 className="auth-card__title">Application received</h1>
          <p className="text-sm text-muted-foreground">{SUCCESS_MESSAGE}</p>
          <LinkButton href={ROUTES.login.client}>Go to Client Login</LinkButton>
        </div>
      ) : (
        <>
          <h1 className="auth-card__title mb-2">Freelancer registration</h1>
          <p className="auth-card__desc">
            Incorrect PAN or document types will delay approval.
          </p>

          <form onSubmit={handleSubmit} className="register-form" noValidate>
            <div className="register-form__grid register-form__grid--2 space-x-2 mb-2">
              <Input
                density="compact"
                label="Username"
                required
                autoComplete="username"
                value={form.username}
                error={err("username")}
                onChange={(e) => update("username", e.target.value)}
                onBlur={() => handleBlur("username")}
                placeholder={FORM_PLACEHOLDERS.freelancerRegister.username}
              />
              <Input
                density="compact"
                label="PAN Card"
                required
                placeholder="ABCDE1234F"
                value={form.panCard}
                error={err("panCard")}
                onChange={(e) => update("panCard", e.target.value)}
                onBlur={() => handleBlur("panCard")}
              />
            </div>

            <div className="register-form__grid register-form__grid--2 space-x-2 mb-2">
              <Input
                density="compact"
                label="Phone Number"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder={FORM_PLACEHOLDERS.freelancerRegister.phoneNumber}
                value={form.phoneNumber}
                error={err("phoneNumber")}
                onChange={(e) => update("phoneNumber", e.target.value)}
                onBlur={() => handleBlur("phoneNumber")}
              />
              <Input
                density="compact"
                label="Email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                error={err("email")}
                onChange={(e) => update("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder={FORM_PLACEHOLDERS.freelancerRegister.email}
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
                placeholder={FORM_PLACEHOLDERS.freelancerRegister.password}
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
                placeholder={FORM_PLACEHOLDERS.freelancerRegister.confirmPassword}
              />
            </div>

            <div className="register-file mb-2">
              <label htmlFor="address-proof">
                Address Proof (PDF or image)
                <span className="ml-0.5 text-red-600" aria-hidden>
                  *
                </span>
              </label>
              <input
                id="address-proof"
                type="file"
                accept=".pdf,image/*"
                className={`register-file__input ${
                  err("addressProof")
                    ? "rounded-[var(--radius-sm)] border border-red-400 p-1.5"
                    : ""
                }`}
                aria-invalid={err("addressProof") ? true : undefined}
                onChange={(e) =>
                  handleFileChange(e.target.files?.[0] ?? null)
                }
              />
              {err("addressProof") ? (
                <p className="register-file__error" role="alert">
                  {err("addressProof")}
                </p>
              ) : (
                <p className="register-file__hint">
                  PDF or image · max 5 MB
                  {addressProof ? ` · ${addressProof.name}` : ""}
                </p>
              )}
            </div>

            <Button type="submit" size="sm" disabled={loading} className="w-full">
              {loading ? "Submitting…" : "Submit application"}
            </Button>
          </form>

          <p className="register-form__footer">
            <RegisterLoginHint />
          </p>
        </>
      )}
    </RegisterSplitLayout>
  );
}

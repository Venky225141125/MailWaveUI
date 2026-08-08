import { z } from "zod";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must be 30 characters or fewer.")
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    "Use only letters, numbers, dots, hyphens, or underscores."
  );

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required.")
  .regex(
    /^[+]?[\d][\d\s-]{8,14}$/,
    "Enter a valid phone number (10–15 digits)."
  );

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Include at least one uppercase letter.")
  .regex(/[a-z]/, "Include at least one lowercase letter.")
  .regex(/[0-9]/, "Include at least one number.");

const websiteSchema = z
  .string()
  .trim()
  .min(1, "Website is required.")
  .refine((value) => {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      const url = new URL(candidate);
      return Boolean(url.hostname) && url.hostname.includes(".");
    } catch {
      return false;
    }
  }, "Enter a valid website (e.g. https://example.com).");

const panSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^[A-Z]{5}[0-9]{4}[A-Z]$/,
    "Enter a valid PAN (e.g. ABCDE1234F)."
  );

export const clientRegisterSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters.")
      .max(120, "Company name is too long."),
    companyWebsite: websiteSchema,
    username: usernameSchema,
    officialEmail: emailSchema,
    phoneNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const freelancerRegisterSchema = z
  .object({
    username: usernameSchema,
    panCard: panSchema,
    phoneNumber: phoneSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ClientRegisterValues = z.infer<typeof clientRegisterSchema>;
export type FreelancerRegisterValues = z.infer<typeof freelancerRegisterSchema>;

const ADDRESS_PROOF_MAX_BYTES = 5 * 1024 * 1024;
const ADDRESS_PROOF_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export function validateAddressProof(file: File | null): string | null {
  if (!file) return "Please attach a proof of address (PDF or image).";
  if (file.size > ADDRESS_PROOF_MAX_BYTES) {
    return "File must be 5 MB or smaller.";
  }
  const byType = ADDRESS_PROOF_TYPES.includes(file.type);
  const byExt = /\.(pdf|jpe?g|png|webp|gif)$/i.test(file.name);
  if (!byType && !byExt) {
    return "Only PDF or image files are accepted.";
  }
  return null;
}

/** Flatten Zod issues into a field → message map (first error per field). */
export function zodFieldErrors(
  error: z.ZodError
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) {
      out[key] = issue.message;
    }
  }
  return out;
}

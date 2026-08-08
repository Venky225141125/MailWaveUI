import Link from "next/link";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: LinkButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-[var(--brand)] text-[var(--brand-foreground)] hover:bg-[var(--brand-hover)]"
      : "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-muted)]";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-[var(--radius-sm)] px-4 py-2.5 text-center text-sm font-medium transition-colors ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}

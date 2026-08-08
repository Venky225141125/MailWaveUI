"use client";

import * as React from "react";
import { ShieldOff } from "lucide-react";
import { ApiError } from "@/lib/api";
import {
  getAccountStatus,
  setAccountStatus,
  type AccountStatus,
} from "@/lib/auth/session";

export function isAccountDisabledError(err: unknown) {
  return (
    err instanceof ApiError &&
    (err.errorCode === "ACCOUNT_DISABLED" || err.errorCode === "USER_DISABLED")
  );
}

interface AccountStatusContextValue {
  status: AccountStatus;
  isActive: boolean;
  markInactive: () => void;
  refresh: () => void;
}

const AccountStatusContext =
  React.createContext<AccountStatusContextValue | null>(null);

export function AccountStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = React.useState<AccountStatus>("ACTIVE");

  const refresh = React.useCallback(() => {
    setStatus(getAccountStatus() ?? "ACTIVE");
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const markInactive = React.useCallback(() => {
    setAccountStatus("DISABLED");
    setStatus("DISABLED");
  }, []);

  const value = React.useMemo(
    () => ({
      status,
      isActive: status === "ACTIVE",
      markInactive,
      refresh,
    }),
    [status, markInactive, refresh]
  );

  return (
    <AccountStatusContext.Provider value={value}>
      {children}
    </AccountStatusContext.Provider>
  );
}

export function useAccountStatus() {
  const ctx = React.useContext(AccountStatusContext);
  if (!ctx) {
    return {
      status: "ACTIVE" as AccountStatus,
      isActive: true,
      markInactive: () => undefined,
      refresh: () => undefined,
    };
  }
  return ctx;
}

export function InactiveAccountBanner() {
  const { isActive } = useAccountStatus();
  if (isActive) return null;

  return (
    <div
      role="alert"
      className="mb-6 overflow-hidden rounded-xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-amber-50 shadow-sm dark:border-red-900/60 dark:from-red-950/50 dark:via-card dark:to-amber-950/30"
    >
      <div className="flex gap-4 p-4 sm:p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300">
          <ShieldOff className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-red-800 dark:text-red-200">
            Your account is inactive
          </p>
          <p className="mt-1 text-sm leading-relaxed text-red-700/90 dark:text-red-300/90">
            Uploads, campaigns, and other actions are disabled. Contact your
            Client admin to reactivate your account.
          </p>
        </div>
      </div>
    </div>
  );
}

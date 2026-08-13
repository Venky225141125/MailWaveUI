"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FolderOpen, UserCheck, UserX } from "lucide-react";
import { ApiError } from "@/lib/api";
import {
  activateUser,
  deactivateUser,
  listClientUsers,
} from "@/services/superAdminService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/shared/page-header";
import { UsersTable } from "@/components/common/UsersTable";
import { ROUTES } from "@/constants/routes.constants";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";
import { toastError } from "@/lib/helpers/toast.utils";

export default function ClientUsersPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: users, loading, reload } = useAsyncData(
    () => listClientUsers(params.id),
    [params.id]
  );
  const [actingId, setActingId] = useState<number | null>(null);

  async function handleActivate(id: number) {
    setActingId(id);
    try {
      await activateUser(id);
      reload();
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setActingId(null);
    }
  }

  async function handleDeactivate(id: number) {
    setActingId(id);
    try {
      await deactivateUser(id);
      reload();
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Client Users"
        description="Activate or deactivate team members for this organization."
        backHref={ROUTES.superAdmin.client(params.id)}
        backLabel="Client detail"
      />
      <UsersTable
        users={users ?? []}
        loading={loading}
        actionsForUser={(user) => [
          {
            label: "View uploads",
            icon: <FolderOpen className="size-4" />,
            onSelect: () =>
              router.push(ROUTES.superAdmin.userUploads(user.id)),
          },
          user.status === "ACTIVE"
            ? {
                label: actingId === user.id ? "Deactivating…" : "Deactivate",
                icon: <UserX className="size-4" />,
                destructive: true,
                disabled: actingId === user.id,
                separatorBefore: true,
                onSelect: () => handleDeactivate(user.id),
              }
            : {
                label: actingId === user.id ? "Activating…" : "Activate",
                icon: <UserCheck className="size-4" />,
                disabled: actingId === user.id,
                separatorBefore: true,
                onSelect: () => handleActivate(user.id),
              },
        ]}
      />
    </div>
  );
}

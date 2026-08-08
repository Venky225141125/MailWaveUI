"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ApiError } from "@/lib/api";
import {
  activateUser,
  deactivateUser,
  listClientUsers,
} from "@/services/superAdminService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/shared/page-header";
import { Alert } from "@/components/shared/alert";
import { Button } from "@/components/shared/button";
import { UsersTable } from "@/components/common/UsersTable";
import { ROUTES } from "@/constants/routes.constants";
import { GENERIC_ERROR } from "@/constants/error-messages.constants";

export default function ClientUsersPage() {
  const params = useParams<{ id: string }>();
  const { data: users, loading, error, reload } = useAsyncData(
    () => listClientUsers(params.id),
    [params.id]
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<number | null>(null);

  async function handleActivate(id: number) {
    setActionError(null);
    setActingId(id);
    try {
      await activateUser(id);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setActingId(null);
    }
  }

  async function handleDeactivate(id: number) {
    setActionError(null);
    setActingId(id);
    try {
      await deactivateUser(id);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : GENERIC_ERROR);
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Client Users"
        backHref={ROUTES.superAdmin.client(params.id)}
        backLabel="Client detail"
      />
      <Alert message={error ?? actionError} />
      <UsersTable
        users={users ?? []}
        loading={loading}
        linkLabel="Uploads"
        hrefForUser={(u) => ROUTES.superAdmin.userUploads(u.id)}
        renderActions={(user) =>
          user.status === "ACTIVE" ? (
            <Button
              size="sm"
              variant="danger"
              disabled={actingId === user.id}
              onClick={() => handleDeactivate(user.id)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={actingId === user.id}
              onClick={() => handleActivate(user.id)}
              className="!bg-emerald-600 !text-white hover:!bg-emerald-700"
            >
              Activate
            </Button>
          )
        }
      />
    </div>
  );
}

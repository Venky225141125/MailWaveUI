"use client";

import { useParams } from "next/navigation";
import { listClientUsers } from "@/services/superAdminService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { UsersTable } from "@/components/common/UsersTable";
import { ROUTES } from "@/constants/routes.constants";

export default function ClientUsersPage() {
  const params = useParams<{ id: string }>();
  const { data: users, loading, error } = useAsyncData(
    () => listClientUsers(params.id),
    [params.id]
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Client Users"
        backHref={ROUTES.superAdmin.client(params.id)}
        backLabel="Client detail"
      />
      <Alert message={error} />
      <UsersTable
        users={users ?? []}
        loading={loading}
        linkLabel="Uploads"
        hrefForUser={(u) => ROUTES.superAdmin.userUploads(u.id)}
      />
    </div>
  );
}

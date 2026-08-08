"use client";

import { listUsers } from "@/services/clientService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/shared/link-button";
import { Alert } from "@/components/shared/alert";
import { UsersTable } from "@/components/common/UsersTable";
import { ROUTES } from "@/constants/routes.constants";

export default function ClientUsersPage() {
  const { data: users, loading, error } = useAsyncData(() => listUsers(), []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        description="Team members who upload lists and run campaigns."
        action={
          <LinkButton href={ROUTES.client.newUser}>+ Create User</LinkButton>
        }
      />
      <Alert message={error} />
      <UsersTable
        users={users ?? []}
        loading={loading}
        linkLabel="Progress"
        hrefForUser={(u) => ROUTES.client.user(u.id)}
      />
    </div>
  );
}

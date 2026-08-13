"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Activity } from "lucide-react";
import { listUsers } from "@/services/clientService";
import type { CreateUserResponse, UserSummary } from "@/types";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/shared/button";
import { UsersTable } from "@/components/common/UsersTable";
import { CreateUserDrawer } from "@/components/Client/CreateUserDrawer";
import { ROUTES } from "@/constants/routes.constants";

export default function ClientUsersPage() {
  const router = useRouter();
  const { data: users, loading, reload } = useAsyncData(
    () => listUsers(),
    []
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [localUsers, setLocalUsers] = useState<UserSummary[] | null>(null);

  const displayUsers = localUsers ?? users ?? [];

  async function handleCreated(created: CreateUserResponse) {
    // Optimistically show the new row, then refresh from API for source of truth.
    setLocalUsers((prev) => {
      const base = prev ?? users ?? [];
      const withoutDup = base.filter((u) => u.id !== created.id);
      return [created, ...withoutDup];
    });
    try {
      const fresh = await listUsers();
      setLocalUsers(fresh);
    } catch {
      reload();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        description="Team members who upload lists and run campaigns."
        action={
          <Button onClick={() => setDrawerOpen(true)} className="gap-1.5">
            <Plus className="size-4" />
            Add user
          </Button>
        }
      />
      <UsersTable
        users={displayUsers}
        loading={loading && !localUsers}
        actionsForUser={(user) => [
          {
            label: "View progress",
            icon: <Activity className="size-4" />,
            onSelect: () => router.push(ROUTES.client.user(user.id)),
          },
        ]}
      />
      <CreateUserDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onCreated={handleCreated}
      />
    </div>
  );
}

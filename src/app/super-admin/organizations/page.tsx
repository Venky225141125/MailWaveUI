"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { listOrganizations } from "@/services/superAdminService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { PageHeader } from "@/components/shared/page-header";
import { Alert } from "@/components/shared/alert";
import { Button } from "@/components/shared/button";
import { DataTable } from "@/components/shared/data-table";
import { CreateOrganizationDrawer } from "@/components/SuperAdmin/CreateOrganizationDrawer";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/helpers";

export default function OrganizationsPage() {
  const { data: orgs, loading, error, reload } = useAsyncData(
    () => listOrganizations(),
    []
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Organizations"
        description="Whitelist that company sign-up checks against — name and website must match exactly."
        action={
          <Button onClick={() => setDrawerOpen(true)} className="gap-1.5">
            <Plus className="size-4" />
            Add organization
          </Button>
        }
      />
      <Alert message={error} />
      <DataTable
        columns={["Name", "Website", "Registered"]}
        loading={loading}
        empty={!loading && (orgs?.length ?? 0) === 0}
        emptyMessage="No organizations registered yet."
        minWidth="480px"
      >
        {(orgs ?? []).map((org) => (
          <TableRow key={org.id}>
            <TableCell className="px-4 py-3.5 font-medium">{org.name}</TableCell>
            <TableCell className="px-4 py-3.5 text-muted-foreground">
              {org.website}
            </TableCell>
            <TableCell className="px-4 py-3.5 text-muted-foreground">
              {formatDateTime(org.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
      <CreateOrganizationDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onCreated={reload}
      />
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import type { UserSummary } from "@/types";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/components/shared/data-table";
import { RowActions, type RowAction } from "@/components/shared/row-actions";
import { CopyableText } from "@/components/shared/copyable-text";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDateTime } from "@/lib/helpers";

interface UsersTableProps {
  users: UserSummary[];
  loading?: boolean;
  emptyMessage?: string;
  actionsForUser?: (user: UserSummary) => RowAction[];
  /** @deprecated Prefer actionsForUser — kept for simple custom cells */
  renderActions?: (user: UserSummary) => ReactNode;
}

export function UsersTable({
  users,
  loading,
  emptyMessage = "No users yet. Add your first team member to get started.",
  actionsForUser,
  renderActions,
}: UsersTableProps) {
  return (
    <DataTable
      columns={["User", "Email", "Status", "Created", ""]}
      loading={loading}
      empty={!loading && users.length === 0}
      emptyMessage={emptyMessage}
      minWidth="720px"
    >
      {users.map((user) => {
        const actions = actionsForUser?.(user) ?? [];
        return (
          <TableRow key={user.id} className="group">
            <TableCell className="px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                >
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground">
                    {user.username}
                  </div>
                  <div className="truncate text-xs text-muted-foreground sm:hidden">
                    <CopyableText value={user.officialEmail} />
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden px-4 py-3.5 text-muted-foreground sm:table-cell">
              <CopyableText value={user.officialEmail} />
            </TableCell>
            <TableCell className="px-4 py-3.5">
              <StatusBadge status={user.status} />
            </TableCell>
            <TableCell className="px-4 py-3.5 text-muted-foreground">
              {formatDateTime(user.createdAt)}
            </TableCell>
            <TableCell className="px-2 py-3.5 text-right">
              {renderActions ? (
                <div className="flex items-center justify-end gap-1">
                  {renderActions(user)}
                  {actions.length > 0 ? (
                    <RowActions actions={actions} />
                  ) : null}
                </div>
              ) : actions.length > 0 ? (
                <RowActions actions={actions} />
              ) : null}
            </TableCell>
          </TableRow>
        );
      })}
    </DataTable>
  );
}

import type { ReactNode } from "react";
import type { UserSummary } from "@/types";
import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDateTime } from "@/lib/utils";

interface UsersTableProps {
  users: UserSummary[];
  loading?: boolean;
  hrefForUser: (user: UserSummary) => string;
  linkLabel?: string;
  emptyMessage?: string;
  renderActions?: (user: UserSummary) => ReactNode;
}

export function UsersTable({
  users,
  loading,
  hrefForUser,
  linkLabel = "View",
  emptyMessage = "No users yet.",
  renderActions,
}: UsersTableProps) {
  return (
    <DataTable
      columns={["Username", "Email", "Status", "Created", ""]}
      loading={loading}
      empty={!loading && users.length === 0}
      emptyMessage={emptyMessage}
      minWidth="700px"
    >
      {users.map((user) => (
        <tr key={user.id} className="hover:bg-[var(--surface-muted)]">
          <td className="px-4 py-2.5 font-medium text-[var(--text)]">
            {user.username}
          </td>
          <td className="px-4 py-2.5 text-[var(--text-muted)]">
            {user.officialEmail}
          </td>
          <td className="px-4 py-2.5">
            <StatusBadge status={user.status} />
          </td>
          <td className="px-4 py-2.5 text-[var(--text-muted)]">
            {formatDateTime(user.createdAt)}
          </td>
          <td className="px-4 py-2.5 text-right">
            {renderActions ? (
              <div className="flex justify-end gap-3">
                {renderActions(user)}
                <Link
                  href={hrefForUser(user)}
                  className="text-sm font-medium text-[var(--brand)] hover:underline"
                >
                  {linkLabel}
                </Link>
              </div>
            ) : (
              <Link
                href={hrefForUser(user)}
                className="text-sm font-medium text-[var(--brand)] hover:underline"
              >
                {linkLabel}
              </Link>
            )}
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

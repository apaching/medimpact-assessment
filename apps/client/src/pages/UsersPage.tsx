import { useState } from "react";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Spinner } from "../components/ui/Spinner";
import { UserForm, type UserFormValues } from "../components/users/UserForm";
import { useUsers } from "../hooks/users/useUsers";
import { useCreateUser } from "../hooks/users/useCreateUser";
import { useUpdateUser } from "../hooks/users/useUpdateUser";
import { useApproveUser } from "../hooks/users/useApproveUser";
import { useDeactivateUser } from "../hooks/users/useDeactivateUser";
import { useDeleteUser } from "../hooks/users/useDeleteUser";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/types";

const statusClasses: Record<User["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  deactivated: "bg-gray-200 text-gray-700",
};

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const { data: users, isPending, isError } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const approveUser = useApproveUser();
  const deactivateUser = useDeactivateUser();
  const deleteUser = useDeleteUser();
  const [mode, setMode] = useState<"list" | "create" | { edit: User }>("list");

  if (isPending) return <Spinner />;
  if (isError) return <EmptyState message="Couldn't load users." />;

  function handleCreate(values: UserFormValues) {
    createUser.mutate(values, { onSuccess: () => setMode("list") });
  }

  function handleUpdate(id: number, values: UserFormValues) {
    updateUser.mutate(
      { id, firstName: values.firstName, lastName: values.lastName, email: values.email, role: values.role },
      { onSuccess: () => setMode("list") },
    );
  }

  return (
    <div className="space-y-4">
      {mode === "list" && (
        <div className="flex justify-end">
          <Button onClick={() => setMode("create")}>Add user</Button>
        </div>
      )}

      {mode === "create" && (
        <UserForm
          onCancel={() => setMode("list")}
          isSubmitting={createUser.isPending}
          error={createUser.error?.message}
          onSubmit={handleCreate}
        />
      )}

      {typeof mode === "object" && (
        <UserForm
          initial={mode.edit}
          onCancel={() => setMode("list")}
          isSubmitting={updateUser.isPending}
          error={updateUser.error?.message}
          onSubmit={(values) => handleUpdate(mode.edit.id, values)}
        />
      )}

      {mode === "list" && (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="text-left">
                <p className="font-medium text-foreground">
                  {user.first_name} {user.last_name}
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${statusClasses[user.status]}`}>
                    {user.status}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.email} · {user.role}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:shrink-0">
                {user.status === "pending" && (
                  <Button variant="secondary" disabled={approveUser.isPending} onClick={() => approveUser.mutate(user.id)}>
                    Approve
                  </Button>
                )}
                {user.status !== "deactivated" ? (
                  <Button
                    variant="secondary"
                    disabled={deactivateUser.isPending || user.id === currentUser?.id}
                    onClick={() => deactivateUser.mutate(user.id)}
                  >
                    Deactivate
                  </Button>
                ) : (
                  <Button variant="secondary" disabled={approveUser.isPending} onClick={() => approveUser.mutate(user.id)}>
                    Reactivate
                  </Button>
                )}
                <Button variant="secondary" onClick={() => setMode({ edit: user })}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  disabled={deleteUser.isPending || user.id === currentUser?.id}
                  onClick={() => {
                    if (confirm(`Delete ${user.first_name} ${user.last_name}?`)) deleteUser.mutate(user.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

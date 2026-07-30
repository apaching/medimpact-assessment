import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";
import type { User, UserRole } from "../../types/types";

export interface UpdateUserPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateUserPayload) =>
      apiFetch<User>(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
    },
  });
}

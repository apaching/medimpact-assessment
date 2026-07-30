import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";

export function useUnshareContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, userId }: { contactId: string; userId: number }) =>
      apiFetch<void>(`/api/contacts/${contactId}/share/${userId}`, { method: "DELETE" }),
    onSuccess: (_data, { contactId }) => {
      queryClient.invalidateQueries({ queryKey: ["contacts", "shares", contactId] });
    },
  });
}

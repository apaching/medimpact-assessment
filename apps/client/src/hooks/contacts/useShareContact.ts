import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";

export function useShareContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId, email }: { contactId: string; email: string }) =>
      apiFetch<{ message: string }>(`/api/contacts/${contactId}/share`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    onSuccess: (_data, { contactId }) => {
      queryClient.invalidateQueries({ queryKey: ["contacts", "shares", contactId] });
    },
  });
}

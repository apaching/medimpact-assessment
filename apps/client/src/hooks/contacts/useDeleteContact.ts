import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";
import type { Contact } from "../../types/types";

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/api/contacts/${id}`, { method: "DELETE" }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["contacts", "list"] });
      const previous = queryClient.getQueryData<Contact[]>(["contacts", "list"]);
      queryClient.setQueryData<Contact[]>(["contacts", "list"], (old = []) =>
        old.filter((c) => c._id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["contacts", "list"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", "list"] });
    },
  });
}

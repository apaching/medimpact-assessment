import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";
import type { Contact } from "../../types/types";

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      apiFetch<Contact>(`/api/contacts/${id}`, { method: "PUT", body: formData }),
    onSuccess: (updatedContact) => {
      queryClient.setQueriesData<Contact[]>({ queryKey: ["contacts", "list"] }, (old = []) =>
        old.map((c) => (c._id === updatedContact._id ? updatedContact : c)),
      );
      queryClient.invalidateQueries({ queryKey: ["contacts", "list"] });
    },
  });
}

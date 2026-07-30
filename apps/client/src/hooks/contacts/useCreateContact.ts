import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";
import type { Contact } from "../../types/types";

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<Contact>("/api/contacts", { method: "POST", body: formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", "list"] });
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";
import type { User } from "../../types/types";

export function useContactShares(contactId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["contacts", "shares", contactId],
    queryFn: () => apiFetch<User[]>(`/api/contacts/${contactId}/shares`),
    enabled,
  });
}

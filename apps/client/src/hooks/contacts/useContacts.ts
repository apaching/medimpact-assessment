import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";
import type { Contact } from "../../types/types";

export function useContacts() {
  return useQuery({
    queryKey: ["contacts", "list"],
    queryFn: () => apiFetch<Contact[]>("/api/contacts"),
  });
}

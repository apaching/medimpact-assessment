import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";
import type { User } from "../../types/types";

export function useUsers() {
  return useQuery({
    queryKey: ["users", "list"],
    queryFn: () => apiFetch<User[]>("/api/users"),
  });
}

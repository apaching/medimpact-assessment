import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";
import type { User } from "../../types/types";

export function useMe(enabled: boolean) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiFetch<User>("/api/auth/me"),
    enabled,
    retry: false,
  });
}

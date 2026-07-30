import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (body: ResetPasswordPayload) =>
      apiFetch<{ message: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
}

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function useSignUp() {
  return useMutation({
    mutationFn: (body: SignUpPayload) =>
      apiFetch<{ message: string }>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
}

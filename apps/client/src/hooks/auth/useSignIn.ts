import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../api/client";
import type { User } from "../../types/types";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  user: User;
}

export function useSignIn() {
  return useMutation({
    mutationFn: (body: SignInPayload) =>
      apiFetch<SignInResponse>("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
}

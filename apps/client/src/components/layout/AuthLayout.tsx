import { Outlet } from "react-router";
import { AuthShell } from "./AuthShell";

export function AuthLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}

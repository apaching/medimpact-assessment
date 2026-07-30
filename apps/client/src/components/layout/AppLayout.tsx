import { NavLink, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
  }`;

export function AppLayout() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          {isAdmin && (
            <nav className="flex gap-2">
              <NavLink to="/contacts" className={navLinkClass}>
                Contacts
              </NavLink>
              <NavLink to="/users" className={navLinkClass}>
                Users
              </NavLink>
            </nav>
          )}
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground sm:ml-auto sm:justify-end">
            <span className="whitespace-nowrap">
              {user?.first_name} ({user?.role})
            </span>
            <Button variant="secondary" onClick={logout} className="whitespace-nowrap">
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

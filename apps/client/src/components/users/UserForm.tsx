import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Input } from "../ui/Input";
import type { User, UserRole } from "../../types/types";

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UserFormProps {
  initial?: User;
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string;
}

export function UserForm({ initial, onSubmit, onCancel, isSubmitting, error }: UserFormProps) {
  const [firstName, setFirstName] = useState(initial?.first_name ?? "");
  const [lastName, setLastName] = useState(initial?.last_name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(initial?.role ?? "user");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password, role });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" htmlFor="firstName">
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </Field>
        <Field label="Last name" htmlFor="lastName">
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </Field>
      </div>

      <Field label="Email" htmlFor="email">
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>

      {!initial && (
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </Field>
      )}

      <Field label="Role" htmlFor="role">
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super admin</option>
        </select>
      </Field>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

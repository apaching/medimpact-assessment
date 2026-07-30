import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { useResetPassword } from "../../hooks/auth/useResetPassword";

export function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const resetPassword = useResetPassword();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    resetPassword.mutate({ token, password });
  }

  if (!token) {
    return (
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Invalid link</h1>
        <p className="text-sm text-muted-foreground">This reset link is missing its token.</p>
      </div>
    );
  }

  if (resetPassword.isSuccess) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Password updated</h1>
          <p className="text-sm text-muted-foreground">{resetPassword.data.message}</p>
        </div>
        <Link to="/signin" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reset password</h1>
        <p className="text-sm text-muted-foreground">Choose a new password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="New password" htmlFor="password">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>

        {resetPassword.isError && <p className="text-xs text-destructive">{resetPassword.error.message}</p>}

        <Button type="submit" disabled={resetPassword.isPending} className="mt-1 w-full">
          {resetPassword.isPending ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  );
}

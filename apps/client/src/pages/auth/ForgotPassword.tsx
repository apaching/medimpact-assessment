import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const forgotPassword = useForgotPassword();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    forgotPassword.mutate(email.trim());
  }

  if (forgotPassword.isSuccess) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Check your email</h1>
          <p className="text-sm text-muted-foreground">{forgotPassword.data.message}</p>
        </div>
        <Link to="/signin" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Forgot password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send you a link to reset it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Button type="submit" disabled={forgotPassword.isPending} className="mt-1 w-full">
          {forgotPassword.isPending ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link to="/signin" className="font-medium text-foreground transition-colors hover:text-primary">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
import { useSignIn } from "../../hooks/auth/useSignIn";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const signIn = useSignIn();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    signIn.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (data) => {
          login(data.token);
          navigate("/contacts");
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Please enter your details to sign in.</p>
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

        <Field label="Password" htmlFor="password">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              autoComplete="current-password"
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

        {signIn.isError && <p className="text-xs text-destructive">{signIn.error.message}</p>}

        <Button type="submit" disabled={signIn.isPending} className="mt-1 w-full">
          {signIn.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
        <Link to="/forgot-password" className="font-medium text-foreground transition-colors hover:text-primary">
          Forgot password?
        </Link>
        <p>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-foreground transition-colors hover:text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

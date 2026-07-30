import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { error?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? "border-destructive bg-destructive/5 focus:ring-destructive/30"
            : "border-border bg-background focus:border-ring"
        } ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

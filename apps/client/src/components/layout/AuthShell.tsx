import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex w-full flex-col lg:w-120 lg:shrink-0 lg:border-r lg:border-border">
        <div className="flex flex-1 flex-col items-center justify-center px-10 pb-16 lg:px-14">
          <div className="w-full max-w-85">{children}</div>
        </div>
      </div>

      <div className="hidden flex-1 bg-muted lg:block" />
    </div>
  );
}

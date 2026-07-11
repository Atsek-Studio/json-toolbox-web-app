import React from "react";
import type { PropsWithChildren } from "react";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <main className="min-h-screen flex items-start justify-center p-6">
      <div className="w-full max-w-7xl">{children}</div>
    </main>
  );
}

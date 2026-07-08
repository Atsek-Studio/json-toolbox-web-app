import React from "react";

export default function AppShell({ children }) {
  return (
    <main className="min-h-screen flex items-start justify-center p-6">
      <div className="w-full max-w-5xl">{children}</div>
    </main>
  );
}

import React from "react";
import type { PropsWithChildren } from "react";
import { Github } from "lucide-react";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <main className="min-h-screen flex items-start justify-center p-6">
      <div className="w-full max-w-7xl">
        {children}
        <footer className="flex flex-col items-center justify-between gap-2 px-2 py-5 text-xs text-neutral-600 sm:flex-row">
          <span>© {new Date().getFullYear()} Dang Nguyen. All rights reserved.</span>
          <a
            href="https://github.com/Atsek-Studio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-teal-400"
          >
            <Github className="h-3.5 w-3.5" />
            Atsek Studio on GitHub
          </a>
        </footer>
      </div>
    </main>
  );
}

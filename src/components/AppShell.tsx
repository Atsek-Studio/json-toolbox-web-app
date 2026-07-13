import React from "react";
import type { PropsWithChildren } from "react";
import { Github } from "lucide-react";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-5 sm:py-7">
      <div className="tool-shell mx-auto w-full max-w-[1360px]">
        {children}
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-[#1a1e24] px-5 py-3.5 text-xs text-[#575f6b] sm:flex-row">
          <span>© {new Date().getFullYear()} Dang Nguyen. All rights reserved.</span>
          <a
            href="https://github.com/Atsek-Studio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[#98a1af] transition-colors hover:text-[#60a5fa]"
          >
            <Github className="h-3.5 w-3.5" />
            Atsek Studio on GitHub
          </a>
        </footer>
      </div>
    </main>
  );
}

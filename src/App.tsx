import React from "react";
import { Analytics } from "@vercel/analytics/react";
import AppShell from "./components/AppShell";
import JsonToolboxPage from "./pages/JsonToolboxPage";

export default function App() {
  return (
    <>
      <AppShell>
        <JsonToolboxPage />
      </AppShell>
      <Analytics />
    </>
  );
}

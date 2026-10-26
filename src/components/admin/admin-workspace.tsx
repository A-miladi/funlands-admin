"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { AdminProvider } from "./admin-context";
import { AdminShell } from "./admin-shell";

export function AdminWorkspace({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <AdminProvider>
      <AdminShell path={path}>{children}</AdminShell>
    </AdminProvider>
  );
}

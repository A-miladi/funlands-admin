"use client";

import type { Bootstrap } from "@/lib/admin/types";
import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { AdminProvider } from "./admin-context";
import { AdminShell } from "./admin-shell";

export function AdminWorkspace({ children, initialData }: { children: ReactNode; initialData: Bootstrap }) {
  const path = usePathname();
  return (
    <AdminProvider initialData={initialData}>
      <AdminShell path={path}>{children}</AdminShell>
    </AdminProvider>
  );
}

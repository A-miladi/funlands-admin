import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { adminFromSession, ApiError, scopedData } from "@/lib/admin/server";

export default async function AdminLayout({ children, params }: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  let admin;
  try {
    admin = adminFromSession(cookieStore.get("funlands_session")?.value);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
  }
  // Resolve guest/expired sessions before mounting a client-only loading screen.
  if (!admin) redirect(`/${locale}/auth/login`);
  return <AdminWorkspace initialData={scopedData(admin)}>{children}</AdminWorkspace>;
}

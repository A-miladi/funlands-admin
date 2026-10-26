import { notFound } from "next/navigation";
import { AdminApp } from "@/components/admin/admin-app";
export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string; adminPath: string[] }>;
}) {
  const { adminPath } = await params;
  const path = adminPath.join("/");
  if (
    !/^(users(?:\/[^/]+(?:\/games\/[^/]+)?)?|games(?:\/[^/]+)?|analytics|monitoring(?:\/[^/]+)?|content(?:\/[^/]+(?:\/edit)?)?|reports|roles|settings)$/.test(
      path,
    )
  )
    notFound();
  return <AdminApp segments={adminPath} />;
}

"use client";
import { studioKinds, studioSections, type StudioKind } from "@/lib/admin/studio";
import { StudioPage } from "./pages/studio";
import { useAdmin } from "./admin-context";
import { OverviewPage } from "./pages/overview";
import { UsersPage, UserDetailPage } from "./pages/users";
import { GamesPage, GameDetailPage, AnalyticsPage } from "./pages/games";
import { MonitoringPage, IncidentDetailPage } from "./pages/monitoring";
import {
  ContentPage,
  ContentEditorPage,
  ContentDetailPage,
} from "./pages/content";
import { ReportsPage } from "./pages/reports";
import { RolesPage } from "./pages/roles";
import { SettingsPage } from "./pages/settings";
import { Heading, Info } from "./shared/widgets";
import type { Permission } from "@/lib/admin/types";
const required: Record<string, Permission> = {
  users: "users:read",
  games: "games:read",
  analytics: "analytics:read",
  monitoring: "errors:read",
  content: "content:read",
  reports: "reports:read",
  roles: "roles:write",
};
function AdminContent({ segments }: { segments: string[] }) {
  const { data, l, can } = useAdmin();
  const [page, id, operation, gameId] = segments;
  const studioKind = studioKinds.includes(page as StudioKind) ? page as StudioKind : null;
  let permission = studioKind ? studioSections[studioKind].read : required[page];
  if (page === "content" && (id === "new" || operation === "edit"))
    permission = "content:write";
  return (
    <>
      {data && permission && !can(permission) ? (
        <>
          <Heading title={l("دسترسی مجاز نیست", "Access denied")} />
          <Info>
            {l(
              "حساب فعلی مجوز این بخش را ندارد. از تنظیمات، حساب آزمایشی دیگری انتخاب کنید.",
              "This account lacks permission. Choose another demo account in Settings.",
            )}
          </Info>
        </>
      ) : studioKind ? (
        <StudioPage kind={studioKind}/>
      ) : !page || page === "dashboard" ? (
        <OverviewPage />
      ) : page === "users" ? (
        id ? (
          <UserDetailPage
            id={id}
            gameId={operation === "games" ? gameId : undefined}
          />
        ) : (
          <UsersPage />
        )
      ) : page === "games" ? (
        id ? (
          <GameDetailPage id={id} />
        ) : (
          <GamesPage />
        )
      ) : page === "analytics" ? (
        <AnalyticsPage />
      ) : page === "monitoring" ? (
        id ? (
          <IncidentDetailPage id={id} />
        ) : (
          <MonitoringPage />
        )
      ) : page === "content" ? (
        id === "new" ? (
          <ContentEditorPage />
        ) : operation === "edit" ? (
          <ContentEditorPage id={id} />
        ) : id ? (
          <ContentDetailPage id={id} />
        ) : (
          <ContentPage />
        )
      ) : page === "reports" ? (
        <ReportsPage />
      ) : page === "roles" ? (
        <RolesPage />
      ) : (
        <SettingsPage />
      )}
    </>
  );
}
export function AdminApp({ segments = [] }: { segments?: string[] }) {
  return <AdminContent key={segments.join("/")} segments={segments} />;
}

"use client";
import {
  studioKinds,
  studioSections,
  type StudioKind,
} from "@/lib/admin/studio";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { HeaderActions } from "@/components/common/header-actions";
import { toast } from "@/lib/toast";
import { api } from "@/lib/admin/client";
import type { Permission } from "@/lib/admin/types";
import { useAdmin } from "./admin-context";
import { muted, ErrorNote } from "./shared/widgets";
const studioIcons: Record<StudioKind, string> = {
  landing: "layout",
  categories: "categories",
  avatars: "avatar",
  moderation: "moderation",
};
const navigation: [string, string, string, string, Permission?][] = [
  ["/", "home", "داشبورد", "Dashboard"],
  ["/users", "users", "کاربران", "Users", "users:read"],
  ["/games", "game", "بازی‌ها", "Games", "games:read"],
  ["/analytics", "chart", "تحلیل بازی‌ها", "Analytics", "analytics:read"],
  ["/monitoring", "warning", "پایش و خطاها", "Monitoring", "errors:read"],
  ["/content", "content", "کتابخانه محتوا", "Content", "content:read"],
  ["/reports", "report", "گزارش و خروجی", "Reports", "reports:read"],
  ["/roles", "shield", "نقش‌ها و مجوزها", "Roles & permissions", "roles:write"],
  ...studioKinds.map((kind): [string, string, string, string, Permission?] => [
    `/${kind}`,
    studioIcons[kind],
    ...studioSections[kind].label,
    studioSections[kind].read,
  ]),
  ["/settings", "setting", "تنظیمات", "Settings"],
];
export function AdminShell({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) {
  const { data, error, l, can, router, refresh } = useAdmin(),
    [menu, setMenu] = useState(false),
    [logoutError, setLogoutError] = useState("");
  if (!data)
    return (
      <div className="grid min-h-dvh place-items-center bg-background p-6">
        <div className="text-center">
          <Image
            src="/images/LargeLogo.webp"
            width={64}
            height={64}
            alt="Funlands"
            className="mx-auto mb-5"
          />
          {error ? (
            <>
              <ErrorNote error={error} />
              <Button variant="outline" onClick={refresh}>
                {l("تلاش دوباره", "Retry")}
              </Button>
            </>
          ) : (
            <p className="text-sm">
              {l("در حال آماده‌سازی پنل…", "Preparing your workspace…")}
            </p>
          )}
        </div>
      </div>
    );
  const active =
    navigation.find(([href]) => href !== "/" && path.startsWith(href)) ??
    navigation[0];
  return (
    <div className="h-dvh overflow-hidden bg-base-100 p-3 text-base-900 md:p-5 dark:bg-background-300 dark:text-title">
      {menu && (
        <Button
          variant="unstyled"
          aria-label={l("بستن منو", "Close menu")}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMenu(false)}
        />
      )}
      <Card
        as="aside"
        borderVariant="frame"
        className={`fixed inset-y-5 start-5 z-50 flex w-[238px] flex-col overflow-y-auto p-4 lg:z-20 ${menu ? "" : "max-lg:hidden"}`}
      >
        <Link
          href="/"
          prefetch={true}
          className="mb-5 flex items-center gap-2 px-2 py-2 font-orbitron text-lg font-bold"
        >
          <Image src="/images/LargeLogo.webp" width={35} height={35} alt="" />
          Funlands.
        </Link>
        <div className="mb-5 rounded-xl border border-primary-400/10 bg-primary-500/5 p-3">
          <p className={`text-[10px] ${muted}`}>
            {l("پوستهٔ فعلی", "Current skin")}
          </p>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>{l("فان‌لندز", "Funlands")}</span>
            <span className="size-1.5 rounded-full bg-success-500" />
          </div>
        </div>
        <nav
          aria-label={l("منوی مدیریت", "Admin navigation")}
          className="space-y-1"
        >
          {navigation
            .filter(([, , , , permission]) => !permission || can(permission))
            .map(([href, icon, fa, en]) => (
              <Link
                key={href}
                href={href}
                prefetch={true}
                onClick={() => setMenu(false)}
                aria-current={active[0] === href ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-xs transition ${active[0] === href ? "border-primary-400/20 bg-primary-500/15 text-primary-700 dark:text-primary-200" : "border-transparent text-base-600 hover:bg-primary-500/5 dark:text-paragraph"}`}
              >
                <Icon name={icon} />
                {l(fa, en)}
              </Link>
            ))}
        </nav>
        <div className="mt-auto w-full pt-5">
          <p
            className={`mb-4 rounded-lg bg-primary-500/5 p-3 text-[10px] leading-6 ${muted}`}
          >
            {l(
              "دسترسی‌ها در API هم محدود به همین پوسته بررسی می‌شوند.",
              "Resource access is also checked by the API within this skin.",
            )}
          </p>
          <p className="text-xs">
            {data.currentRole.name[l("fa", "en") as "fa" | "en"]}
          </p>
          <p className={`mt-1 truncate font-inter text-[9px] ${muted}`}>
            {data.currentAdmin.email}
          </p>
          <Button
            variant="outline"
            className="mt-3 w-full justify-between! py-2 text-xs"
            onClick={async () => {
              try {
                await api("logout", "POST");
                toast.success(l("از حساب خارج شدید.", "Signed out successfully."));
                router.replace("/auth/login");
              } catch (e) {
                setLogoutError((e as Error).message);
                toast.error(l("خروج انجام نشد.", "Unable to sign out."));
              }
            }}
          >
            <p>{l("خروج", "Sign out")}</p>
            <Icon name="logout" />
          </Button>
          <ErrorNote error={logoutError} />
        </div>
      </Card>
      <main className="flex h-full min-h-0 min-w-0 flex-col lg:ms-[258px]">
        <Card
          as="header"
          borderVariant="frame"
          className="mb-5 flex min-h-[76px] shrink-0 items-center justify-between gap-3 px-3 md:px-5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="unstyled"
              className="lg:hidden"
              onClick={() => setMenu(true)}
              aria-label={l("باز کردن منو", "Open menu")}
            >
              <Icon name="menu" />
            </Button>
            <span className={`hidden text-xs md:inline ${muted}`}>
              {l("فضای مدیریت", "Workspace")} /
            </span>
            <span className="truncate text-xs">{l(active[2], active[3])}</span>
          </div>
          <HeaderActions />
        </Card>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-1">
          {children}
          <footer className={`pt-6 text-[10px] ${muted}`}>
            Funlands Admin · {l("داده‌های نمونه", "Sample data")} · 2026
          </footer>
        </div>
      </main>

    </div>
  );
}

import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleLocaleRouting = createMiddleware(routing);
const handleExplicitLocaleRouting = createMiddleware({ ...routing, localeCookie: false });

export default function proxy(request: NextRequest) {
  return /^\/(en|fa)(?:\/|$)/.test(request.nextUrl.pathname)
    ? handleExplicitLocaleRouting(request)
    : handleLocaleRouting(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};

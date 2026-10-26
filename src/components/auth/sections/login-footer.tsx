"use client";
import type { LoginModel } from "../use-login-model";
type Props = Pick<LoginModel, "t">;
export function LoginFooter({ t }: Props) {
    return (<footer className="flex items-center justify-between gap-[15px] border-t border-(--line) px-6 py-5 text-[10px] text-(--muted) md:px-[5.5%] [&>span:first-child]:font-inter [&>span:first-child]:[direction:ltr] max-md:[&>span:nth-child(2)]:hidden">
        <span>© {new Date().getFullYear()} Funlands</span>
        <span>{t("footer")}</span>
        <span className="flex items-center gap-[7px] [&>span]:size-1.5 [&>span]:rounded-full [&>span]:bg-success-500">
          <span />
          {t("demoBadge")}
        </span>
      </footer>);
}

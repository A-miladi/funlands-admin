"use client";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { LanguageToggle } from "@/components/common/language-toggle";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
export function LoginHeader() {
    return (<header className="flex items-center justify-between px-6 py-5 [direction:ltr] md:px-[5.5%] md:py-7">
        <Link href="/" className="flex items-center gap-2.5 font-inter text-[22px] font-bold tracking-[-1px] md:text-[25px]" aria-label="Funlands">
          <Image src="/images/LargeLogo.webp" width={42} height={42} alt=""/>

          <span className="ms-1.5 rounded border border-(--line) px-2 py-1.5 font-inter text-[9px] font-medium tracking-[2px] text-(--muted)">
            ADMIN
          </span>
        </Link>
        <div className="flex items-center gap-3 text-(--muted)">
          <ThemeToggle />
          <span className="h-[18px] w-px bg-(--line)"/>
          <LanguageToggle href="/auth/login"/>
        </div>
      </header>);
}

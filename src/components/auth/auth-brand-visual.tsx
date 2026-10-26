"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
export function AuthBrandVisual() {
    const t = useTranslations("Auth");
    return (<aside className="relative hidden min-h-[660px] flex-col items-center justify-center text-center md:flex" aria-label={t("visualLabel")}>
      <div className="relative isolate flex aspect-square w-full max-w-[420px] items-center justify-center" aria-hidden="true">
        <Image src="/images/LargeBg.webp" width={1244} height={1377} alt="" className="absolute opacity-10 dark:opacity-100 w-[93%]"/>
        <Image src="/images/LargeBg.webp" width={1244} height={1377} alt="" className="absolute opacity-10 dark:opacity-100 w-[73%]"/>

        <div className="relative z-10 flex size-[60%] items-center justify-center">
          <div className="absolute inset-6 -z-10"/>
          <Image src="/images/LargeLogo.webp" width={640} height={640} alt="" preload className="w-full "/>
        </div>
        <span className="absolute start-[7%] top-[16%] text-3xl text-primary-300">
          ✦
        </span>
        <span className="absolute end-[9%] bottom-[18%] text-xl text-fuchsia-400">
          ✦
        </span>
        <span className="absolute end-[8%] top-[16%] size-2 rounded-full bg-info-400 shadow-[0_0_18px_#36bffa70]"/>
        <span className="absolute start-[8%] bottom-[24%] size-1.5 rounded-full bg-primary-400"/>
        <div className="absolute -bottom-1 flex items-center gap-2 rounded-full border border-primary-300/15 bg-white/80 px-4 py-2 text-[10px] text-base-600 shadow-lg backdrop-blur-xl dark:bg-background-200/80 dark:text-primary-200">
          <span className="size-1.5 rounded-full bg-success-500"/>
          {t("skinBadge")}
        </div>
      </div>
      <div className="relative mt-9">
        <span className="font-inter text-[9px] tracking-[3px] text-primary-400">
          FUNLANDS MANAGEMENT
        </span>
        <h2 className="mt-4 mb-3 font-orbitron text-[30px] leading-[1.65] font-bold lg:text-[35px] ltr:leading-tight ltr:tracking-tight">
          {t("visualTitle")}
          <br />
          <span className="text-primary-400">{t("visualAccent")}</span>
        </h2>
        <p className="mx-auto max-w-[320px] text-xs leading-[2.1] text-base-600 dark:text-paragraph">
          {t("visualDescription")}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-base-600 dark:text-paragraph">
        <span>{t("games")}</span>
        <i className="size-[3px] rounded-full bg-primary-400"/>
        <span>{t("content")}</span>
        <i className="size-[3px] rounded-full bg-primary-400"/>
        <span>{t("analytics")}</span>
      </div>
    </aside>);
}

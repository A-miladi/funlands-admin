"use client";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { AuthBrandVisual } from "./auth-brand-visual";
import { useLoginModel } from "./use-login-model";
import { LoginHeader } from "./sections/login-header";
import { LoginForm } from "./sections/login-form";
import { DemoCredentials } from "./sections/demo-credentials";
import { LoginFooter } from "./sections/login-footer";
export function LoginScreen() {
    const model = useLoginModel();
    const { t } = model;
    return (<main className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-background [--surface:#fff] [--line:var(--color-base-300)] [--muted:var(--color-base-600)] dark:[--surface:#120b24] dark:[--line:#ffffff12] dark:[--muted:var(--color-paragraph)] [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-primary-400 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-primary-400">
      <LoginHeader />

      <div className="m-auto grid w-[min(1120px,90%)] grid-cols-1 items-center gap-10 py-10 max-md:w-[min(460px,calc(100%-40px))] md:grid-cols-[minmax(350px,460px)_1fr] lg:gap-20 lg:pb-14">
        <section className="relative rounded-3xl border border-(--line) bg-(--surface) px-7 py-8 shadow-[0_20px_70px_#00000008] md:px-9 dark:border-t-primary-200/15 dark:shadow-[0_24px_100px_#0002]" aria-labelledby="login-title">
 <>
              <div className="mb-[18px] flex justify-center ">
                <Image src="/images/LargeLogo.webp" width={56} height={56} alt="Funlands"/>
              </div>
              <div className="text-center [&_h1]:my-2 [&_h1]:font-orbitron [&_h1]:text-[27px] [&_h1]:leading-normal [&_h1]:font-bold md:[&_h1]:text-[29px] [&_p]:text-xs [&_p]:leading-6 [&_p]:text-(--muted) ltr:[&_h1]:tracking-tight">
                <span className="text-[11px] font-medium tracking-wide text-primary-400">
                  {t("welcome")}
                </span>
                <h1 id="login-title">{t("title")}</h1>
                <p>{t("description")}</p>
              </div>
              <LoginForm {...model}/>
              <DemoCredentials {...model}/>
              <div className="mt-[22px] flex items-center justify-center gap-2 border-t border-(--line) pt-5 text-[10px] text-(--muted) [&_svg]:size-[15px] [&_svg]:shrink-0">
                <Icon name="shield"/>
                <span>{t("security")}</span>
              </div>
            </>
        </section>

        <AuthBrandVisual />
      </div>
      <LoginFooter {...model}/>
    </main>);
}

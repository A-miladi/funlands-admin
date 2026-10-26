"use client";
import { SectionHeading } from "@/components/ui/section-heading";
import Image from "next/image";
import { muted } from "../dashboard-styles";
import { Card } from "@/components/ui/card";
import type { DashboardModel } from "../use-dashboard-model";
type Props = Pick<DashboardModel, "t" | "number">;
export function ContentSummary({ t, number }: Props) {
    return (<Card as="section" id="library" className={`scroll-mt-5 p-5`}>
            <SectionHeading title={t("contentTitle")} description={t("contentDescription")}/>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
            { type: "books", count: 48, image: "Book" },
            { type: "videos", count: 36, image: "Video" },
            { type: "audio", count: 24, image: "Audio" },
            { type: "drawings", count: 128, image: "Paint" },
        ].map((c) => (<div key={c.type} className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 p-3 dark:border-white/[.05] dark:bg-white/[.015]">
                  <Image src={`/images/${c.image}.webp`} width={40} height={40} alt="" className="size-10 object-contain"/>
                  <div>
                    <p className={`text-[10px] ${muted}`}>{t(c.type)}</p>
                    <strong className="font-inter text-lg font-medium">
                      {number(c.count)}
                    </strong>
                  </div>
                </div>))}
            </div>
          </Card>);
}

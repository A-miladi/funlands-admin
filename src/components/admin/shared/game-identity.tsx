"use client";

import Image from "next/image";
import type { Game } from "@/lib/admin/types";
import { useAdmin } from "../admin-context";
import { muted } from "./widgets";

export function GameIdentity({ game, showId = false }: { game?: Game; showId?: boolean }) {
  const { locale } = useAdmin();
  if (!game) return <span>—</span>;
  return (
    <span className="inline-flex items-center gap-3 text-start align-middle">
      <Image src={game.cover} width={40} height={40} alt="" className="size-10 shrink-0 rounded-lg bg-primary-500/5 object-cover" />
      <span className="min-w-0">
        <span className="block font-medium">{game.title[locale]}</span>
        {showId && <small className={`block font-inter ${muted}`}>{game.id}</small>}
      </span>
    </span>
  );
}

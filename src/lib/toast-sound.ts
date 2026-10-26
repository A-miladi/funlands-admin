"use client";

import type { ToastKind } from "@/components/ui/toast-card/toast-card.types";

const sounds = {
  success: { src: "/audio/success.mp3", start: 0.02 },
  error: { src: "/audio/error.mp3", start: 0.595 },
};
const players = new Map<keyof typeof sounds, HTMLAudioElement>();

function playerFor(kind: keyof typeof sounds) {
  let player = players.get(kind);
  if (!player) {
    player = new Audio(sounds[kind].src);
    player.preload = "auto";
    players.set(kind, player);
  }
  return player;
}

/** Warm both small clips on first interaction, before a notification is needed. */
export function prepareToastSounds() {
  if (typeof window === "undefined") return;
  try {
    playerFor("success");
    playerFor("error");
  } catch {
    // Sound is optional; notifications must always remain usable.
  }
}

/** Called before publishing the toast, without delaying its rendering. */
export function playToastSound(kind: ToastKind) {
  if (typeof window === "undefined" || !["success", "error", "warning"].includes(kind)) return;
  const key = kind === "success" ? "success" : "error";
  try {
    for (const player of players.values()) player.pause();
    const player = playerFor(key);
    player.currentTime = sounds[key].start;
    void player.play().catch(() => {
      // Autoplay can be blocked until a user gesture.
    });
  } catch {
    // An unavailable audio device must not prevent the toast from appearing.
  }
}

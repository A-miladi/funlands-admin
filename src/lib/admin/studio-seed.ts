import type { Game, User, Content } from "./types";
import { studioKinds, studioSections, type StudioRecord, type StudioSection, type StudioKind } from "./studio";

export function createStudioSeed(games: Game[], users: User[], contents: Content[]): StudioRecord[] {
  const rows: StudioRecord[] = [];
  const add = (kind: StudioKind, i: number, title: [string, string], fields: Record<string, string>, status?: string) => {
    const config: StudioSection = studioSections[kind];
    rows.push({ id: `${kind}_${i + 1}`, skinId: "funlands", kind, title: { fa: title[0], en: title[1] }, status: status ?? config.statuses[i % config.statuses.length], image: `/images/mock/${kind === "landing" ? "game" : "media"}${i % 4 + 1}.webp`, position: i + 1, fields, updatedAt: "2026-10-26T09:00:00Z" });
  };
  const categories = [["game", "ماجراجویی", "Adventure"], ["tool", "خلاقیت", "Creativity"], ["book", "داستان", "Stories"], ["video", "آموزشی", "Learning"], ["painting", "حیوانات", "Animals"], ["avatar", "شخصیت‌ها", "Characters"]];
  categories.forEach(([kind, fa, en], i) => add("categories", i, [fa, en], { kind, slug: en.toLowerCase(), description: "" }, "active"));
  ["magic-of-colors", "land-of-animals", "baby-detective", "little-pleasures", "adventure-with-shapes", "playful-balls"].forEach((slug, i) => add("landing", i, [["جادوی رنگ‌ها", "سرزمین حیوانات", "کارآگاه کوچک", "لذت‌های کوچک", "ماجراجویی با شکل‌ها", "توپ‌های بازیگوش"][i], slug.replaceAll("-", " ")], { slug, kind: i % 2 ? "row" : "slider", style: i % 2 ? "carousel" : "hero", group: "discover", pin: "start", games: games.slice(i % 3, i % 3 + 3).map(g => g.id).join(","), description: "Demo featured games", video: "" }, i === 5 ? "draft" : "published"));
  for (let i = 0; i < 12; i++) {
    add("avatars", i, [`شخصیت ${i + 1}`, `Character ${i + 1}`], { code: `avatar-${i + 1}`, categoryId: "categories_6", mobileImage: `/images/mock/game${i % 4 + 1}.webp`, optimizedImage: `/images/mock/game${i % 4 + 1}.webp` }, i === 10 ? "inactive" : "active");
    rows.at(-1)!.image = `/images/mock/game${i % 4 + 1}.webp`;
    add("moderation", i, [`اثر خلاقانه ${i + 1}`, `Creative work ${i + 1}`], { userId: users[i].id, contentId: contents[i].id, kind: i % 2 ? "video" : "painting", description: "A fictional user submission for review.", reason: i % 3 === 2 ? "Demo: unsuitable category / دسته‌بندی نامناسب" : "" });
  }
  for (const kind of studioKinds) if (!rows.some(r => r.kind === kind)) throw new Error(`Missing demo section: ${kind}`);
  return rows;
}

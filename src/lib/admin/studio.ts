import type { Permission } from "./types";

export type StudioField = {
  key: string;
  label: [string, string];
  type?:
    | "number"
    | "textarea"
    | "image"
    | "games"
    | "user"
    | "category"
    | "content";
  options?: string[];
  required?: boolean;
};
export type StudioSection = {
  label: [string, string];
  description: [string, string];
  read: Permission;
  write: Permission;
  statuses: string[];
  fields: StudioField[];
  image?: boolean;
  ordered?: boolean;
};
const field = (
  key: string,
  fa: string,
  en: string,
  type?: StudioField["type"],
  options?: string[],
): StudioField => ({ key, label: [fa, en], type, options });
export const studioSections = {
  landing: {
    label: ["چیدمان صفحه اصلی", "Homepage sections"],
    description: [
      "سکشن‌ها، بنرها، بازی‌های منتخب و ترتیب نمایش",
      "Sections, banners, featured games and display order",
    ],
    read: "games:read",
    write: "games:write",
    statuses: ["draft", "published", "inactive"],
    image: true,
    ordered: true,
    fields: [
      field("slug", "نامک", "Slug"),
      field("kind", "نوع سکشن", "Section type", undefined, ["row", "slider"]),
      field("style", "سبک نمایش", "Display style", undefined, [
        "hero",
        "carousel",
        "video",
        "mixed",
      ]),
      field("group", "گروه", "Group"),
      field("pin", "موقعیت گروه", "Group position", undefined, [
        "start",
        "end",
      ]),
      field("games", "بازی‌های سکشن", "Section games", "games"),
      field("description", "توضیحات", "Description", "textarea"),
      field("video", "نشانی ویدئوی معرفی", "Trailer URL"),
    ],
  },
  categories: {
    label: ["دسته‌بندی‌ها", "Categories"],
    description: [
      "دسته‌بندی بازی، ابزار، کتاب، ویدئو و نقاشی",
      "Categories for games, tools, books, videos and paintings",
    ],
    read: "content:read",
    write: "content:write",
    statuses: ["active", "inactive"],
    image: true,
    ordered: true,
    fields: [
      field("kind", "بخش", "Kind", undefined, [
        "game",
        "tool",
        "book",
        "video",
        "painting",
        "avatar",
      ]),
      field("slug", "نامک", "Slug"),
      field("description", "توضیحات", "Description", "textarea"),
    ],
  },
  avatars: {
    label: ["آواتارها", "Avatars"],
    description: [
      "کتابخانه آواتار، دسته‌بندی و تصاویر دستگاه‌ها",
      "Avatar library, categories and device images",
    ],
    read: "content:read",
    write: "content:write",
    statuses: ["active", "inactive"],
    image: true,
    ordered: true,
    fields: [
      field("code", "کد", "Code"),
      field("categoryId", "دسته‌بندی", "Category", "category"),
      field("mobileImage", "تصویر موبایل", "Mobile image", "image"),
      field("optimizedImage", "تصویر بهینه", "Optimized image", "image"),
    ],
  },
  moderation: {
    label: ["بررسی محتوای کاربران", "Content moderation"],
    description: [
      "صف تأیید و رد ویدئو و نقاشی با ثبت دلیل",
      "Review user videos and paintings with recorded decisions",
    ],
    read: "content:read",
    write: "content:write",
    statuses: ["pending", "approved", "rejected"],
    image: true,
    fields: [
      field("userId", "سازنده", "Creator", "user"),
      field("contentId", "محتوای مرتبط", "Related content", "content"),
      field("kind", "نوع محتوا", "Content type", undefined, [
        "video",
        "painting",
      ]),
      field("description", "توضیح سازنده", "Creator description", "textarea"),
      field("reason", "دلیل تصمیم", "Decision reason", "textarea"),
    ],
  },
} satisfies Record<string, StudioSection>;
export type StudioKind = keyof typeof studioSections;
export type StudioRecord = {
  id: string;
  skinId: string;
  kind: StudioKind;
  title: { fa: string; en: string };
  status: string;
  image: string;
  position: number;
  fields: Record<string, string>;
  updatedAt: string;
};
export const studioKinds = Object.keys(studioSections) as StudioKind[];
export const statusNames: Record<string, [string, string]> = {
  draft: ["پیش‌نویس", "Draft"],
  published: ["منتشرشده", "Published"],
  inactive: ["غیرفعال", "Inactive"],
  active: ["فعال", "Active"],
  pending: ["در انتظار بررسی", "Pending"],
  approved: ["تأییدشده", "Approved"],
  rejected: ["ردشده", "Rejected"],
};

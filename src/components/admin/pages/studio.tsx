"use client";

import Image from "next/image";
import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  studioSections,
  statusNames,
  type StudioKind,
  type StudioSection,
  type StudioRecord,
  type StudioField,
} from "@/lib/admin/studio";
import { useAdmin } from "../admin-context";
import { GameIdentity } from "../shared/game-identity";
import { ExportButtons } from "../shared/export-buttons";
import {
  Heading,
  Panel,
  Table,
  Badge,
  Search,
  Stats,
  Modal,
  FormActions,
  ErrorNote,
  Info,
  fieldClass,
  muted,
} from "../shared/widgets";

const optionNames: Record<string, [string, string]> = {
  row: ["ردیف", "Row"],
  slider: ["اسلایدر", "Slider"],
  hero: ["بنر اصلی", "Hero"],
  carousel: ["چرخشی", "Carousel"],
  video: ["ویدئو", "Video"],
  mixed: ["ترکیبی", "Mixed"],
  start: ["ابتدا", "Start"],
  end: ["انتها", "End"],
  game: ["بازی", "Game"],
  tool: ["ابزار", "Tool"],
  book: ["کتاب", "Book"],
  painting: ["نقاشی", "Painting"],
  avatar: ["آواتار", "Avatar"],
};
const isGood = (status: string) =>
  ["active", "published", "approved"].includes(status);
const isBad = (status: string) => status === "rejected";

function StudioEditor({
  kind,
  record,
  onClose,
}: {
  kind: StudioKind;
  record?: StudioRecord;
  onClose: () => void;
}) {
  const { data, l, locale, mutate } = useAdmin();
  const config: StudioSection = studioSections[kind];
  const [titleFa, setFa] = useState(record?.title.fa ?? "");
  const [titleEn, setEn] = useState(record?.title.en ?? "");
  const [status, setStatus] = useState(record?.status ?? config.statuses[0]);
  const [image, setImage] = useState(
    record?.image || "/images/mock/media1.webp",
  );
  const [position, setPosition] = useState(
    record?.position ??
      (data?.studio.filter((row) => row.kind === kind).length ?? 0) + 1,
  );
  const [fields, setFields] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      config.fields.map((field) => [
        field.key,
        record?.fields[field.key] ?? field.options?.[0] ?? "",
      ]),
    ),
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key: string, value: string) =>
    setFields((current) => ({ ...current, [key]: value }));
  const label = (pair: [string, string]) => l(...pair);
  const assets = Array.from({ length: 4 }, (_, i) =>
    ["game", "media"].map((type) => `/images/mock/${type}${i + 1}.webp`),
  ).flat();
  const optionsFor = (field: StudioField) => {
    if (field.type === "user")
      return data!.users.map((u) => ({ value: u.id, label: u.id }));
    if (field.type === "content")
      return data!.contents.map((c) => ({
        value: c.id,
        label: c.title,
        image: c.cover,
      }));
    if (field.type === "category")
      return data!.studio
        .filter(
          (row) =>
            row.kind === "categories" &&
            (kind !== "avatars" || row.fields.kind === "avatar"),
        )
        .map((row) => ({
          value: row.id,
          label: row.title[locale],
          image: row.image,
        }));
    if (field.type === "image")
      return assets.map((path) => ({
        value: path,
        label: path.split("/").at(-1)!,
        image: path,
      }));
    return (field.options ?? []).map((value) => ({
      value,
      label: optionNames[value] ? label(optionNames[value]) : value,
    }));
  };
  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await mutate(
        `studio/${kind}${record ? `/${record.id}` : ""}`,
        record ? "PATCH" : "POST",
        {
          titleFa,
          titleEn,
          status,
          image: config.image ? image : "",
          position,
          fields,
        },
      );
      onClose();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={
        l(record ? "ویرایش" : "افزودن", record ? "Edit" : "Add") +
        " · " +
        label(config.label)
      }
      onClose={onClose}
    >
      <form onSubmit={save} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs">
            {l("عنوان فارسی", "Persian title")}
            <Input
              required
              maxLength={100}
              value={titleFa}
              onChange={(e) => setFa(e.target.value)}
              className={`${fieldClass} mt-2`}
            />
          </label>
          <label className="text-xs">
            {l("عنوان انگلیسی", "English title")}
            <Input
              required
              maxLength={100}
              value={titleEn}
              onChange={(e) => setEn(e.target.value)}
              className={`${fieldClass} mt-2`}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs">
            {l("وضعیت", "Status")}
            <Select
              className="mt-2"
              aria-label={l("وضعیت", "Status")}
              value={status}
              onValueChange={setStatus}
              options={config.statuses.map((value) => ({
                value,
                label: statusNames[value] ? label(statusNames[value]) : value,
              }))}
            />
          </label>
          {config.ordered && (
            <label className="text-xs">
              {l("ترتیب نمایش", "Display order")}
              <Input
                type="number"
                min={1}
                max={10000}
                required
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className={`${fieldClass} mt-2 max-w-24`}
              />
            </label>
          )}
        </div>
        {config.image && (
          <div className="flex items-center gap-3">
            <Image
              src={image}
              width={64}
              height={64}
              alt=""
              className="size-16 rounded-xl object-cover"
            />
            <Select
              aria-label={l("تصویر", "Image")}
              value={image}
              onValueChange={setImage}
              options={assets.map((path) => ({
                value: path,
                label: path.split("/").at(-1)!,
                image: path,
              }))}
            />
          </div>
        )}
        {config.fields.map((field) => (
          <div key={field.key} className="text-xs">
            {field.type === "games" ? (
              <fieldset>
                <legend className="mb-3">{label(field.label)}</legend>
                <div className="grid max-h-52 grid-cols-2 gap-3 overflow-auto rounded-xl border border-base-300 p-3 dark:border-white/10">
                  {data?.games.map((game) => (
                    <label key={game.id} className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        checked={(fields[field.key] || "")
                          .split(",")
                          .includes(game.id)}
                        onChange={(e) => {
                          const selected = (fields[field.key] || "")
                            .split(",")
                            .filter(Boolean);
                          set(
                            field.key,
                            (e.target.checked
                              ? [...selected, game.id]
                              : selected.filter((id) => id !== game.id)
                            ).join(","),
                          );
                        }}
                      />
                      <GameIdentity game={game} />
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : field.options ||
              ["user", "category", "content", "image"].includes(
                field.type ?? "",
              ) ? (
              <label className="block">
                {label(field.label)}
                <Select
                  className="mt-2"
                  aria-label={label(field.label)}
                  value={fields[field.key]}
                  onValueChange={(value) => set(field.key, value)}
                  options={[
                    ...(field.options
                      ? []
                      : [
                          {
                            value: "",
                            label: l("انتخاب نشده", "Not selected"),
                          },
                        ]),
                    ...optionsFor(field),
                  ]}
                />
              </label>
            ) : (
              <label className="block">
                {label(field.label)}
                {field.type === "textarea" ? (
                  <textarea
                    maxLength={4000}
                    value={fields[field.key]}
                    onChange={(e) => set(field.key, e.target.value)}
                    className={`${fieldClass} mt-2 h-24 py-3`}
                  />
                ) : (
                  <Input
                    maxLength={500}
                    required={field.required}
                    type="text"
                    value={fields[field.key]}
                    onChange={(e) => set(field.key, e.target.value)}
                    className={`${fieldClass} mt-2`}
                  />
                )}
              </label>
            )}
          </div>
        ))}
        {kind === "moderation" && (
          <Info>
            {l(
              "برای رد محتوا، دلیل تصمیم را وارد کنید.",
              "A decision reason is required when rejecting content.",
            )}
          </Info>
        )}
        <ErrorNote error={error} />
        <FormActions busy={busy} onCancel={onClose} />
      </form>
    </Modal>
  );
}

export function StudioPage({ kind }: { kind: StudioKind }) {
  const { data, l, locale, can, number, date, mutate } = useAdmin();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [editing, setEditing] = useState<StudioRecord | "new" | null>(null);
  const [preview, setPreview] = useState<StudioRecord | null>(null);
  const [deleting, setDeleting] = useState<StudioRecord | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const config: StudioSection = studioSections[kind];
  if (!data) return null;
  const label = (pair: [string, string]) => l(...pair);
  const rows = data.studio
    .filter((row) => row.kind === kind)
    .sort(
      (a, b) =>
        a.position - b.position || a.updatedAt.localeCompare(b.updatedAt),
    );
  const listed = rows.filter(
    (row) =>
      (status === "all" || row.status === status) &&
      (type === "all" || row.fields.kind === type) &&
      `${row.title.fa} ${row.title.en} ${row.id} ${Object.values(row.fields).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const kindField = config.fields.find(
    (field) => field.key === "kind" && field.options,
  );
  const editable = can(config.write);
  const deletePermission =
    kind === "landing" ? "games:write" : "content:delete";
  function valueView(field: StudioField, value: string): ReactNode {
    if (!value) return "—";
    if (field.type === "games")
      return (
        <div className="flex flex-wrap gap-3">
          {value.split(",").map((id) => (
            <GameIdentity
              key={id}
              game={data!.games.find((game) => game.id === id)}
            />
          ))}
        </div>
      );
    if (field.type === "user")
      return can("users:read") ? (
        <Link
          href={`/users/${value}`}
          className="font-inter text-primary-600 dark:text-primary-300"
        >
          {value}
        </Link>
      ) : (
        value
      );
    if (field.type === "category")
      return data!.studio.find((row) => row.id === value)?.title[locale] ?? "—";
    if (field.type === "content") {
      const content = data!.contents.find((row) => row.id === value);
      return content ? (
        <Link
          href={`/content/${value}`}
          className="text-primary-600 dark:text-primary-300"
        >
          {content.title}
        </Link>
      ) : (
        "—"
      );
    }
    if (field.type === "image")
      return (
        <Image
          src={value}
          width={64}
          height={64}
          alt=""
          className="size-16 rounded-xl object-cover"
        />
      );
    return optionNames[value] ? label(optionNames[value]) : value;
  }
  const metrics = [
    { label: l("کل موارد", "Total records"), value: number(rows.length) },
    ...config.statuses
      .slice(0, 4)
      .map((value) => ({
        label: label(statusNames[value] ?? [value, value]),
        value: number(rows.filter((row) => row.status === value).length),
      })),
  ];
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setError("");
    try {
      await mutate(`studio/${kind}/${deleting.id}`, "DELETE");
      setDeleting(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const summaryFields = config.fields
    .filter(
      (field) =>
        field.options || ["user", "category"].includes(field.type ?? ""),
    )
    .slice(0, 3)
    .map((field) => field.key);
  return (
    <>
      <Heading
        title={label(config.label)}
        description={label(config.description)}
      >
        <ExportButtons
          name={kind}
          rows={[
            [
              "id",
              "title",
              "status",
              "order",
              ...config.fields.map((field) => field.key),
            ],
            ...listed.map((row) => [
              row.id,
              row.title[locale],
              row.status,
              row.position,
              ...config.fields.map((field) => row.fields[field.key] ?? ""),
            ]),
          ]}
        />
        {editable && (
          <Button variant="outline" onClick={() => setEditing("new")}>
            {l("افزودن +", "Add +")}
          </Button>
        )}
      </Heading>
      <Info>
        {l(
          "محیط نمایشی · تغییرات فقط در حافظه سرور این پنل ذخیره می‌شوند و با راه‌اندازی مجدد بازنشانی می‌شوند. این بخش به وب یا سرویس خارجی متصل نیست.",
          "Demo workspace · Changes live in this panel's server memory and reset on restart. This section is not connected to the website or external services.",
        )}
      </Info>
      <Stats items={metrics} />
      {kind === "landing" && (
        <Panel
          title={l("پیش‌نمایش ترتیب صفحه اصلی", "Homepage order preview")}
          className="mb-5"
        >
          <div className="flex gap-3 overflow-x-auto pb-2">
            {rows
              .filter((row) => row.status === "published")
              .map((row) => (
                <button
                  type="button"
                  key={row.id}
                  onClick={() => setPreview(row)}
                  className="min-w-44 rounded-xl border border-base-300 p-3 text-start text-xs hover:border-primary-400 dark:border-white/10"
                >
                  <Image
                    src={row.image}
                    width={176}
                    height={80}
                    alt=""
                    className="mb-3 h-20 w-full rounded-lg object-cover"
                  />
                  <span className="block">
                    {number(row.position)} · {row.title[locale]}
                  </span>
                  <small className={muted}>
                    {row.fields.style} ·{" "}
                    {number(row.fields.games.split(",").filter(Boolean).length)}{" "}
                    {l("بازی", "games")}
                  </small>
                </button>
              ))}
          </div>
        </Panel>
      )}
      <Panel>
        <div className="mb-5 flex flex-wrap gap-3">
          <Search
            value={query}
            onChange={setQuery}
            label={l("جست‌وجو", "Search")}
          />
          <Select
            aria-label={l("فیلتر وضعیت", "Filter status")}
            value={status}
            onValueChange={setStatus}
            options={[
              { value: "all", label: l("همه وضعیت‌ها", "All statuses") },
              ...config.statuses.map((value) => ({
                value,
                label: label(statusNames[value] ?? [value, value]),
              })),
            ]}
          />
          {kindField && (
            <Select
              aria-label={l("فیلتر نوع", "Filter type")}
              value={type}
              onValueChange={setType}
              options={[
                { value: "all", label: l("همه انواع", "All types") },
                ...kindField.options!.map((value) => ({
                  value,
                  label: optionNames[value] ? label(optionNames[value]) : value,
                })),
              ]}
            />
          )}
        </div>
        <Table
          columns={[
            l("عنوان", "Title"),
            ...summaryFields.map((key) =>
              label(config.fields.find((field) => field.key === key)!.label),
            ),
            l("وضعیت", "Status"),
            config.ordered ? l("ترتیب", "Order") : l("آخرین تغییر", "Updated"),
            l("عملیات", "Actions"),
          ]}
          rows={listed.map((row) => ({
            id: row.id,
            cells: [
              <button
                key="title"
                type="button"
                onClick={() => setPreview(row)}
                className="flex items-center gap-3 text-start text-primary-600 dark:text-primary-300"
              >
                {config.image && row.image && (
                  <Image
                    src={row.image}
                    width={40}
                    height={40}
                    alt=""
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                )}
                <span>
                  <span className="block font-medium">{row.title[locale]}</span>
                  <small className={`block font-inter ${muted}`}>
                    {row.id}
                  </small>
                </span>
              </button>,
              ...summaryFields.map((key) => (
                <span key={key}>
                  {valueView(
                    config.fields.find((field) => field.key === key)!,
                    row.fields[key],
                  )}
                </span>
              )),
              <Badge
                key="status"
                tone={
                  isGood(row.status)
                    ? "success"
                    : isBad(row.status)
                      ? "error"
                      : "warning"
                }
              >
                {label(statusNames[row.status] ?? [row.status, row.status])}
              </Badge>,
              config.ordered ? number(row.position) : date(row.updatedAt),
              <div key="actions" className="flex gap-2">
                <Button variant="outline" onClick={() => setPreview(row)}>
                  {l("جزئیات", "Details")}
                </Button>
                {editable && (
                  <Button variant="outline" onClick={() => setEditing(row)}>
                    {l(
                      kind === "moderation" ? "بررسی" : "ویرایش",
                      kind === "moderation" ? "Review" : "Edit",
                    )}
                  </Button>
                )}
                {editable && can(deletePermission) && (
                  <Button
                    variant="outline"
                    className="text-error-500"
                    onClick={() => {
                      setError("");
                      setDeleting(row);
                    }}
                  >
                    {l("حذف", "Delete")}
                  </Button>
                )}
              </div>,
            ],
          }))}
        />
      </Panel>
      {editing && (
        <StudioEditor
          kind={kind}
          record={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}
      {preview && (
        <Modal title={preview.title[locale]} onClose={() => setPreview(null)}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <Badge>
              {label(
                statusNames[preview.status] ?? [preview.status, preview.status],
              )}
            </Badge>
            <span className={`font-inter text-xs ${muted}`}>{preview.id}</span>
          </div>
          {config.image && preview.image && (
            <Image
              src={preview.image}
              width={560}
              height={280}
              alt={preview.title[locale]}
              className="mb-5 max-h-64 w-full rounded-xl object-contain"
            />
          )}
          <dl className="space-y-4">
            {config.fields.map((field) => (
              <div
                key={field.key}
                className="border-b border-base-300 pb-3 text-xs dark:border-white/10"
              >
                <dt className={`mb-2 ${muted}`}>{label(field.label)}</dt>
                <dd className="whitespace-pre-wrap break-words leading-6">
                  {valueView(field, preview.fields[field.key])}
                </dd>
              </div>
            ))}
          </dl>
          {editable && (
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setEditing(preview);
                setPreview(null);
              }}
            >
              {l("ویرایش / رسیدگی", "Edit / review")}
            </Button>
          )}
        </Modal>
      )}
      {deleting && (
        <Modal
          title={l("حذف مورد", "Delete record")}
          onClose={() => setDeleting(null)}
        >
          <p className="mb-5 text-sm leading-7">
            {l(
              "این مورد از داده‌های نمایشی حذف شود؟",
              "Delete this record from the demo dataset?",
            )}{" "}
            <strong>{deleting.title[locale]}</strong>
          </p>
          <ErrorNote error={error} />
          <div className="mt-5 flex gap-3">
            <Button
              variant="outline"
              disabled={busy}
              className="text-error-500"
              onClick={remove}
            >
              {l("حذف", "Delete")}
            </Button>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => setDeleting(null)}
            >
              {l("انصراف", "Cancel")}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

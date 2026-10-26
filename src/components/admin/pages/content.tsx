"use client";
import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAdmin } from "../admin-context";
import type { Content, ContentType } from "@/lib/admin/types";
import { Heading, Panel, Table, Search, Status, Stats, Modal, ErrorNote, FormActions, fieldClass, muted, Badge, Info, Empty } from "../shared/widgets";
import { ExportButtons } from "../shared/export-buttons";
export function ContentEditorPage({ id }: {
    id?: string;
}) { const { data, l } = useAdmin(); if (!data)
    return null; const content = data.contents.find(c => c.id === id); if (id && !content)
    return <Heading title={l("محتوا یافت نشد", "Content not found")}/>; return <ContentEditor key={id ?? "new"} content={content}/>; }
function ContentEditor({ content }: {
    content?: Content;
}) {
    const { data, l, mutate, router, can } = useAdmin(), [title, setTitle] = useState(content?.title ?? ""), [description, setDescription] = useState(content?.description ?? ""), [type, setType] = useState<ContentType>(content?.type ?? "book"), [category, setCategory] = useState(content?.category ?? "story"), [active, setActive] = useState(content?.active ?? true), [file, setFile] = useState<File | null>(null), [cover, setCover] = useState<File | null>(null), [preview, setPreview] = useState(""), [busy, setBusy] = useState(false), [error, setError] = useState(""), [remove, setRemove] = useState(false);
    useEffect(() => () => { if (preview)
        URL.revokeObjectURL(preview); }, [preview]);
    if (!data)
        return null;
    const types: ContentType[] = ["book", "video", "audio", "drawing", "animation"], names = [l("کتاب", "Book"), l("ویدئو", "Video"), l("صوت", "Audio"), l("نقاشی", "Drawing"), l("انیمیشن", "Animation")];
    function choose(next: File | undefined) { if (!next)
        return; const ext = next.name.split(".").at(-1)?.toLowerCase() ?? ""; if (!data!.policy.allowed[type].includes(ext)) {
        setError("FILE_TYPE_NOT_ALLOWED");
        return;
    } if (next.size > data!.policy.maxFileMB * 1048576) {
        setError("FILE_TOO_LARGE");
        return;
    } setError(""); setFile(next); }
    async function save(e: FormEvent) { e.preventDefault(); setBusy(true); setError(""); try {
        if (!file && !content)
            throw Error("FILE_REQUIRED");
        const form = new FormData();
        for (const [key, value] of Object.entries({ title, description, type, category, active: String(active) }))
            form.set(key, value);
        if (file)
            form.set("file", file);
        if (cover)
            form.set("cover", cover);
        await mutate(`contents${content ? `/${content.id}` : ""}`, content ? "PATCH" : "POST", form);
        router.push("/content");
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    return <><Heading title={content ? l("ویرایش و جایگزینی محتوا", "Edit and replace content") : l("آپلود محتوای جدید", "Upload new content")}><Link href="/content" className="text-xs text-primary-400">{l("بازگشت به کتابخانه", "Back to library")}</Link></Heading><form onSubmit={save}><div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]"><Panel title={l("مشخصات محتوا", "Content details")}><div className="space-y-5"><Select aria-label={l("نوع محتوا", "Content type")} value={type} onValueChange={v => { setType(v as ContentType); setFile(null); }} options={types.map((value, i) => ({ value, label: names[i] }))}/><label className="block text-xs">{l("عنوان", "Title")}<Input required maxLength={100} value={title} onChange={e => setTitle(e.target.value)} className={`${fieldClass} mt-2`}/></label><label className="block text-xs">{l("توضیحات", "Description")}<textarea maxLength={500} value={description} onChange={e => setDescription(e.target.value)} className={`${fieldClass} mt-2 h-24 p-3`}/></label><Select aria-label={l("دسته‌بندی", "Category")} value={category} onValueChange={setCategory} options={[{ value: "story", label: l("داستان", "Story") }, { value: "science", label: l("علمی", "Science") }, { value: "education", label: l("آموزشی", "Education") }, { value: "music", label: l("موسیقی", "Music") }, { value: "creativity", label: l("خلاقیت", "Creativity") }]}/><div className="rounded-xl border border-dashed border-primary-400/40 p-6 text-center" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); choose(e.dataTransfer.files[0]); }}><p className="mb-3 text-xs">{l("فایل را اینجا بکشید یا انتخاب کنید.", "Drop a file here or choose one.")}</p><Input type="file" aria-label={l("فایل محتوا", "Content file")} accept={data.policy.allowed[type].map(ext => "." + ext).join(",")} onChange={e => choose(e.target.files?.[0])} className="max-w-full text-xs"/><p className={`mt-4 break-all text-[11px] ${muted}`}>{file?.name ?? content?.fileName ?? "—"}</p></div><Info>{l("فرمت‌های مجاز", "Allowed formats")}: {data.policy.allowed[type].join(", ")} · {l("حداکثر اندازه", "Maximum size")}: {data.policy.maxFileMB} MB · {l("ذخیره در حافظهٔ سرور نمایشی", "Stored in demo server memory")}</Info><label className="flex items-center gap-2 text-xs"><Input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)}/>{l("فعال و منتشرشده", "Active and published")}</label>{busy && <p role="status" className="text-xs text-primary-400">{l("در حال ارسال فایل…", "Uploading file…")}</p>}<ErrorNote error={error}/><FormActions busy={busy} onCancel={() => router.push("/content")}/></div></Panel><Panel title={l("کاور و پیش‌نمایش", "Cover & preview")}><div className="overflow-hidden rounded-xl bg-primary-500/5">{/* Uploaded covers use a protected same-origin URL. */}<Image unoptimized width={600} height={340} src={preview || content?.cover || "/images/mock/media1.webp"} alt={title || l("پیش‌نمایش", "Preview")} className="aspect-video w-full object-cover"/></div><p className="my-4 text-sm font-semibold">{title || l("عنوان محتوا", "Content title")}</p><label className="block text-xs">{l("تغییر کاور", "Change cover")}<Input type="file" accept="image/png,image/jpeg,image/webp" className="mt-3 max-w-full text-xs" onChange={e => { const next = e.target.files?.[0] ?? null; setCover(next); setPreview(next ? URL.createObjectURL(next) : ""); }}/></label>{content?.fileId && <a href={`/api/admin/files/${content.fileId}`} target="_blank" rel="noreferrer" className="mt-5 block text-xs text-primary-400">{l("مشاهده فایل فعلی ↗", "Open current file ↗")}</a>}{content && can("content:delete") && <Button variant="outline" className="mt-8 text-error-500" onClick={() => setRemove(true)}>{l("حذف محتوا", "Delete content")}</Button>}</Panel></div></form>{remove && content && <Modal title={l("حذف محتوا", "Delete content")} onClose={() => setRemove(false)}><p className={`mb-5 text-xs leading-6 ${muted}`}>{l("این محتوا از کتابخانه حذف نرم می‌شود و فایل از مسیر عمومی قابل دریافت نخواهد بود.", "This item is soft-deleted from the library and its file becomes inaccessible.")}</p><Button variant="outline" className="text-error-500" disabled={busy} onClick={async () => { setBusy(true); try {
        await mutate(`contents/${content.id}`, "DELETE");
        router.push("/content");
    }
    catch (e) {
        setError((e as Error).message);
        setRemove(false);
    }
    finally {
        setBusy(false);
    } }}>{l("تأیید حذف", "Confirm deletion")}</Button></Modal>}</>;
}
export function ContentPage() { const { data, l, number, date, can } = useAdmin(), [type, setType] = useState("all"), [status, setStatus] = useState("all"), [query, setQuery] = useState(""), [category, setCategory] = useState("all"), [view, setView] = useState("grid"); if (!data)
    return null; const listed = data.contents.filter(c => (type === "all" || c.type === type) && (status === "all" || c.active === (status === "active")) && (category === "all" || c.category === category) && `${c.title} ${c.id}`.toLowerCase().includes(query.toLowerCase())); const types = ["all", "book", "video", "audio", "drawing", "animation"], names = [l("همه", "All"), l("کتاب", "Books"), l("ویدئو", "Videos"), l("صوت", "Audio"), l("نقاشی", "Drawings"), l("انیمیشن", "Animations")]; return <><Heading title={l("کتابخانه محتوا", "Content library")} description={l("کتاب، ویدئو، صوت و نقاشی همین پوسته", "Books, videos, audio and drawings assigned to this skin")}><ExportButtons name="content" rows={[["id", "title", "type", "category", "active", "file_name", "file_size", "created_at"], ...listed.map(c => [c.id, c.title, c.type, c.category, c.active, c.fileName, c.fileSize, c.createdAt])]}/>{can("content:write") && <Link href="/content/new" className="rounded-xl bg-primary-500 px-4 py-3 text-xs text-white">{l("آپلود محتوا +", "Upload content +")}</Link>}</Heading><Stats items={types.slice(1).map((t, i) => ({ label: names[i + 1], value: number(data.contents.filter(c => c.type === t).length), icon: "content" }))}/><div className="mb-5 flex flex-wrap gap-2">{types.map((t, i) => <Button key={t} variant="outline" aria-pressed={type === t} onClick={() => setType(t)}>{names[i]}</Button>)}</div><div className="mb-5 flex flex-wrap gap-3"><Search label={l("جست‌وجوی محتوا", "Search content")} value={query} onChange={setQuery}/><Select aria-label={l("وضعیت", "Status")} value={status} onValueChange={setStatus} options={[{ value: "all", label: l("همه وضعیت‌ها", "All statuses") }, { value: "active", label: l("فعال", "Active") }, { value: "inactive", label: l("غیرفعال", "Inactive") }]}/><Select aria-label={l("دسته‌بندی", "Category")} value={category} onValueChange={setCategory} options={[{ value: "all", label: l("همه دسته‌ها", "All categories") }, ...[...new Set(data.contents.map(c => c.category))].map(value => ({ value, label: value }))]}/><Button variant="outline" onClick={() => setView(view === "grid" ? "table" : "grid")}>{view === "grid" ? l("نمای جدول", "Table view") : l("نمای کارت", "Grid view")}</Button></div>{view === "table" ? <Panel><Table columns={[l("عنوان", "Title"), l("نوع", "Type"), l("دسته", "Category"), l("وضعیت", "Status"), l("تاریخ", "Date"), l("عملیات", "Actions")]} rows={listed.map(c => ({ id: c.id, cells: [c.title, c.type, c.category, <Status key="s" active={c.active}/>, date(c.createdAt), <Link key="edit" className="text-primary-400" href={`/content/${c.id}`}>{l("جزئیات", "Details")}</Link>] }))}/></Panel> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{listed.map(c => <Panel key={c.id}><Image unoptimized={c.cover.startsWith("/api/")} src={c.cover} width={400} height={240} alt="" className="aspect-video w-full rounded-lg object-cover"/><div className="mt-4 flex items-start justify-between gap-3"><h2 className="text-sm font-medium leading-7">{c.title}</h2><Status active={c.active}/></div><div className="my-3 flex flex-wrap gap-2"><Badge>{c.type}</Badge><Badge>{c.category}</Badge></div><p className={`text-[10px] ${muted}`}>{number(c.fileSize / 1048576)} MB · {date(c.createdAt)}</p><Link href={`/content/${c.id}`} className="mt-4 inline-block text-xs text-primary-400">{l("جزئیات و مدیریت ←", "Details & manage →")}</Link></Panel>)}</div>}{!listed.length && <Empty />}</>; }
export function ContentDetailPage({ id }: {
    id: string;
}) { const { data, l, date, can } = useAdmin(); const c = data?.contents.find(c => c.id === id); if (!c)
    return <Heading title={l("محتوا یافت نشد", "Content not found")}/>; return <><Heading title={c.title} description={c.id}><Link href="/content" className="text-xs text-primary-400">{l("کتابخانه", "Library")}</Link>{can("content:write") && <Link href={`/content/${id}/edit`} className="rounded-xl bg-primary-500 px-4 py-3 text-xs text-white">{l("ویرایش / جایگزینی", "Edit / replace")}</Link>}</Heading><Panel><Status active={c.active}/><p className="my-4 text-xs leading-7">{c.description}</p><dl className="mb-5 space-y-2 text-xs"><p>{l("نوع / دسته", "Type / category")}: {c.type} / {c.category}</p><p>{l("فایل", "File")}: {c.fileName}</p><p>{l("ثبت / ویرایش", "Created / updated")}: {date(c.createdAt)} / {date(c.updatedAt)}</p></dl>{c.fileId ? <>{(c.type === "video" || c.type === "animation" && /\.(mp4|webm)$/i.test(c.fileName)) ? <video controls src={`/api/admin/files/${c.fileId}`} className="max-h-96 w-full rounded-xl"/> : c.type === "audio" ? <audio controls src={`/api/admin/files/${c.fileId}`} className="w-full"/> : (c.type === "drawing" || c.type === "animation" && /\.(gif|webp)$/i.test(c.fileName)) ? <Image unoptimized src={`/api/admin/files/${c.fileId}`} width={700} height={500} alt={c.title} className="max-h-96 w-auto rounded-xl object-contain"/> : null}<a href={`/api/admin/files/${c.fileId}`} target="_blank" rel="noreferrer" className="mt-5 inline-block text-xs text-primary-400">{l("مشاهده / دریافت فایل ↗", "Open / download file ↗")}</a></> : <Info>{l("این رکورد، محتوای نمونه است و فایل واقعی ندارد. برای آزمایش پیش‌نمایش، فایل خودتان را در بخش ویرایش جایگزین کنید.", "This seeded record has no real file. Replace it in the editor to test preview and download.")}</Info>}</Panel></>; }

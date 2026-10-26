"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { permissions, type Role, type Admin, type Permission } from "@/lib/admin/types";
import { useAdmin } from "../admin-context";
import { Heading, Panel, Table, Status, Badge, Modal, ErrorNote, FormActions, fieldClass, Info } from "../shared/widgets";
const permissionNames: Record<Permission, [
    string,
    string
]> = { "users:read": ["مشاهده کاربران", "View users"], "users:write": ["مدیریت کاربران", "Manage users"], "games:read": ["مشاهده بازی‌ها", "View games"], "games:write": ["ویرایش و افزودن بازی", "Manage games"], "games:status": ["تغییر وضعیت بازی", "Change game status"], "analytics:read": ["تحلیل عملکرد", "View analytics"], "errors:read": ["مشاهده خطاها", "View incidents"], "errors:write": ["رسیدگی به خطا", "Resolve incidents"], "content:read": ["مشاهده محتوا", "View content"], "content:write": ["آپلود و ویرایش محتوا", "Upload & edit content"], "content:delete": ["حذف محتوا", "Delete content"], "reports:read": ["گزارش و خروجی", "Reports & exports"], "roles:write": ["مدیریت نقش و مدیران", "Manage roles & admins"] };
function RoleEditor({ role, onClose }: {
    role?: Role;
    onClose: () => void;
}) { const { l, mutate } = useAdmin(), [nameFa, setFa] = useState(role?.name.fa ?? ""), [nameEn, setEn] = useState(role?.name.en ?? ""), [descriptionFa, setDescFa] = useState(role?.description.fa ?? ""), [descriptionEn, setDescEn] = useState(role?.description.en ?? ""), [selected, setSelected] = useState<Permission[]>(role?.permissions ?? []), [busy, setBusy] = useState(false), [error, setError] = useState(""); async function save(e: FormEvent) { e.preventDefault(); setBusy(true); try {
    await mutate(`roles${role ? `/${role.id}` : ""}`, role ? "PATCH" : "POST", { nameFa, nameEn, descriptionFa, descriptionEn, permissions: selected });
    onClose();
}
catch (e) {
    setError((e as Error).message);
}
finally {
    setBusy(false);
} } return <Modal title={l("تعریف نقش و مجوزها", "Role & permission editor")} onClose={onClose}><form onSubmit={save} className="space-y-4">{[[l("نام فارسی", "Persian name"), nameFa, setFa], [l("نام انگلیسی", "English name"), nameEn, setEn], [l("توضیح فارسی", "Persian description"), descriptionFa, setDescFa], [l("توضیح انگلیسی", "English description"), descriptionEn, setDescEn]].map(([label, value, set], i) => <label key={i} className="block text-xs">{String(label)}<Input required={i < 2} maxLength={100} className={`${fieldClass} mt-2`} value={String(value)} onChange={e => (set as (s: string) => void)(e.target.value)}/></label>)}<fieldset className="grid gap-3 sm:grid-cols-2"><legend className="mb-3 text-xs">{l("مجوزهای مستقل", "Individual permissions")}</legend>{permissions.map(permission => <label key={permission} className="flex gap-2 text-xs"><Input type="checkbox" checked={selected.includes(permission)} onChange={e => setSelected(e.target.checked ? [...selected, permission] : selected.filter(p => p !== permission))}/>{l(...permissionNames[permission])}</label>)}</fieldset><ErrorNote error={error}/><FormActions busy={busy} onCancel={onClose}/></form></Modal>; }
function AdminEditor({ admin, onClose }: {
    admin?: Admin;
    onClose: () => void;
}) { const { data, l, locale, mutate } = useAdmin(), [email, setEmail] = useState(admin?.email ?? ""), [roleId, setRole] = useState(admin?.roleId ?? data!.roles[0].id), [active, setActive] = useState(admin?.active ?? true), [busy, setBusy] = useState(false), [error, setError] = useState(""); async function save(e: FormEvent) { e.preventDefault(); setBusy(true); try {
    await mutate(`admins${admin ? `/${admin.id}` : ""}`, admin ? "PATCH" : "POST", { email, roleId, active });
    onClose();
}
catch (e) {
    setError((e as Error).message);
}
finally {
    setBusy(false);
} } return <Modal title={l("مدیر پوسته", "Skin administrator")} onClose={onClose}><form onSubmit={save} className="space-y-4"><label className="block text-xs">{l("ایمیل مدیر", "Admin email")}<Input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={`${fieldClass} mt-2`}/></label><Select aria-label={l("نقش", "Role")} value={roleId} onValueChange={setRole} options={data!.roles.map(r => ({ value: r.id, label: r.name[locale] }))}/><label className="flex gap-2 text-xs"><Input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)}/>{l("فعال", "Active")}</label><Info>{l("رمز همهٔ حساب‌های این محیط نمایشی Funlands123! است. این بخش حساب واقعی ایجاد نمی‌کند.", "All demo accounts use Funlands123!. This creates no real production account.")}</Info><ErrorNote error={error}/><FormActions busy={busy} onCancel={onClose}/></form></Modal>; }
export function RolesPage() { const { data, l, locale, number, date } = useAdmin(), [role, setRole] = useState<Role | "new" | null>(null), [admin, setAdmin] = useState<Admin | "new" | null>(null); if (!data)
    return null; return <><Heading title={l("نقش‌ها و مجوزها", "Roles & permissions")} description={l("مدیران فقط در محدودهٔ پوستهٔ خودشان دسترسی دارند.", "Administrators are restricted to their own skin.")}><Button variant="outline" onClick={() => setRole("new")}>{l("افزودن نقش +", "Add role +")}</Button><Button variant="outline" onClick={() => setAdmin("new")}>{l("افزودن مدیر +", "Add admin +")}</Button></Heading><Info>{l("مجوز حذف محتوا و تغییر وضعیت بازی مستقل‌اند. نقش خودتان را نمی‌توانید طوری تغییر دهید که مدیریت مجوزها از دست برود.", "Content deletion and game status have separate permissions. Your own role cannot lose role-management access.")}</Info><Panel title={l("نقش‌ها", "Roles")} className="mb-5"><Table columns={[l("نام نقش", "Role"), l("توضیح", "Description"), l("محدوده", "Scope"), l("تعداد مدیر", "Admins"), l("مجوزها", "Permissions"), l("عملیات", "Actions")]} rows={data.roles.map(r => ({ id: r.id, cells: [r.name[locale], r.description[locale], r.skinId, number(data.admins.filter(a => a.roleId === r.id).length), <div key="permissions" className="flex max-w-72 flex-wrap gap-1">{r.permissions.map(p => <Badge key={p}>{l(...permissionNames[p])}</Badge>)}</div>, <Button key="edit" variant="outline" onClick={() => setRole(r)}>{l("ویرایش", "Edit")}</Button>] }))}/></Panel><Panel title={l("مدیران", "Administrators")} className="mb-5"><Table columns={[l("ایمیل", "Email"), l("نقش", "Role"), l("محدوده", "Scope"), l("وضعیت", "Status"), l("عملیات", "Actions")]} rows={data.admins.map(a => ({ id: a.id, cells: [a.email, data.roles.find(r => r.id === a.roleId)?.name[locale], a.skinId, <Status key="status" active={a.active}/>, <Button key="edit" variant="outline" onClick={() => setAdmin(a)}>{l("ویرایش", "Edit")}</Button>] }))}/></Panel><Panel title={l("تاریخچه عملیات مدیریتی", "Administration audit log")}><Table columns={[l("عملیات", "Action"), l("مدیر", "Admin"), l("منبع", "Resource"), l("زمان", "Time")]} rows={data.audit.map(a => ({ id: a.id, cells: [a.action, a.adminId, a.resourceId, date(a.at)] }))}/></Panel>{role && <RoleEditor role={role === "new" ? undefined : role} onClose={() => setRole(null)}/>}{admin && <AdminEditor admin={admin === "new" ? undefined : admin} onClose={() => setAdmin(null)}/>}</>; }

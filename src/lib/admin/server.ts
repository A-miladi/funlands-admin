import { randomUUID } from "node:crypto";
import { createSeed } from "./seed";
import { aggregate, defaultFilters, filterEvents } from "./analytics";
import { permissions, eventTypes, type Dataset, type Session, type Admin, type Permission, type Game, type ContentType } from "./types";
type FileRecord = {
    id: string;
    skinId: string;
    name: string;
    type: string;
    bytes: Uint8Array;
};
type Store = {
    data: Dataset;
    sessions: Map<string, Session>;
    files: Map<string, FileRecord>;
};
const globalStore = globalThis as typeof globalThis & {
    funlandsAdmin?: Store;
};
export const store = globalStore.funlandsAdmin ??= { data: createSeed(), sessions: new Map(), files: new Map() };
export class ApiError extends Error {
    constructor(public status: number, message: string) { super(message); }
}
export function requireAdmin(request: Request) { const token = /(?:^|;\s*)funlands_session=([^;]+)/.exec(request.headers.get("cookie") ?? "")?.[1]; const session = token && store.sessions.get(token); if (!session || session.expires < Date.now())
    throw new ApiError(401, "SESSION_REQUIRED"); const admin = store.data.admins.find(a => a.id === session.adminId && a.active); if (!admin)
    throw new ApiError(401, "SESSION_REQUIRED"); return admin; }
export function roleFor(admin: Admin) { const role = store.data.roles.find(r => r.id === admin.roleId && r.skinId === admin.skinId); if (!role)
    throw new ApiError(403, "ROLE_NOT_FOUND"); return role; }
export function requirePermission(admin: Admin, permission: Permission) { if (!roleFor(admin).permissions.includes(permission))
    throw new ApiError(403, "PERMISSION_DENIED"); }
export function assertOrigin(request: Request) { const origin = request.headers.get("origin"); if (origin && origin !== new URL(request.url).origin)
    throw new ApiError(403, "ORIGIN_DENIED"); }
function text(v: unknown, max = 500) { if (typeof v !== "string" || v.length > max)
    throw new ApiError(400, "INVALID_TEXT"); return v.trim(); }
function required(v: unknown, max = 100) { const value = text(v, max); if (!value)
    throw new ApiError(400, "REQUIRED_FIELD"); return value; }
function bool(v: unknown) { if (typeof v !== "boolean")
    throw new ApiError(400, "INVALID_BOOLEAN"); return v; }
function number(v: unknown, min: number, max: number) { if (typeof v !== "number" || !Number.isInteger(v) || v < min || v > max)
    throw new ApiError(400, "INVALID_NUMBER"); return v; }
function owned<T extends {
    id: string;
    skinId: string;
}>(list: T[], id: string, admin: Admin) { const item = list.find(i => i.id === id && i.skinId === admin.skinId); if (!item)
    throw new ApiError(404, "RESOURCE_NOT_FOUND"); return item; }
function audit(admin: Admin, action: string, resourceId: string) { store.data.audit.unshift({ id: randomUUID(), skinId: admin.skinId, adminId: admin.id, action, resourceId, at: new Date().toISOString() }); }
export function scopedData(admin: Admin) {
    const data = store.data, role = roleFor(admin), can = (p: Permission) => role.permissions.includes(p);
    return { ...data,
        users: can("users:read") ? data.users.filter(x => x.skinId === admin.skinId) : [],
        games: can("games:read") || can("analytics:read") || can("errors:read") || can("users:read") ? data.games.filter(x => x.skinId === admin.skinId) : [],
        events: can("analytics:read") || can("errors:read") || can("users:read") ? data.events.filter(x => x.skinId === admin.skinId) : [],
        contents: can("content:read") ? data.contents.filter(x => x.skinId === admin.skinId && !x.deleted) : [],
        roles: can("roles:write") ? data.roles.filter(x => x.skinId === admin.skinId) : [role],
        admins: can("roles:write") ? data.admins.filter(x => x.skinId === admin.skinId) : [admin],
        audit: can("roles:write") ? data.audit.filter(x => x.skinId === admin.skinId) : [], currentAdmin: admin, currentRole: role };
}
export async function handleApi(request: Request, path: string[]): Promise<Response> {
    const [resource, id] = path;
    const method = request.method;
    if (method !== "GET")
        assertOrigin(request);
    if (resource === "login" && method === "POST") {
        const body = await request.json();
        const admin = store.data.admins.find(a => a.email === String(body.email).toLowerCase().trim() && a.active);
        if (!admin || body.password !== "Funlands123!")
            throw new ApiError(401, "INVALID_CREDENTIALS");
        const token = randomUUID();
        store.sessions.set(token, { token, adminId: admin.id, expires: Date.now() + 86400000 });
        return Response.json({ ok: true }, { headers: { "Set-Cookie": `funlands_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`, "Cache-Control": "no-store" } });
    }
    const admin = requireAdmin(request), data = store.data;
    if (resource === "logout" && method === "POST") {
        const token = /(?:^|;\s*)funlands_session=([^;]+)/.exec(request.headers.get("cookie") ?? "")?.[1];
        if (token)
            store.sessions.delete(token);
        return Response.json({ ok: true }, { headers: { "Set-Cookie": "funlands_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0" } });
    }
    if (resource === "bootstrap" && method === "GET")
        return Response.json(scopedData(admin), { headers: { "Cache-Control": "no-store" } });
    if (method === "GET" && ["users", "games", "contents", "events", "roles", "admins", "stats"].includes(resource)) {
        const scoped = scopedData(admin);
        const readPermission: Record<string, Permission> = { users: "users:read", games: "games:read", contents: "content:read", roles: "roles:write", admins: "roles:write", stats: "analytics:read" };
        if (resource === "events") {
            if (!roleFor(admin).permissions.some(p => ["analytics:read", "errors:read"].includes(p))) throw new ApiError(403, "PERMISSION_DENIED");
        } else requirePermission(admin, readPermission[resource]);
        if (resource === "stats") {
            const params = new URL(request.url).searchParams;
            const filters = { ...defaultFilters };
            for (const key of Object.keys(filters) as (keyof typeof filters)[]) if (params.has(key)) filters[key] = params.get(key)!;
            return Response.json(aggregate(filterEvents(scoped, filters)));
        }
        const rows = scoped[resource as "users" | "games" | "contents" | "events" | "roles" | "admins"];
        if (id) { const item = rows.find(item => item.id === id); if (!item) throw new ApiError(404, "RESOURCE_NOT_FOUND"); return Response.json(item); }
        return Response.json(rows);
    }
    if (resource === "files" && method === "GET") {
        requirePermission(admin, "content:read");
        const file = store.files.get(id);
        if (!file || file.skinId !== admin.skinId || !data.contents.some(c => !c.deleted && c.skinId === admin.skinId && (c.fileId === id || c.cover === `/api/admin/files/${id}`)))
            throw new ApiError(404, "RESOURCE_NOT_FOUND");
        return new Response(new Uint8Array(file.bytes), { headers: { "Content-Type": file.type || "application/octet-stream", "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(file.name)}`, "X-Content-Type-Options": "nosniff", "Cache-Control": "private, no-store", "Content-Security-Policy": "sandbox" } });
    }
    if (resource === "users") {
        if (method !== "POST" && method !== "PATCH") throw new ApiError(405, "METHOD_NOT_ALLOWED");
        requirePermission(admin, "users:write");
        const body = await request.json();
        const assigned = body.assignedGames;
        if (!Array.isArray(assigned) || !assigned.every(x => typeof x === "string" && data.games.some(g => g.id === x && g.skinId === admin.skinId)))
            throw new ApiError(400, "INVALID_ASSIGNMENTS");
        if (method === "POST") {
            const user = { id: `usr_${randomUUID().slice(0, 8)}`, skinId: admin.skinId, joinedAt: new Date().toISOString(), active: bool(body.active), assignedGames: [...new Set(assigned)] as string[] };
            data.users.push(user);
            audit(admin, "user.create", user.id);
            return Response.json(user);
        }
        if (method === "PATCH") {
            const user = owned(data.users, id, admin);
            user.active = bool(body.active);
            user.assignedGames = [...new Set(assigned)] as string[];
            audit(admin, "user.update", id);
            return Response.json(user);
        }
    }
    if (resource === "games") {
        if (method !== "POST" && method !== "PATCH")
            throw new ApiError(405, "METHOD_NOT_ALLOWED");
        requirePermission(admin, "games:write");
        const body = await request.json();
        const current = id ? owned(data.games, id, admin) : undefined;
        const active = bool(body.active);
        if (!current || current.active !== active || current.publication !== body.publication)
            requirePermission(admin, "games:status");
        if (!["draft", "published"].includes(body.publication))
            throw new ApiError(400, "INVALID_STATUS");
        const cover = required(body.cover, 200);
        if (!/^\/images\/[\w/.-]+\.(webp|png|jpg)$/.test(cover))
            throw new ApiError(400, "INVALID_COVER");
        const game: Game = { id: current?.id ?? `game_${randomUUID().slice(0, 8)}`, skinId: admin.skinId, title: { fa: required(body.titleFa), en: required(body.titleEn) }, description: { fa: text(body.descriptionFa), en: text(body.descriptionEn) }, cover, version: required(body.version, 30), levels: number(body.levels, 1, 50), active, publication: body.publication, category: required(body.category, 60), updatedAt: new Date().toISOString() };
        if (current)
            Object.assign(current, game);
        else
            data.games.push(game);
        audit(admin, current ? "game.update" : "game.create", game.id);
        return Response.json(game);
    }
    if (resource === "incidents" && method === "PATCH") {
        requirePermission(admin, "errors:write");
        const event = owned(data.events, id, admin);
        if (event.success)
            throw new ApiError(400, "NOT_AN_INCIDENT");
        const body = await request.json();
        if (!["open", "resolved"].includes(body.resolution))
            throw new ApiError(400, "INVALID_STATUS");
        event.resolution = body.resolution;
        audit(admin, "incident." + body.resolution, id);
        return Response.json(event);
    }
    if (resource === "contents") {
        if (method === "DELETE") {
            requirePermission(admin, "content:delete");
            const item = owned(data.contents, id, admin);
            item.deleted = true;
            audit(admin, "content.delete", id);
            return Response.json({ ok: true });
        }
        if (method !== "POST" && method !== "PATCH") throw new ApiError(405, "METHOD_NOT_ALLOWED");
        requirePermission(admin, "content:write");
        const form = await request.formData(), current = id ? owned(data.contents, id, admin) : undefined;
        const type = required(form.get("type")) as ContentType;
        if (!["book", "video", "audio", "drawing", "animation"].includes(type))
            throw new ApiError(400, "INVALID_CONTENT_TYPE");
        const title = required(form.get("title")), description = text(form.get("description")), category = required(form.get("category"), 60);
        const active = form.get("active") === "true";
        const file = form.get("file"), cover = form.get("cover");
        if ((!current || current.type !== type) && !(file instanceof File))
            throw new ApiError(400, "FILE_REQUIRED");
        const validateFile = (f: File, coverFile = false) => { const ext = f.name.split(".").at(-1)?.toLowerCase() ?? ""; if (!f.size || f.size > data.policy.maxFileMB * 1048576)
            throw new ApiError(400, "FILE_TOO_LARGE"); if (!(coverFile ? ["png", "jpg", "jpeg", "webp"] : data.policy.allowed[type]).includes(ext))
            throw new ApiError(400, "FILE_TYPE_NOT_ALLOWED"); if (coverFile && !/^image\/(png|jpeg|webp)$/.test(f.type))
            throw new ApiError(400, "FILE_TYPE_NOT_ALLOWED"); };
        if (file instanceof File)
            validateFile(file);
        if (cover instanceof File)
            validateFile(cover, true);
        const saveFile = async (f: File) => { const fileId = randomUUID(); store.files.set(fileId, { id: fileId, skinId: admin.skinId, name: f.name, type: f.type, bytes: new Uint8Array(await f.arrayBuffer()) }); return fileId; };
        const fileId = file instanceof File ? await saveFile(file) : current?.fileId;
        const coverId = cover instanceof File ? await saveFile(cover) : undefined;
        const item = { id: current?.id ?? `content_${randomUUID().slice(0, 8)}`, skinId: admin.skinId, title, description, type, category, active, createdAt: current?.createdAt ?? new Date().toISOString(), updatedAt: new Date().toISOString(), fileId, fileName: file instanceof File ? file.name : current!.fileName, fileSize: file instanceof File ? file.size : current!.fileSize, cover: coverId ? `/api/admin/files/${coverId}` : current?.cover ?? "/images/mock/media1.webp" };
        if (current)
            Object.assign(current, item);
        else
            data.contents.push(item);
        audit(admin, current ? "content.update" : "content.create", item.id);
        return Response.json(item);
    }
    if (resource === "roles") {
        if (method !== "POST" && method !== "PATCH") throw new ApiError(405, "METHOD_NOT_ALLOWED");
        requirePermission(admin, "roles:write");
        const body = await request.json();
        if (!Array.isArray(body.permissions) || !body.permissions.every((p: Permission) => permissions.includes(p)))
            throw new ApiError(400, "INVALID_PERMISSIONS");
        const role = id ? owned(data.roles, id, admin) : undefined;
        if (role?.id === admin.roleId && !body.permissions.includes("roles:write"))
            throw new ApiError(400, "KEEP_ADMIN_ACCESS");
        const update = { id: role?.id ?? `role_${randomUUID().slice(0, 8)}`, skinId: admin.skinId, name: { fa: required(body.nameFa), en: required(body.nameEn) }, description: { fa: text(body.descriptionFa ?? ""), en: text(body.descriptionEn ?? "") }, permissions: [...new Set(body.permissions)] as Permission[] };
        if (role)
            Object.assign(role, update);
        else
            data.roles.push(update);
        audit(admin, "role.save", update.id);
        return Response.json(update);
    }
    if (resource === "admins") {
        if (method !== "POST" && method !== "PATCH") throw new ApiError(405, "METHOD_NOT_ALLOWED");
        requirePermission(admin, "roles:write");
        const body = await request.json();
        owned(data.roles, body.roleId, admin);
        const active = bool(body.active);
        const current = id ? owned(data.admins, id, admin) : undefined;
        if (current?.id === admin.id && (!active || body.roleId !== admin.roleId))
            throw new ApiError(400, "KEEP_ADMIN_ACCESS");
        const email = required(body.email).toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            throw new ApiError(400, "INVALID_EMAIL");
        if (data.admins.some(a => a.email === email && a.id !== id))
            throw new ApiError(400, "EMAIL_EXISTS");
        const update = { id: current?.id ?? `admin_${randomUUID().slice(0, 8)}`, skinId: admin.skinId, email, roleId: body.roleId, active };
        if (current)
            Object.assign(current, update);
        else
            data.admins.push(update);
        audit(admin, "admin.save", update.id);
        return Response.json(update);
    }
    if (resource === "policy" && method === "PATCH") {
        requirePermission(admin, "roles:write");
        const body = await request.json();
        data.policy.maxFileMB = number(body.maxFileMB, 1, 100);
        audit(admin, "policy.update", admin.skinId);
        return Response.json(data.policy);
    }
    if (resource === "events" && method === "POST") {
        requirePermission(admin, "games:write");
        const body = await request.json();
        const game = owned(data.games, body.gameId, admin), user = owned(data.users, body.userId, admin);
        if (!game.active || !user.active || !user.assignedGames.includes(game.id))
            throw new ApiError(400, "EVENT_NOT_ALLOWED");
        if (!eventTypes.includes(body.type))
            throw new ApiError(400, "INVALID_EVENT_TYPE");
        const timestamp = required(body.timestamp);
        if (!Number.isFinite(Date.parse(timestamp)))
            throw new ApiError(400, "INVALID_DATE");
        const event = { id: body.id ? required(body.id,100) : `evt_${randomUUID().slice(0, 8)}`, skinId: admin.skinId, gameId: game.id, userId: user.id, sessionId: required(body.sessionId), type: body.type, timestamp: new Date(timestamp).toISOString(), success: bool(body.success), level: body.type === "level_complete" ? number(body.level, 1, game.levels) : undefined, version: game.version, resolution: "open" as const, normalExit: body.type === "exit" };
        const existing = data.events.find(e => e.id === event.id);
        if (existing) { if (existing.skinId !== admin.skinId || existing.gameId !== game.id || existing.userId !== user.id || existing.type !== event.type || existing.sessionId !== event.sessionId) throw new ApiError(409,"EVENT_ID_CONFLICT"); return Response.json(existing); }
        if (data.events.some(e => e.skinId === admin.skinId && e.sessionId === event.sessionId && (e.gameId !== game.id || e.userId !== user.id)))
            throw new ApiError(400, "INVALID_SESSION");
        data.events.push(event);
        audit(admin, "event.create", event.id);
        return Response.json(event);
    }
    throw new ApiError(404, "RESOURCE_NOT_FOUND");
}

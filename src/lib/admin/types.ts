import type { StudioRecord } from "./studio";
export type Locale = "fa" | "en";
export type Localized = Record<Locale, string>;
export type Permission = "users:read" | "users:write" | "games:read" | "games:write" | "games:status" | "analytics:read" | "errors:read" | "errors:write" | "content:read" | "content:write" | "content:delete" | "reports:read" | "roles:write";
export const permissions: Permission[] = ["users:read", "users:write", "games:read", "games:write", "games:status", "analytics:read", "errors:read", "errors:write", "content:read", "content:write", "content:delete", "reports:read", "roles:write"];
export type Role = {
    id: string;
    skinId: string;
    name: Localized;
    description: Localized;
    permissions: Permission[];
};
export type Admin = {
    id: string;
    skinId: string;
    email: string;
    roleId: string;
    active: boolean;
};
export type User = {
    id: string;
    skinId: string;
    joinedAt: string;
    active: boolean;
    assignedGames: string[];
};
export type Game = {
    id: string;
    skinId: string;
    title: Localized;
    description: Localized;
    cover: string;
    webGameUri?: string;
    isLandscape?: boolean;
    adminOnly?: boolean;
    images?: string[];
    trailer?: string;
    version: string;
    updatedAt: string;
    active: boolean;
    publication: "published" | "draft";
    levels: number;
    category: string;
};
export type EventType = "download" | "load" | "run" | "start" | "level_complete" | "game_complete" | "exit" | "crash" | "error";
export const eventTypes: EventType[] = ["download", "load", "run", "start", "level_complete", "game_complete", "exit", "crash", "error"];
export type GameEvent = {
    id: string;
    skinId: string;
    gameId: string;
    userId: string;
    sessionId: string;
    type: EventType;
    timestamp: string;
    success: boolean;
    level?: number;
    code?: string;
    message?: string;
    version: string;
    resolution: "open" | "resolved";
    normalExit?: boolean;
};
export type ContentType = "book" | "video" | "audio" | "drawing" | "animation";
export type Content = {
    id: string;
    skinId: string;
    title: string;
    description: string;
    type: ContentType;
    category: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    fileId?: string;
    fileName: string;
    fileSize: number;
    cover: string;
    deleted?: boolean;
};
export type Policy = {
    maxFileMB: number;
    deletePolicy: "soft";
    allowed: Record<ContentType, string[]>;
};
export type Audit = {
    id: string;
    skinId: string;
    adminId: string;
    action: string;
    resourceId: string;
    at: string;
};
export type Dataset = {
    studio: StudioRecord[];
    users: User[];
    games: Game[];
    events: GameEvent[];
    contents: Content[];
    roles: Role[];
    admins: Admin[];
    policy: Policy;
    audit: Audit[];
    referenceDate: string;
};
export type Bootstrap = Dataset & {
    currentAdmin: Admin;
    currentRole: Role;
};
export type Filters = {
    from: string;
    to: string;
    gameId: string;
    userId: string;
    status: string;
    eventType: string;
    outcome: string;
};
export type Session = {
    token: string;
    adminId: string;
    expires: number;
};

import { permissions, type Dataset, type GameEvent, type Role } from "./types";
export function createSeed(): Dataset {
    const skinId = "funlands";
    const roles: Role[] = [
        { id: "role_admin", skinId, name: { fa: "مدیر پوسته", en: "Skin administrator" }, description: { fa: "تمام امکانات همین پوسته", en: "All features within this skin" }, permissions: [...permissions] },
        { id: "role_content", skinId, name: { fa: "مدیر محتوا", en: "Content manager" }, description: { fa: "مدیریت کتابخانه بدون حذف", en: "Manage library without deletion" }, permissions: ["content:read", "content:write", "reports:read"] },
        { id: "role_games", skinId, name: { fa: "مدیر بازی", en: "Game manager" }, description: { fa: "بازی‌ها و تحلیل عملکرد", en: "Games and performance" }, permissions: ["games:read", "games:write", "games:status", "analytics:read", "users:read", "reports:read"] },
        { id: "role_support", skinId, name: { fa: "پشتیبان", en: "Support" }, description: { fa: "کاربران و رسیدگی به خطا", en: "Users and technical incidents" }, permissions: ["users:read", "errors:read", "errors:write"] },
        { id: "role_viewer", skinId, name: { fa: "مشاهده‌گر", en: "Viewer" }, description: { fa: "گزارش و تحلیل فقط خواندنی", en: "Read-only insights" }, permissions: ["users:read", "games:read", "analytics:read", "content:read", "errors:read", "reports:read"] },
    ];
    const admins = roles.map((r, i) => ({ id: `admin_${i + 1}`, skinId, email: `${["admin", "content", "games", "support", "viewer"][i]}@funlands.ir`, roleId: r.id, active: true }));
    const titles = [["ماجراجویی جنگل", "Jungle Adventure"], ["جزیره اعداد", "Number Island"], ["سفر فضایی", "Space Explorer"], ["دنیای رنگ‌ها", "Color World"], ["پازل حیوانات", "Animal Puzzle"], ["ریاضی شاد", "Happy Math"]];
    const games = titles.map(([fa, en], i) => ({ id: `game_${String(i + 1).padStart(3, "0")}`, skinId, title: { fa, en }, description: { fa: "یک تجربهٔ خلاقانه برای یادگیری و بازی.", en: "A creative experience for learning and play." }, cover: `/images/mock/game${i % 4 + 1}.webp`, version: `1.${i + 1}.0`, updatedAt: "2026-10-22T10:00:00Z", active: i !== 4, publication: (i === 4 ? "draft" : "published") as "draft" | "published", levels: 6 + i % 3, category: i % 2 ? "education" : "adventure" }));
    const users = Array.from({ length: 48 }, (_, i) => ({ id: `usr_${(0xa83f + i * 719).toString(16)}`, skinId, joinedAt: new Date(i >= 38 ? Date.UTC(2026,9,20+(i-38)%7) : Date.UTC(2026, 8, 1 + i)).toISOString(), active: i % 7 !== 0, assignedGames: games.filter((_, j) => (i + j) % 3 !== 0).map(g => g.id) }));
    const events: GameEvent[] = [];
    function add(e: Omit<GameEvent, "id" | "resolution">) { events.push({ ...e, id: `evt_${String(events.length + 1).padStart(6, "0")}`, resolution: events.length % 4 === 0 ? "resolved" : "open" }); }
    for (let day = 0; day < 40; day++)
        for (let i = 0; i < users.length; i++) {
            if ((day + i) % 3 === 0)
                continue;
            const user = users[i], game = games.find(g => g.id === user.assignedGames[(day+i)%user.assignedGames.length])!;
            if (!user.assignedGames.includes(game.id))
                continue;
            const sessionId = `sess_${day}_${i}`;
            const begin = Date.UTC(2026, 9, 26 - day, 6 + i % 14, i % 55);
            if (begin < Date.parse(user.joinedAt))
                continue;
            const base = { skinId, gameId: game.id, userId: user.id, sessionId, version: game.version };
            const emit = (type: GameEvent["type"], seconds: number, extra: Partial<GameEvent> = {}) => add({ ...base, type, timestamp: new Date(begin + seconds * 1000).toISOString(), success: true, ...extra });
            emit("download", 0);
            if ((day + i) % 17 === 0) {
                emit("load", 2, { success: false, code: "LOAD_TIMEOUT", message: "Asset loading exceeded the allowed time." });
                continue;
            }
            emit("load", 2);
            if ((day+i)%29===0) { emit("run",4,{success:false,code:"RUN_FAILED",message:"The runtime could not execute the loaded scene."}); continue; }
            emit("run", 4);
            if ((day + i) % 19 === 0) {
                emit("start", 5, { success: false, code: "START_FAILED", message: "The game could not initialize a player session." });
                continue;
            }
            emit("start", 6);
            if ((day + i) % 23 === 0) {
                emit("error", 20, { success: false, code: "ASSET_MISSING", message: "A required scene asset is missing." });
            }
            const completed = (day * 7 + i * 3) % (game.levels + 1);
            for (let level = 1; level <= completed; level++)
                emit("level_complete", 6 + level * 34, { level });
            if (completed === game.levels)
                emit("game_complete", 10 + completed * 34);
            if ((day + i) % 13 === 0)
                emit("crash", 30 + completed * 34, { success: false, code: "RUNTIME_ERROR", message: "An unexpected runtime error ended this session.", normalExit: false });
            else
                emit("exit", 50 + completed * 34, { normalExit: true });
        }
    // Out-of-scope fixtures exercise ownership checks, never returned to this skin.
    const otherGame = { ...games[0], id: "other_game", skinId: "other-skin" };
    const otherUser = { ...users[0], id: "other_user", skinId: "other-skin", assignedGames: [otherGame.id] };
    const types = ["book", "video", "audio", "drawing", "animation"] as const;
    const contents = Array.from({ length: 20 }, (_, i) => ({ id: `content_${i + 1}`, skinId, title: ["داستان جنگل / Forest story", "سفر به فضا / Space trip", "آواز پرندگان / Birdsong", "دنیای رنگ‌ها / Color world", "انیمیشن جنگل / Forest animation"][i % 5] + ` ${Math.floor(i / 5) + 1}`, description: "محتوای نمونهٔ کتابخانه / Sample library content", type: types[i % 5], category: ["story", "science", "music", "creativity", "animation"][i % 5], active: i % 5 !== 0, createdAt: new Date(Date.UTC(2026, 9, 10 + i%16)).toISOString(), updatedAt: new Date(Date.UTC(2026, 9, 10 + i%16)).toISOString(), fileName: `demo-${i + 1}.${["pdf", "mp4", "mp3", "png", "gif"][i % 5]}`, fileSize: (i + 1) * 124000, cover: `/images/mock/media${i % 4 + 1}.webp` }));
    return { roles, admins, games: [...games, otherGame], users: [...users, otherUser], events, contents, policy: { maxFileMB: 25, deletePolicy: "soft", allowed: { book: ["pdf", "epub"], video: ["mp4", "webm"], audio: ["mp3", "wav", "ogg"], drawing: ["png", "jpg", "jpeg", "webp"], animation: ["gif", "webp", "mp4", "webm"] } }, audit: [], referenceDate: "2026-10-26" };
}

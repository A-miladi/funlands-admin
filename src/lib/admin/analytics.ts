import type { Dataset, Filters, GameEvent } from "./types";
export const defaultFilters: Filters = { from: "2026-10-20", to: "2026-10-26", gameId: "all", userId: "all", status: "all", eventType: "all", outcome: "all" };
export function filterEvents(data: Dataset, filter: Filters): GameEvent[] {
    const allowedGames = new Set(data.games.filter(g => filter.status === "all" || (g.active ? "active" : "inactive") === filter.status).map(g => g.id));
    return data.events.filter(e => allowedGames.has(e.gameId) && e.timestamp.slice(0, 10) >= filter.from && e.timestamp.slice(0, 10) <= filter.to && (filter.gameId === "all" || e.gameId === filter.gameId) && (filter.userId === "all" || e.userId === filter.userId) && (filter.eventType === "all" || e.type === filter.eventType) && (filter.outcome === "all" || e.success === (filter.outcome === "success")));
}
export const unique = (values: string[]) => new Set(values).size;
export const percent = (part: number, total: number) => total ? Math.round(part / total * 1000) / 10 : 0;
export function aggregate(rawEvents: GameEvent[]) {
    const events = [...new Map(rawEvents.map(event=>[event.id,event])).values()];
    const runs = events.filter(e => e.type === "run" && e.success), starts = events.filter(e => e.type === "start" && e.success), completions = events.filter(e => e.type === "game_complete" && e.success);
    const started = new Set(starts.map(e => e.userId));
    const completed = new Set(completions.filter(e => started.has(e.userId)).map(e => e.userId));
    const failures = events.filter(e => !e.success), crashes = events.filter(e => e.type === "crash");
    const sessions = new Map<string, GameEvent[]>();
    for (const e of events) {
        const list = sessions.get(e.sessionId) ?? [];
        list.push(e);
        sessions.set(e.sessionId, list);
    }
    let duration = 0, validSessions = 0;
    for (const list of sessions.values()) {
        const start = list.filter(e => e.type === "start" && e.success).map(e => Date.parse(e.timestamp)).sort((a, b) => a - b)[0];
        const end = list.filter(e => e.type === "exit" || e.type === "crash").map(e => Date.parse(e.timestamp)).sort((a, b) => a - b)[0];
        if (start !== undefined && end >= start && end - start <= 4 * 3600000) {
            duration += (end - start) / 1000;
            validSessions++;
        }
    }
    const loads = events.filter(e => e.type === "load"), attempts = events.filter(e => e.type === "run" || e.type === "start");
    return { runs: runs.length, starts: starts.length, users: started.size, completions: completions.length, completedUsers: completed.size, completion: percent(completed.size, started.size), failures: failures.length, crashes: crashes.length, totalSeconds: duration, averageSeconds: validSessions ? Math.round(duration / validSessions) : 0, validSessions, loadSuccess: percent(loads.filter(e => e.success).length, loads.length), executionSuccess: percent(attempts.filter(e => e.success).length, attempts.length) };
}
export function levels(events: GameEvent[], total: number) { const starters = new Set(events.filter(e => e.type === "start" && e.success).map(e => e.userId)); return Array.from({ length: total }, (_, i) => { const completed = events.filter(e => e.type === "level_complete" && e.success && e.level === i + 1); const count = unique(completed.filter(e => starters.has(e.userId)).map(e => e.userId)); return { level: i + 1, users: count, times: completed.length, rate: percent(count, starters.size) }; }); }
export function progress(events: GameEvent[], total: number) { const done = [...new Set(events.filter(e => e.type === "level_complete" && e.success && e.level && e.level <= total).map(e => e.level!))].sort((a, b) => a - b); return { done, highest: done.at(-1) ?? 0, percent: percent(done.length, total), complete: events.some(e => e.type === "game_complete" && e.success) }; }
export function timeline(events: GameEvent[], from: string, to: string) { const result = []; const start = Date.parse(from + "T00:00:00Z"), end = Date.parse(to + "T00:00:00Z"); for (let time = start; time <= end && result.length < 366; time += 86400000) {
    const date = new Date(time).toISOString().slice(0, 10), day = events.filter(e => e.timestamp.startsWith(date));
    result.push({ date, ...aggregate(day), newUsers: unique(day.filter(e => e.type === "start").map(e => e.userId)) });
} return result; }
export function userActivity(data: Dataset, events: GameEvent[], from: string, to: string) { return timeline(events, from, to).map(day => { const ids = new Set(events.filter(e => e.type === "start" && e.success && e.timestamp.startsWith(day.date)).map(e => e.userId)); const fresh = data.users.filter(u => ids.has(u.id) && u.joinedAt.startsWith(day.date)).length; return { ...day, newUsers: fresh, returningUsers: ids.size - fresh }; }); }

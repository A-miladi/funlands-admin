# Funlands Admin — demo requirements coverage

Sources: LifeLands_Skin_Admin.pdf (13 sections, acceptance checklist) and the client-provided Admin Panel Showcase image. The image is used for capabilities only. Existing fonts, Tailwind components, themes, icons, gradient cards and detached sidebar remain the visual system.

## Demo boundary

All people, games, events and resources are synthetic. No production service is contacted. The local Next route handler stores records and uploaded file bytes in process memory; restarting the server restores the seed. Browser cookies contain an opaque, HttpOnly demo session and the theme/locale preferences. The demo password is intentionally public, not production authentication.

Login: `admin@funlands.ir` / `Funlands123!`. Other demo accounts: `content@funlands.ir`, `games@funlands.ir`, `support@funlands.ir`, `viewer@funlands.ir`; same password. Added admin accounts also use this demo password. Settings allows explicit switching between the seeded accounts.

## Implemented screens and flows

| Requirement | Implementation |
| --- | --- |
| Skin scope, anonymous users | API ownership checks on reads and mutations; separate inaccessible other-skin fixtures; no child names/photos/profile identity |
| Dashboard | Total users, total/active games, Run, Start, unique starters, completions, completion rate, failed executions, errors, Crash, session time and all content types |
| Time filters | Today / 7 / 30 days, custom date bounds; all statistics derive from timestamped event data |
| User management | Anonymous search, status filter, pagination, add/edit user, assign permitted games, joined/last-active dates |
| User detail | Assigned games, recent activity, anonymous profile, progression by game, complete/incomplete levels, highest level, Run/Start, time, full completion |
| Game management | Search, active/inactive/draft, title/update sorting, add/edit metadata, cover, description, version, level count, publication; status permission separate |
| Independent game analytics | Base info, performance, leading players, level users vs occurrences, full completions, unique users, total and average valid duration, failures |
| Comparison | Per-game comparison, level completion bars, Run/Start trends, unique user activity, time/completion trends |
| Technical monitoring | Download, load, Run, Start, level/game complete, normal exit, abnormal exit, Crash and error records; game/user/time/type/outcome/resolution filters |
| Incident detail | Error code/message, game version, anonymous user, timestamp, session ID, lifecycle and sanitized raw session records; resolve/reopen |
| Content library | Books/video/audio/drawing plus animation from the showcase; grid/table, type/status/category/search; detail and preview |
| Content operations | Multipart local-demo upload, metadata edit, replacement, cover change, active status, permission-gated soft deletion and inaccessible deleted file URLs |
| Upload policies | Allowed extensions per type, cover MIME, file size limit validated server-side; admin-adjustable maximum size |
| Reports | Users, games, individual user–game, events and content; advanced filters; per-session generated report snapshots; CSV and real XLSX exports |
| Roles and admins | Five seed roles, editable permission matrix, add/edit roles and administrators, individual read/write/status/delete scopes, active state, audit history |
| Backend demo | HttpOnly sessions, skin scoping, RBAC, ownership on files, same-origin mutation validation, guarded API endpoints, event ingestion and idempotent IDs |
| Settings | Account/role inspection, demo account switch, upload size, file format policy and deletion policy |

## Data model

`User`, `Game`, `GameEvent`, `Content`, `Role`, `Admin`, `Audit`, `Policy` are defined in `src/lib/admin/types.ts`. A session ID joins all execution events; event IDs are independent, stable identifiers. Event intake checks the user's game assignment and game/user activity. Duplicate event IDs are idempotent; mismatching ownership/type/session is rejected.

## Event and statistic contract

- `download`, `load`, `run`, `start`, `level_complete`, `game_complete`, `exit`, `crash`, `error` are separate events.
- Required event fields: `id` (generated if omitted), `gameId`, anonymous `userId`, `sessionId`, timestamp, success, type. Version is taken from the assigned game; level completion requires a valid level.
- Run and Start counts are independent successful event counts. Failed Run/Start are counted separately as unsuccessful execution.
- Unique starters are distinct anonymous user IDs with successful Start within the filtered period.
- Full completion percentage per game: distinct completers who also started within the period / distinct starters within that period. Zero denominator produces 0, never NaN.
- Level percentage per game: unique level completers among those starters / unique starters. Occurrence counts and user counts are displayed separately.
- Individual progression: distinct completed valid levels / configured level count. Highest level is reported separately; full-game completion uses the explicit completion event.
- Valid session duration uses the earliest successful Start and first Exit/Crash in the filtered session; missing, negative or over-four-hour sessions are excluded. Repeated event IDs are deduplicated. Full periods crossing a boundary require both endpoints inside the selected window.
- Total and average durations use only valid sessions. Historical analytics use event versions, not the game's current version.
- Raw events remain distinct from derived aggregates for investigation.
- Demo date anchor: 2026-10-26. Filters use UTC event dates; displayed dates use Asia/Tehran. The simulator explicitly labels its input UTC.
- No passwords, session tokens or private child identities appear in event logs or exports.

## Demo API

`POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/bootstrap`.

Scoped GET collections/details: `users`, `games`, `contents`, `events`, `roles`, `admins`. `GET stats` accepts filter query parameters.

Mutations: `POST/PATCH users`, `POST/PATCH games`, `POST/PATCH contents` (multipart), `DELETE contents/:id`, `PATCH incidents/:id`, `POST/PATCH roles`, `POST/PATCH admins`, `PATCH policy`, `POST events`. Protected file reads: `GET files/:id`.

All API methods enforce session and resource scope independently of the UI. Reassigning the current administrator or removing their role-management permission is rejected to preserve an administrator within this demo.

## Validation and delivery phases

1. Shared mock repository, event model, session and skin isolation.
2. Dashboard, users, games, progress, library and event simulator.
3. Monitoring, reports/export, roles/admins, policy and audit.

Run `npm test`, `npm run lint`, `npm run build -- --webpack`.

Production handoff still requires a real identity provider, persistent database/object storage, production event ingestion, deployment policies and operational security. Those integrations are deliberately outside this mock-data deliverable.

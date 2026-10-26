import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

// This app exposes public demo accounts. Set ADMIN_SESSION_SECRET for a private
// deployment; the stable demo key keeps mock sessions portable across functions.
const sessionKey = () => process.env.ADMIN_SESSION_SECRET || "funlands-public-demo-session-v1";
const signature = (payload: string) => createHmac("sha256", sessionKey()).update(payload).digest();
export function createSessionToken(adminId: string, expires = Date.now() + 86400000) {
  const payload = Buffer.from(JSON.stringify({ version: 1, adminId, expires, nonce: randomUUID() })).toString("base64url");
  return `${payload}.${signature(payload).toString("base64url")}`;
}
export function readSessionToken(token: string | undefined): { adminId: string; expires: number } | null {
  if (!token || token.length > 2048) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  try {
    const supplied = Buffer.from(parts[1], "base64url"), expected = signature(parts[0]);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
    const value = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    if (value.version !== 1 || typeof value.adminId !== "string" || !Number.isSafeInteger(value.expires) || value.expires <= Date.now() || typeof value.nonce !== "string") return null;
    return { adminId: value.adminId, expires: value.expires };
  } catch { return null; }
}

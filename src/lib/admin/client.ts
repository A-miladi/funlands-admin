import type { Bootstrap } from "./types";
export async function api<T = unknown>(path: string, method = "GET", body?: unknown, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`/api/admin/${path}`, { signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000), method, credentials: "same-origin", cache: "no-store", headers: body instanceof FormData ? undefined : body ? { "Content-Type": "application/json" } : undefined, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined });
    const result = await response.json();
    if (!response.ok)
        throw new Error(result.error ?? "REQUEST_FAILED");
    return result;
}
export const loadAdmin = (signal?: AbortSignal) => api<Bootstrap>("bootstrap", "GET", undefined, signal);

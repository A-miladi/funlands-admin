"use server";

import { cookies } from "next/headers";
import { ApiError, createDemoLoginSession } from "@/lib/admin/server";

export async function signInDemo(email: string, password: string) {
  let token: string;
  try { token = createDemoLoginSession(email, password); }
  catch (error) {
    if (error instanceof ApiError && error.status === 401) return { ok: false };
    throw error;
  }
  const jar = await cookies();
  // Server Action cookie updates also invalidate the guest Router Cache.
  jar.set("funlands_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 86400 });
  return { ok: true };
}

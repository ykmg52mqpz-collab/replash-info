/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/server/db";
import auth from "@/server/auth";
import core from "@/server/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String((body && body.email) || "").toLowerCase().trim();
  const password = String((body && body.password) || "");
  const data = db.load();
  const admin = data.admins.find((a: any) => a.email.toLowerCase() === email);
  if (!admin || !auth.verifyPassword(password, admin.passwordHash)) {
    return core.json(401, { error: "invalid_credentials" });
  }
  const token = auth.createSession("admin", admin.id);
  return core.json(200, { token, admin: { email: admin.email, name: admin.name } });
}

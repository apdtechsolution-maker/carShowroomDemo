import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!db) {
    return Response.json({
      ok: true,
      status: "healthy",
      database: "memory (frontend-only mode)",
    });
  }

  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, status: "healthy", database: "connected" });
  } catch {
    return Response.json({ ok: false, error: "Database unreachable" }, { status: 500 });
  }
}

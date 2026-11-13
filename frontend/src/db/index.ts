import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __apexMotorsPool?: Pool;
};

export const pool: Pool | null = databaseUrl
  ? (globalForDb.__apexMotorsPool ??= new Pool({ connectionString: databaseUrl }))
  : null;

export const db: NodePgDatabase | null = pool ? drizzle(pool) : null;

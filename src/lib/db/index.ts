// ============================================================
// src/lib/db/index.ts — Neon + Drizzle ORM connection
// ============================================================
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Neon serverless connection (works in edge & serverless)
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });

export type Database = typeof db;

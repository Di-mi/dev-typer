import { sql } from "drizzle-orm";
import { boolean, timestamp } from "drizzle-orm/mysql-core";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  clerkId: text().notNull().unique(),
  fullName: text().notNull(),
  email: text().notNull(),
  admin: int({mode: 'boolean'}).default(false),
});


export const scoresTable = sqliteTable("scores_table", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int().notNull().references(() => usersTable.id),
  wpm: int().notNull(),
  accuracy: int().notNull(),
  timestamp: int('timestamp1', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});


export type ScoreType = typeof scoresTable.$inferSelect;
export type UserType = typeof usersTable.$inferSelect;

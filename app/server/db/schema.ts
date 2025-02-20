import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  clerkId: text().notNull().unique(),
  fullName: text().notNull(),
  email: text().notNull()
});

export type UserType = typeof usersTable.$inferSelect;

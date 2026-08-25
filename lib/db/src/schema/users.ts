import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// Keyed by the Clerk user id (e.g. "user_...") rather than a serial id, since
// Clerk owns identity and every row maps 1:1 to a Clerk account.
export const usersTable = pgTable("users", {
  clerkUserId: text("clerk_user_id").primaryKey(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  createdAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

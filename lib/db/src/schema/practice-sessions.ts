import { pgTable, serial, timestamp, jsonb, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

// One row per completed practice flow (all questions answered in that visit
// to /practice). Each row holds every question/transcript/feedback triple
// answered during that session, so "sessions completed" reflects real
// practice runs rather than individual Q&A turns.
export const practiceSessionsTable = pgTable("practice_sessions", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.clerkUserId, { onDelete: "cascade" }),
  // Array of { question, transcript, feedback } (FeedbackResponse shape).
  answers: jsonb("answers").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertPracticeSessionSchema = createInsertSchema(
  practiceSessionsTable,
).omit({ id: true, completedAt: true });
export type InsertPracticeSession = z.infer<typeof insertPracticeSessionSchema>;
export type PracticeSession = typeof practiceSessionsTable.$inferSelect;

import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { db, practiceSessionsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import {
  CreateSessionBody,
  CreateSessionResponse,
  ListSessionsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/sessions", async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const rows = await db
    .select()
    .from(practiceSessionsTable)
    .where(eq(practiceSessionsTable.userId, userId))
    .orderBy(desc(practiceSessionsTable.completedAt));

  res.json(
    ListSessionsResponse.parse({
      sessions: rows.map((row) => ({
        id: row.id,
        answers: row.answers,
        completedAt: row.completedAt,
      })),
    }),
  );
});

router.post("/sessions", async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(practiceSessionsTable)
    .values({
      userId,
      answers: parsed.data.answers,
    })
    .returning();

  res.json(
    CreateSessionResponse.parse({
      id: row.id,
      answers: row.answers,
      completedAt: row.completedAt,
    }),
  );
});

export default router;

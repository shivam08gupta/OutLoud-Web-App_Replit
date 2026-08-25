import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateMeBody, GetMeResponse, UpdateMeResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/me", async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkUserId, userId));

  res.json(GetMeResponse.parse({ name: existing?.name ?? null }));
});

router.put("/me", async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = UpdateMeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const name = parsed.data.name.trim();
  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  await db
    .insert(usersTable)
    .values({ clerkUserId: userId, name })
    .onConflictDoUpdate({
      target: usersTable.clerkUserId,
      set: { name },
    });

  res.json(UpdateMeResponse.parse({ name }));
});

export default router;

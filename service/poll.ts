import { db } from "@/db/drizzle";
import { poll } from "@/db/schema";
import { pollInsertSchema, pollSelectSchema } from "@/db/schema/poll";
import { eq } from "drizzle-orm";
import z from "zod";

export const getUserPolls = async (selectData: { userId: string }) => {
  const parsed = z.object({ userId: z.string() }).safeParse(selectData);

  if (!parsed.success) {
    return { success: false, result: null, error: parsed.error };
  }

  const { userId } = parsed.data;

  try {
    const result = await db.query.poll.findMany({ where: { userId } });
    return { success: true, result, error: null };
  } catch (e) {
    console.error(e);
    return { success: false, result: null, error: e };
  }
};

export const createPoll = async (
  insertData: { userId: string; label: string },
) => {
  const parsed = pollInsertSchema.safeParse(insertData);

  if (!parsed.success) {
    return {
      success: false,
      result: null,
      error: z.treeifyError(parsed.error),
    };
  }

  const { userId, label } = parsed.data;

  try {
    const result = await db.insert(poll).values({ userId, label }).returning();
    return { success: true, result, error: null };
  } catch (e) {
    console.error(e);
    return { success: false, result: null, error: e };
  }
};

export const updatePoll = async (id: string, label: string) => {
  try {
    const result = await db.update(poll).set({ label }).where(eq(poll.id, id))
      .returning();
    return { success: true, result };
  } catch (e) {
    console.error(e);
    return { success: false, result: null };
  }
};

export const deleteUserPoll = async (pollId: string, userId: string) => {
  const result = await db.query.poll.findFirst({ where: { id: pollId } });
  if (result && result.userId === userId) {
    return await deletePoll(pollId);
  }
  return { success: false, result: null, error: null };
};

export const deletePoll = async (id: string) => {
  try {
    const result = await db.delete(poll).where(eq(poll.id, id)).returning();
    return { success: true, result, error: null };
  } catch (e) {
    console.error(e);
    return { success: false, result: null, error: e };
  }
};

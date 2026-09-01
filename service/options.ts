import { db } from "@/db/drizzle";
import { option } from "@/db/schema";
import { optionInsertSchema } from "@/db/schema/option";
import { eq } from "drizzle-orm";
import z from "zod";

export const createOption = async (
  insertData: { pollId: string; label: string; userId: string },
) => {
  const { userId, ...rest } = insertData;
  const parsed = optionInsertSchema.safeParse(rest);

  if (!parsed.success) {
    return {
      success: false,
      result: null,
      error: z.treeifyError(parsed.error),
    };
  }

  const { pollId, label } = parsed.data;

  const userPoll = await db.query.poll.findFirst({
    where: { id: pollId, userId },
  });
  if (!userPoll) {
    return {
      success: false,
      result: null,
      error: new Error("Create Option: User does not own poll."),
    };
  }

  try {
    const result = await db.insert(option).values({ pollId, label })
      .returning();
    return { success: true, result, error: null };
  } catch (e) {
    console.error(e);
    return { success: false, result: null, error: e };
  }
};

export const deleteUserOption = async (optionId: string, userId: string) => {
  const result = await db.query.option.findFirst({
    where: { id: optionId },
    with: { poll: true },
  });
  if (result && result.poll?.userId === userId) {
    return await deleteOption(optionId);
  }
  return {
    success: false,
    result: null,
    error: new Error("Delete Option: User does no own poll."),
  };
};

export const deleteOption = async (id: string) => {
  try {
    const result = await db.delete(option).where(eq(option.id, id))
      .returning();
    return { success: true, result, error: null };
  } catch (e) {
    console.error(e);
    return { success: false, result: null, error: e };
  }
};

import { db } from "@/db/drizzle";
import { poll } from "@/db/schema";
import {
  pollInsertSchema,
  pollSelectSchema,
  pollUpdateSchema,
} from "@/db/schema/poll";
import { eq } from "drizzle-orm";
import z from "zod";

export const getUserPollWithOptions = async (
  userId: string,
  pollId: string,
) => {
  const result = await db.query.poll.findFirst({
    where: { id: pollId, userId },
    with: {
      options: true,
    },
  });

  return result;
};

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

export const getPoll = async (pollId: string) => {
  return await db.query.poll.findFirst({
    where: { id: pollId },
    with: {
      options: true,
      votes: true,
    },
  });
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

export const updatePoll = async (
  updateData: {
    id: string;
    label?: string;
    published?: string;
    authenticatedVoting?: string;
    expires_at?: string;
  },
  userId: string,
) => {
  if (!await isPollOwnedByUser(updateData.id, userId)) {
    return {
      success: false,
      result: null,
      error: new Error("Update poll: poll not owned by this user."),
    };
  }

  const parsed = pollUpdateSchema.safeParse(updateData);

  if (!parsed.success) {
    return { success: false, result: null, error: parsed.error };
  }

  if (parsed.data) {
    const { id, authenticatedVoting, expires_at, label, published } =
      parsed.data;
    const updated_at = new Date(Date.now());

    if (!id) {
      return {
        success: false,
        result: null,
        error: new Error("Update poll: missing poll id."),
      };
    }

    try {
      const result = await db.update(poll).set({
        authenticatedVoting,
        expires_at,
        label,
        published,
        updated_at,
      }).where(eq(poll.id, id))
        .returning();
      return { success: true, result, error: null };
    } catch (e) {
      console.error(e);
      return { success: false, result: null, error: e };
    }
  } else {
    return {
      success: false,
      result: null,
      error: new Error("Update poll failed."),
    };
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

const isPollOwnedByUser = async (pollId: string, userId: string) => {
  const result = await db.query.poll.findFirst({ where: { id: pollId } });
  return result && result.userId === userId;
};

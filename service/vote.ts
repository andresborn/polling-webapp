import { db } from "@/db/drizzle";
import { vote } from "@/db/schema";
import { voteInsertSchema } from "@/db/schema/vote";
import { eq } from "drizzle-orm";
import z from "zod";

export const createVote = async (
  insertData: {
    pollId: string;
    optionId: string;
    anonId: string;
    userId: string;
  },
) => {
  const { pollId, optionId, anonId, userId } = insertData;

  const poll = await db.query.poll.findFirst({ where: { id: pollId } });
  if (!poll) {
    return {
      success: null,
      result: null,
      error: new Error("Poll doesn't exist."),
    };
  }

  if (!poll.published) {
    return {
      success: null,
      result: null,
      error: new Error("Poll not published."),
    };
  }

  if (
    poll.expires_at !== null && new Date(poll.expires_at).getTime() < Date.now()
  ) {
    return { success: null, result: null, error: new Error("Poll expired.") };
  }

  if (poll.authenticatedVoting && !userId) {
    return {
      success: null,
      result: null,
      error: new Error("Unauthenticated user."),
    };
  }

  if (poll.authenticatedVoting) {
    return await insertAuthenticatedVote({ pollId, optionId, userId });
  } else {
    return await insertAnonVote({ pollId, optionId, anonId });
  }
};

const insertAuthenticatedVote = async (
  insertData: { pollId: string; optionId: string; userId: string },
) => {
  // check that optionid belongs to pollid
  const { success, data, error } = voteInsertSchema.safeParse(insertData);
  if (!success) {
    return { success, result: null, error: z.treeifyError(error) };
  }
  const { pollId, optionId, userId } = data;
  const result = await db.insert(vote).values({ pollId, optionId, userId })
    .returning();
  return { success: true, result, error: null };
};

const insertAnonVote = async (
  insertData: { pollId: string; optionId: string; anonId: string },
) => {
  // check that optionid belongs to pollid
  const { success, data, error } = voteInsertSchema.safeParse(insertData);
  if (!success) {
    return { success, result: null, error: z.treeifyError(error) };
  }
  const { pollId, optionId, anonId } = data;
  const result = await db.insert(vote).values({ pollId, optionId, anonId })
    .returning();
  return { success: true, result, error: null };
};

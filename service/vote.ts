import { db } from "@/db/drizzle";
import { vote } from "@/db/schema";
import { voteInsertSchema } from "@/db/schema/vote";
import z from "zod";

export const hasUserVotedOnPoll = async (pollId: string, userId: string) => {
  try {
    return await db.query.vote.findFirst({ where: { pollId, userId } });
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const createVote = async (
  insertData: {
    pollId: string;
    optionId: string;
    anonId?: string | null;
    userId?: string | null;
  },
) => {
  const { pollId, optionId, anonId, userId } = insertData;

  const poll = await db.query.poll.findFirst({ where: { id: pollId } });
  if (!poll) {
    return {
      success: false,
      result: null,
      error: new Error("Poll doesn't exist."),
    };
  }

  if (!poll.published) {
    return {
      success: false,
      result: null,
      error: new Error("Poll not published."),
    };
  }

  if (
    poll.expires_at !== null && new Date(poll.expires_at).getTime() < Date.now()
  ) {
    return { success: false, result: null, error: new Error("Poll expired.") };
  }

  if (poll.authenticatedVoting && !userId) {
    return {
      success: false,
      result: null,
      error: new Error("Unauthenticated user."),
    };
  }

  if (!poll.authenticatedVoting && !anonId) {
    return {
      success: false,
      result: null,
      error: new Error("Missing ID for anonymous user."),
    };
  }

  if (poll.authenticatedVoting) {
    return await insertAuthenticatedVote({
      pollId,
      optionId,
      userId: userId ?? "",
    });
  } else {
    return await insertAnonVote({ pollId, optionId, anonId: anonId ?? "" });
  }
};

const insertAuthenticatedVote = async (
  insertData: { pollId: string; optionId: string; userId: string },
) => {
  const { success, data, error } = voteInsertSchema.safeParse(insertData);
  if (!success) {
    return { success, result: null, error: z.treeifyError(error) };
  }
  const { pollId, optionId, userId } = data;
  try {
    const result = await db.insert(vote)
      .values({ pollId, optionId, userId })
      .onConflictDoNothing({ target: [vote.pollId, vote.userId] }).returning();

    return { success: true, result, error: null };
  } catch (e) {
    return { success: false, result: null, error: e };
  }
};

const insertAnonVote = async (
  insertData: { pollId: string; optionId: string; anonId: string },
) => {
  const { success, data, error } = voteInsertSchema.safeParse(insertData);
  if (!success) {
    return { success, result: null, error: z.treeifyError(error) };
  }
  const { pollId, optionId, anonId } = data;
  try {
    const result = await db.insert(vote)
      .values({ pollId, optionId, anonId })
      .onConflictDoNothing({ target: [vote.pollId, vote.anonId] }).returning();
    return { success: true, result, error: null };
  } catch (e) {
    return { success: false, result: null, error: e };
  }
};

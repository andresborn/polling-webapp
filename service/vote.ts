import { db } from "@/db/drizzle";
import { vote } from "@/db/schema";
import { voteInsertSchema } from "@/db/schema/vote";
import { Vote } from "@/db/types";
import { AppError, err, ok, Result } from "@/lib/result";
import z from "zod";

export const getUserVote = async (
  pollId: string,
  userId: string,
): Promise<Result<Vote | null>> => {
  try {
    const res = await db.query.vote.findFirst({ where: { pollId, userId } });
    if (res) return ok(res);
    return ok(null);
  } catch (e) {
    console.error(e);
    return err(
      AppError.internalServerError(
        "Failed to check if user has voted on poll.",
      ),
    );
  }
};

export const createVote = async (
  insertData: {
    pollId: string;
    optionId: string;
    anonId?: string | null;
    userId?: string | null;
  },
): Promise<Result<Vote[]>> => {
  try {
    const { success, data, error } = voteInsertSchema.safeParse(insertData);

    if (!success) {
      return err(
        AppError.badRequest(
          "Bad payload to create vote.",
          z.treeifyError(error),
        ),
      );
    }

    const { pollId, optionId, anonId, userId } = data;

    const poll = await db.query.poll.findFirst({ where: { id: pollId } });

    if (!poll) {
      return err(AppError.notFound("Poll doesn't exist."));
    }

    if (!poll.published) {
      return err(AppError.forbidden("Poll not published."));
    }

    if (poll.closed) {
      return err(AppError.forbidden("Poll is closed."));
    }

    if (
      poll.expires_at !== null &&
      new Date(poll.expires_at).getTime() < Date.now()
    ) {
      return err(AppError.forbidden("Poll has expired."));
    }

    if (poll.authenticatedVoting && !userId) {
      return err(
        AppError.forbidden("Only authenticated users may vote on this poll."),
      );
    }

    if (!poll.authenticatedVoting && !anonId) {
      return err(
        AppError.badRequest(
          "Missing anonymous ID required for voting on this poll.",
        ),
      );
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
  } catch (e) {
    console.error(e);
    return err(AppError.internalServerError("Failed to create vote."));
  }
};

const insertAuthenticatedVote = async (
  insertData: { pollId: string; optionId: string; userId: string },
) => {
  const { success, data, error } = voteInsertSchema.safeParse(insertData);
  if (!success) {
    return err(
      AppError.badRequest(
        "Wrong payload for insert authenticated vote.",
        z.treeifyError(error),
      ),
    );
  }
  const { pollId, optionId, userId } = data;
  try {
    const result = await db.insert(vote)
      .values({ pollId, optionId, userId })
      .onConflictDoNothing({ target: [vote.pollId, vote.userId] }).returning();

    return ok(result);
  } catch (e) {
    console.error(e);
    return err(
      AppError.internalServerError("Failed to insert authenticated vote."),
    );
  }
};

const insertAnonVote = async (
  insertData: { pollId: string; optionId: string; anonId: string },
) => {
  const { success, data, error } = voteInsertSchema.safeParse(insertData);

  if (!success) {
    return err(
      AppError.badRequest(
        "Wrong payload for insert anonymous vote.",
        z.treeifyError(error),
      ),
    );
  }

  try {
    const { pollId, optionId, anonId } = data;
    const result = await db.insert(vote)
      .values({ pollId, optionId, anonId })
      .onConflictDoNothing({ target: [vote.pollId, vote.anonId] }).returning();

    return ok(result);
  } catch (e) {
    console.error(e);
    return err(
      AppError.internalServerError("Failed to insert anonymous vote."),
    );
  }
};

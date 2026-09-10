import { db } from "@/db/drizzle";
import { poll } from "@/db/schema";
import { pollInsertSchema, pollUpdateSchema } from "@/db/schema/poll";
import { Poll, PollWithOptions, PollWithOptionsAndVotes } from "@/db/types";
import { AppError, err, ok, Result } from "@/lib/result";
import { eq } from "drizzle-orm";
import z from "zod";

export const getUserPollWithOptions = async (
  userId: string,
  pollId: string,
): Promise<Result<PollWithOptions>> => {
  try {
    const result = await db.query.poll.findFirst({
      where: { id: pollId, userId },
      with: {
        options: true,
      },
    });
    if (result) {
      return ok(result);
    } else {
      return err(AppError.notFound("Poll not found."));
    }
  } catch (e) {
    console.error(e);
    return err(
      AppError.internalServerError("Failed to get user poll with options."),
    );
  }
};

export const getUserPolls = async (
  selectData: { userId: string },
): Promise<Result<Poll[]>> => {
  const parsed = z.object({ userId: z.string() }).safeParse(selectData);

  if (!parsed.success) {
    return err(
      AppError.badRequest(
        "Bad payload on get user polls.",
        z.treeifyError(parsed.error),
      ),
    );
  }

  const { userId } = parsed.data;

  try {
    const result = await db.query.poll.findMany({ where: { userId } });
    return ok(result);
  } catch (e) {
    console.error(e);
    return err(AppError.internalServerError("Failed to get user polls."));
  }
};

export const getPoll = async (
  pollId: string,
): Promise<Result<PollWithOptionsAndVotes>> => {
  try {
    const result = await db.query.poll.findFirst({
      where: { id: pollId },
      with: {
        options: true,
        votes: true,
      },
    });
    if (!result) {
      return err(AppError.notFound("Poll not found."));
    }
    return ok(result);
  } catch (e) {
    console.log(e);
    return err(
      AppError.internalServerError(
        "Failed to get poll with options and votes.",
      ),
    );
  }
};

export const createPoll = async (
  insertData: { userId: string; label: string },
): Promise<Result<Poll[]>> => {
  const parsed = pollInsertSchema.safeParse(insertData);

  if (!parsed.success) {
    return err(
      AppError.badRequest(
        "Bad payload to create poll.",
        z.treeifyError(parsed.error),
      ),
    );
  }

  try {
    const { userId, label } = parsed.data;
    const result = await db.insert(poll).values({ userId, label }).returning();
    return ok(result);
  } catch (e) {
    console.error(e);
    return err(AppError.internalServerError("Failed to create poll."));
  }
};

export const updatePoll = async (
  updateData: {
    id: string;
    label?: string;
    published?: string;
    authenticatedVoting?: string;
    expires_at?: string;
    closed?: boolean;
  },
  userId: string,
): Promise<Result<Poll[]>> => {
  try {
    const owned = await isPollOwnedByUser(updateData.id, userId);

    if (!owned) {
      return err(AppError.forbidden("Poll not owned by this user."));
    }

    const { success, data, error } = pollUpdateSchema.safeParse(updateData);

    if (!success) {
      return err(
        AppError.badRequest(
          "Bad payload to update poll.",
          z.treeifyError(error),
        ),
      );
    }

    const { id, authenticatedVoting, expires_at, label, published, closed } =
      data;
    const updated_at = new Date(Date.now());

    if (closed !== undefined && closed === false) {
      return err(AppError.badRequest("Can't reopen a poll."));
    }

    if (!id) {
      return err(AppError.badRequest("Missing poll id."));
    }

    const result = await db.update(poll).set({
      authenticatedVoting,
      expires_at,
      label,
      published,
      updated_at,
      closed,
    }).where(eq(poll.id, id))
      .returning();

    return ok(result);
  } catch (e) {
    console.error(e);
    return err(AppError.internalServerError("Failed to update poll."));
  }
};

export const deleteUserPoll = async (
  pollId: string,
  userId: string,
): Promise<Result<Poll[]>> => {
  try {
    const owned = await isPollOwnedByUser(pollId, userId);
    if (owned) {
      const deleted = await db.delete(poll).where(eq(poll.id, pollId))
        .returning();
      return ok(deleted);
    }
    return err(AppError.forbidden("Unable to delete poll."));
  } catch (e) {
    console.error(e);
    return err(AppError.internalServerError("Failed to delete poll."));
  }
};

const isPollOwnedByUser = async (
  pollId: string,
  userId: string,
): Promise<boolean> => {
  const result = await db.query.poll.findFirst({ where: { id: pollId } });
  return !!(result && result.userId === userId);
};

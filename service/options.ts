import { db } from "@/db/drizzle";
import { option } from "@/db/schema";
import { optionInsertSchema } from "@/db/schema/option";
import { AppError, err, ok, Result } from "@/lib/result";
import { eq } from "drizzle-orm";
import z from "zod";
import { Option } from "@/db/types";

export const createOption = async (
  insertData: { pollId: string; label: string; userId: string },
): Promise<Result<Option[]>> => {
  const { userId, ...rest } = insertData;
  const parsed = optionInsertSchema.safeParse(rest);

  if (!parsed.success) {
    return err(
      AppError.badRequest(
        "Invalid option insert payload.",
        z.treeifyError(parsed.error),
      ),
    );
  }

  const { pollId, label } = parsed.data;
  try {
    const userPoll = await db.query.poll.findFirst({
      where: { id: pollId, userId },
    });

    if (!userPoll) {
      return err(AppError.forbidden("User does not own this poll."));
    }

    const result = await db.insert(option).values({ pollId, label })
      .returning();
    return ok(result);
  } catch (e) {
    console.error(e);
    return err(AppError.internalServerError("Failed to insert option."));
  }
};

export const deleteUserOption = async (
  optionId: string,
  userId: string,
): Promise<Result<Option[]>> => {
  try {
    const result = await db.query.option.findFirst({
      where: { id: optionId },
      with: { poll: true },
    });
    if (result && result.poll?.userId === userId) {
      const toDelete = await db.delete(option).where(eq(option.id, optionId))
        .returning();
      return ok(toDelete);
    }
    return err(
      AppError.forbidden(
        "Failed to delete option, user doesn't own this poll.",
      ),
    );
  } catch (e) {
    console.error(e);
    return err(AppError.internalServerError("Failed to delete option."));
  }
};

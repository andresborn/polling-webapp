import { db } from "@/db/drizzle";
import { poll } from "@/db/schema";
import { pollInsertSchema, pollSelectSchema } from "@/db/schema/poll";
import { eq } from "drizzle-orm";
import z from "zod";

export const getOptionsByPollId = async (pollId: string, userId: string) => {
  const result = await db.query.poll.findFirst({
    where: { id: pollId, userId },
    with: {
      options: true,
    },
  });
  return result;
};

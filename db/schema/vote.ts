import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { poll } from "./poll";
import { option } from "./option";
export const vote = pgTable("vote", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id),
  pollId: uuid("poll_id").references(() => poll.id).notNull(),
  optionId: uuid("option_id").references(() => option.id).notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

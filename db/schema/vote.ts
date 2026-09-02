import {
  foreignKey,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { poll } from "./poll";
import { option } from "./option";
import { createInsertSchema } from "drizzle-orm/zod";

export const vote = pgTable("vote", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id),
  anonId: text("anon_id"),
  pollId: uuid("poll_id").references(() => poll.id).notNull(),
  optionId: uuid("option_id").references(() => option.id).notNull(),
  created_at: timestamp().defaultNow().notNull(),
}, (t) => [
  unique("vote_poll_user_uidx").on(t.pollId, t.userId),
  unique("vote_poll_anon_uidx").on(t.pollId, t.anonId),
  foreignKey({
    name: "vote_option_poll_fk",
    columns: [t.pollId, t.optionId],
    foreignColumns: [option.pollId, option.id],
  }),
]);

export const voteInsertSchema = createInsertSchema(vote, {});

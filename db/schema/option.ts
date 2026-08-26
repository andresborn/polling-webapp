import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { poll } from "./poll";

export const options = pgTable("option", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  votes: integer("votes").notNull().default(0),
  pollId: uuid("poll_id").references(() => poll.id).notNull(),
  ...timestamps,
});

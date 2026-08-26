import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { polls } from "./poll";

export const options = pgTable("options", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  votes: integer("votes").notNull().default(0),
  pollId: uuid("poll_id").references(() => polls.id).notNull(),
  ...timestamps,
});

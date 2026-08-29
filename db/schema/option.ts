import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { poll } from "./poll";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";

export const option = pgTable("option", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  votes: integer("votes").notNull().default(0),
  pollId: uuid("poll_id").references(() => poll.id).notNull(),
  ...timestamps,
});

export const optionInsertSchema = createInsertSchema(option);
export const optionSelectSchema = createSelectSchema(option);
export const optionUpdateSchema = createUpdateSchema(option);

import { integer, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { poll } from "./poll";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import z from "zod";

export const option = pgTable("option", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  votes: integer("votes").notNull().default(0),
  pollId: uuid("poll_id").references(() => poll.id).notNull(),
  ...timestamps,
}, (t) => [
  unique("option_id_poll_id_uidx").on(t.id, t.pollId),
]);

export const optionInsertSchema = createInsertSchema(option);
export const optionSelectSchema = createSelectSchema(option, {
  created_at: z.coerce.date(),
});
export const optionUpdateSchema = createUpdateSchema(option);

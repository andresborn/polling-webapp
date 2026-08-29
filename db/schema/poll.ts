import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { user } from "./auth";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import z from "zod";

export const poll = pgTable("poll", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  userId: text("user_id").references(() => user.id).notNull(),
  ...timestamps,
});

export const pollInsertSchema = createInsertSchema(poll, {});
export const pollSelectSchema = createSelectSchema(poll, {
  created_at: z.coerce.date(),
});
export const pollUpdateSchema = createUpdateSchema(poll, {});

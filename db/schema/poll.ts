import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { user } from "./auth";

export const poll = pgTable("poll", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  userId: text("user_id").references(() => user.id).notNull(),
  ...timestamps,
});

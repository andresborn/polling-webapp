import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { users } from "./user";

export const polls = pgTable("polls", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  ...timestamps,
});

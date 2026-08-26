import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").notNull().unique(),
	...timestamps,
});

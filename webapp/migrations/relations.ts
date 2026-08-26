import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	options: {
		poll: r.one.polls({
			from: r.options.pollId,
			to: r.polls.id
		}),
	},
	polls: {
		options: r.many.options(),
		user: r.one.users({
			from: r.polls.userId,
			to: r.users.id
		}),
	},
	users: {
		polls: r.many.polls(),
	},
}))
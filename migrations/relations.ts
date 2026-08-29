import { defineRelations } from "drizzle-orm";
import * as schema from "@/db/schema/index";

export const relations = defineRelations(schema, (r) => ({
	account: {
		user: r.one.user({
			from: r.account.userId,
			to: r.user.id,
		}),
	},
	user: {
		accounts: r.many.account(),
		polls: r.many.poll(),
		sessions: r.many.session(),
	},
	option: {
		poll: r.one.poll({
			from: r.option.pollId,
			to: r.poll.id,
		}),
	},
	poll: {
		options: r.many.option(),
		user: r.one.user({
			from: r.poll.userId,
			to: r.user.id,
		}),
	},
	session: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id,
		}),
	},
}));

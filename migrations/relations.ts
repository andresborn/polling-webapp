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
		votes: r.many.vote(),
	},
	option: {
		poll: r.one.poll({
			from: r.option.pollId,
			to: r.poll.id,
		}),
		votes: r.many.vote(),
	},
	poll: {
		options: r.many.option(),
		user: r.one.user({
			from: r.poll.userId,
			to: r.user.id,
		}),
		votes: r.many.vote(),
	},
	session: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id,
		}),
	},
	vote: {
		option: r.one.option({
			from: r.vote.optionId,
			to: r.option.id,
		}),
		poll: r.one.poll({
			from: r.vote.pollId,
			to: r.poll.id,
		}),
		user: r.one.user({
			from: r.vote.userId,
			to: r.user.id,
		}),
	},
}));

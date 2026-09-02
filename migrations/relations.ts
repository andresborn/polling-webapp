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
		votesOptionId: r.many.vote({
			alias: "vote_optionId_option_id",
		}),
		votesPollIdOptionId: r.many.vote({
			alias: "vote_pollId_optionId_option_pollId_id",
		}),
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
		optionOptionId: r.one.option({
			from: r.vote.optionId,
			to: r.option.id,
			alias: "vote_optionId_option_id",
		}),
		optionPollIdOptionId: r.one.option({
			from: [r.vote.pollId, r.vote.optionId],
			to: [r.option.pollId, r.option.id],
			alias: "vote_pollId_optionId_option_pollId_id",
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

import { ChartExample } from "@/components/bar-chart";
import { ResultsBars } from "@/components/results-bars";
import { VotingCard } from "@/components/voting-card";
import { auth } from "@/lib/auth";
import { getPoll } from "@/service/poll";
import { getUserVote } from "@/service/vote";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function Poll({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });

  let userId = "";
  let voted = false;
  let voteOptionId = "";

  if (session) {
    userId = session.user.id;
    const res = await getUserVote(id, userId);

    if (res.ok) {
      voted = !!res.data;
      voteOptionId = res.data?.optionId ?? "";
    } else {
      console.error(res.error.message);
      return <div>There was an error loading this page.</div>;
    }
  }

  const poll = await getPoll(id);

  if (!poll.ok) {
    if (poll.error.kind === "not_found") notFound();
    console.error(poll.error.message);
    return <div>There was an error loading this page.</div>;
  }

  if (!poll.data.published) notFound();

  const options = poll.data.options.map((o) => {
    return { id: o.id, label: o.label };
  });

  // Initialize map
  const cd: { [key: string]: { votes: number; label: string } } = {};
  options.forEach((o) => {
    cd[o.id] = { votes: 0, label: o.label };
  });
  // Count votes
  for (const vote of poll.data.votes) {
    cd[vote.optionId].votes += 1;
  }

  const chartData = Object.entries(cd).map(([k, v]) => {
    return { optionId: k, votes: v.votes, optionLabel: v.label };
  });

  return (
    <main className="px-18 pt-8 flex flex-col gap-8">
      <h1 className="font-heading text-6xl">{poll.data.label}</h1>
      {/* <ChartExample chartData={chartData} options={options} pollId={poll.id} /> */}
      <div className="flex flex-col md:flex-row gap-8">
        <ResultsBars chartData={chartData} pollClosed={poll.data.closed} />
        <VotingCard
          options={options}
          pollId={poll.data.id}
          user={{ userId, voted, voteOptionId }}
          pollClosed={poll.data.closed}
          poll={poll.data}
        />
      </div>
    </main>
  );
}

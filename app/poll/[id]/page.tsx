import { ChartExample } from "@/components/bar-chart";
import { getPoll } from "@/service/poll";
import { notFound } from "next/navigation";

export default async function Poll({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getPoll(id);

  if (!result) notFound();

  const poll = await getPoll(id);

  if (!poll) notFound();

  const options = poll.options.map((o) => {
    return { id: o.id, label: o.label };
  });

  // Initialize map
  const cd: { [key: string]: { votes: number; label: string } } = {};
  options.forEach((o) => {
    cd[o.id] = { votes: 0, label: o.label };
  });
  // Count votes
  for (const vote of poll.votes) {
    cd[vote.optionId].votes += 1;
  }

  const chartData = Object.entries(cd).map(([k, v]) => {
    return { optionId: k, votes: v.votes, optionLabel: v.label };
  });

  return (
    <ChartExample chartData={chartData} options={options} pollId={poll.id} />
  );
}

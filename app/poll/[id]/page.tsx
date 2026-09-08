import { ChartExample } from "@/components/bar-chart";
import { getPoll } from "@/service/poll";
import { redirect } from "next/navigation";

export default async function Poll({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getPoll(id);

  if (!result) redirect("/");

  // const chartData = [
  //   { option: "A New Hope", votes: 56 },
  //   { option: "The Empire Strikes Back", votes: 45 },
  //   { option: "Return of the Jedi", votes: 60 },
  //   { option: "The Phantom Menace", votes: 32 },
  //   { option: "Attack of the Clones", votes: 40 },
  //   { option: "Revenge of the Sith", votes: 21 },
  // ];

  const poll = await getPoll(id);

  if (!poll) redirect("/");

  const options = poll.options.map((o) => {
    return { id: o.id, label: o.label };
  });

  const cd: { [key: string]: number } = {};

  for (const vote of poll.votes) {
    cd[vote.optionId] += 1;
  }

  const chartData = Object.entries(cd).map(([k, v]) => {
    return { option: k, votes: v };
  });

  return (
    <ChartExample chartData={chartData} options={options} pollId={poll.id} />
  );
}

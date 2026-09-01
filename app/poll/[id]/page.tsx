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

  return (
    <div className="flex flex-col items-center">
      <main className="w-full py-32 px-[10%] gap-4 flex flex-col">
        <ChartExample />
      </main>
    </div>
  );
}

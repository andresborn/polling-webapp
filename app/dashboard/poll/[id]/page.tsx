import PollConfig from "@/components/poll-config";
import { redirect } from "next/navigation";
import { getUserPollWithOptions } from "@/service/poll";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function EditPoll({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { id } = await params;

  const poll = await getUserPollWithOptions(session.user.id, id);

  return (
    <div className="flex flex-col items-center">
      <main className="w-full py-8 px-[10%] gap-4 flex flex-col">
        <div className="flex justify-between pb-12">
          <Link className="self-start hover:underline" href="/dashboard">
            &larr; Back to Polls
          </Link>
          <Link
            href={`/poll/${id}`}
            className="self-start hover:underline text-primary"
          >
            Live link &#8599;
          </Link>
        </div>
        <PollConfig poll={poll} />
      </main>
    </div>
  );
}

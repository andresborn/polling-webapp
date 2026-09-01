import PollConfig from "@/components/poll-config";
import { redirect } from "next/navigation";
import { getUserPollWithOptions } from "@/service/poll";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
      <main className="w-full py-32 px-[10%] gap-4 flex flex-col">
        <PollConfig poll={poll} />
      </main>
    </div>
  );
}

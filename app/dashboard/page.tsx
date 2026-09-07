import { auth } from "@/lib/auth";
import PollsTable from "@/components/polls-table";
import { redirect } from "next/navigation";
import { getUserPolls } from "@/service/poll";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const initialPolls = await getUserPolls({ userId: session.user.id });

  return (
    <div className="flex flex-col items-center">
      <main className="w-full py-8 px-[10%] gap-4 flex flex-col">
        <PollsTable initialPolls={initialPolls.result ?? []} />
      </main>
    </div>
  );
}

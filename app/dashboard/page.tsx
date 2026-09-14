import { auth } from "@/lib/auth";
import PollsTable from "@/components/polls-table";
import { redirect } from "next/navigation";
import { getUserPolls } from "@/service/poll";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const res = await getUserPolls({ userId: session.user.id });
  if (!res.ok) {
    return <div>Something went wrong: {res.error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <main className="w-full py-8 px-[10%] gap-4 flex flex-col">
        <PollsTable initialPolls={res.data ?? []} />
      </main>
    </div>
  );
}

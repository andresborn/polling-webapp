"use client";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pollSelectSchema } from "@/db/schema/poll";
import { Poll } from "@/db/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";

export default function Home() {
  const [label, setLabel] = useState("");

  const [polls, setPolls] = useState<Poll[]>([]);
  const [refetch, setRefetch] = useState(false);

  const router = useRouter();

  const createPoll = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch("/api/poll", {
      method: "POST",
      body: JSON.stringify({ label }),
    });
    setRefetch((prev) => !prev);
  };

  const deletePoll = async (pollId: string) => {
    await fetch("/api/poll", {
      method: "DELETE",
      body: JSON.stringify({ pollId }),
    });
    setRefetch((prev) => !prev);
  };

  const navigateToPoll = async (pollId: string) => {
    router.push(`/poll/${pollId}`);
  };

  useEffect(() => {
    const getUserPolls = async () => {
      const res = await fetch("/api/poll");
      if (!res.ok) return;
      const json = await res.json();
      const { data, error, success } = z
        .array(pollSelectSchema)
        .safeParse(json.result);
      console.log(error);
      if (success) {
        setPolls(data);
      }
    };
    getUserPolls();
  }, [refetch]);

  return (
    <div className="flex flex-col items-center">
      <main className="w-full py-32 px-[10%] gap-4 flex flex-col">
        <h1>Your Polls</h1>

        <form onSubmit={createPoll}>
          <FieldGroup>
            <Input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Question to ask"
            />
            <Button type="submit">Create Poll</Button>
          </FieldGroup>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="text-right min-w-12">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {polls.map((poll) => (
              <TableRow key={poll.label}>
                <TableCell className="truncate max-w-38">
                  {poll.id.substring(0, 4)}
                </TableCell>
                <TableCell>{poll.label}</TableCell>
                <TableCell>{poll.created_at.toDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => navigateToPoll(poll.id)}
                    variant="secondary"
                    size="xs"
                  >
                    EDIT
                  </Button>
                  <Button
                    onClick={() => deletePoll(poll.id)}
                    variant="destructive"
                    size="xs"
                  >
                    DELETE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}

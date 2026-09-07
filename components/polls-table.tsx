"use client";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pollSelectSchema } from "@/db/schema/poll";

import { Poll } from "@/db/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";

interface Props {
  initialPolls: Poll[];
}

export default function PollsTable(props: Props) {
  const [label, setLabel] = useState("");

  // Cache for response-driven reconciliation
  const [polls, setPolls] = useState<Poll[]>(props.initialPolls);

  const router = useRouter();

  const createPoll = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/poll", {
      method: "POST",
      body: JSON.stringify({ label }),
    });

    if (!res.ok) return;
    const body = await res.json();
    const parsed = z.array(pollSelectSchema).safeParse(body.result);
    if (parsed.data) {
      setPolls((prev) => {
        const x = [...prev, ...parsed.data];
        return x;
      });
      setLabel("");
    }
  };

  const navigateToPoll = async (pollId: string) => {
    router.push(`/dashboard/poll/${pollId}`);
  };

  return (
    <>
      <h1>Your Polls</h1>

      <form onSubmit={createPoll}>
        <FieldGroup>
          <Input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Mirror mirror on the wall, who is the prettiest of them all?"
          />
          <Button type="submit">Create</Button>
        </FieldGroup>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Live link</TableHead>
            <TableHead className="text-right min-w-12">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {polls.map((poll) => (
            <TableRow key={poll.label}>
              <TableCell className="truncate max-w-24">
                {poll.id.substring(0, 3)}
              </TableCell>
              <TableCell>{poll.label}</TableCell>
              <TableCell>{poll.created_at.toDateString()}</TableCell>
              <TableCell>
                {
                  <Link
                    href={`/poll/${poll.id}`}
                    className="hover:underline hover:text-primary-foreground"
                    target="_blank"
                  >
                    Live poll &#8599;
                  </Link>
                }
              </TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => navigateToPoll(poll.id)}
                  variant="secondary"
                  size="xs"
                >
                  EDIT
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

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
import { Poll, Option } from "@/db/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PollWithOptions extends Poll {
  options: Option[];
}

export default function EditPoll() {
  const { id } = useParams();
  const [poll, setPoll] = useState<PollWithOptions | undefined>();
  const [option, setOption] = useState("");
  const [refetch, setRefetch] = useState(false);

  const addOption = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch("/api/options", {
      method: "POST",
      body: JSON.stringify({ pollId: id, label: option }),
    });
    setOption("");
    setRefetch((prev) => !prev);
  };

  const deleteOption = async (optionId: string) => {
    await fetch("/api/options", {
      method: "DELETE",
      body: JSON.stringify({ optionId }),
    });
    setRefetch((prev) => !prev);
  };

  useEffect(() => {
    const getUserPoll = async () => {
      const res = await fetch(`/api/poll?id=${id}`);

      if (!res.ok) return;
      const { result } = await res.json();
      if (result) setPoll(result as PollWithOptions);
    };
    getUserPoll();
  }, [id, refetch]);

  return (
    <div className="flex flex-col items-center">
      <main className="w-full py-32 px-[10%] gap-4 flex flex-col">
        <Link className="hover:underline" href="/dashboard">
          &larr; Back to Polls
        </Link>
        {poll && (
          <>
            <h1>{poll.label}</h1>

            <form onSubmit={addOption}>
              <FieldGroup className="flex-row items-center gap-2">
                <Input
                  type="text"
                  placeholder="Add option"
                  onChange={(e) => setOption(e.target.value)}
                  value={option}
                />
                <Button type="submit">Add option</Button>
              </FieldGroup>
            </form>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead className="text-right min-w-12">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poll.options?.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{o.label}</TableCell>
                    <TableCell>{o.votes}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => deleteOption(o.id)}
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
          </>
        )}
      </main>
    </div>
  );
}

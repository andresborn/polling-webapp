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
import { useState } from "react";

interface PollWithOptions extends Poll {
  options: Option[];
}

interface Props {
  poll: PollWithOptions | undefined;
}

export default function PollConfig(props: Props) {
  const { id } = useParams();
  const [poll, setPoll] = useState<PollWithOptions | undefined>(props.poll);
  const [option, setOption] = useState("");

  const addOption = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch("/api/options", {
      method: "POST",
      body: JSON.stringify({ pollId: id, label: option }),
    });
    setOption("");
  };

  const deleteOption = async (optionId: string) => {
    await fetch("/api/options", {
      method: "DELETE",
      body: JSON.stringify({ optionId }),
    });
  };

  return (
    <>
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
    </>
  );
}

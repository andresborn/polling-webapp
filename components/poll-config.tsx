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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { optionSelectSchema } from "@/db/schema/option";
import { Poll, Option } from "@/db/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";

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
  const router = useRouter();

  const deletePoll = async (pollId: string) => {
    const res = await fetch("/api/poll", {
      method: "DELETE",
      body: JSON.stringify({ pollId }),
    });
    if (!res.ok) return;
    router.push("/dashboard");
  };

  const addOption = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/options", {
      method: "POST",
      body: JSON.stringify({ pollId: id, label: option }),
    });
    if (!res.ok) return;
    const body = await res.json();
    const parsed = z.array(optionSelectSchema).safeParse(body.result);

    if (parsed.data) {
      setPoll((prev) => {
        if (!prev) return;
        const updatedOptions = [...prev.options, ...parsed.data];
        return { ...prev, options: updatedOptions };
      });
      setOption("");
    }
  };

  const deleteOption = async (optionId: string) => {
    const res = await fetch("/api/options", {
      method: "DELETE",
      body: JSON.stringify({ optionId }),
    });

    if (!res.ok) return;

    const body = await res.json();
    const parsed = z.array(optionSelectSchema).safeParse(body.result);

    if (parsed.data) {
      setPoll((prev) => {
        if (!prev) return;
        const deletedIds = parsed.data.map((p) => p.id);
        const updatedOptions = prev.options.filter(
          (o) => !deletedIds.includes(o.id),
        );
        return { ...prev, options: updatedOptions };
      });
    }
  };

  return (
    <>
      {poll && (
        <>
          <div className="flex justify-between pb-4">
            <h1 className="font-heading text-2xl">{poll.label}</h1>

            <Dialog>
              <DialogTrigger
                render={
                  <Button size="lg" variant="destructive">
                    DELETE POLL
                  </Button>
                }
              />

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Are you absolutely sure you want to delete this poll?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    this poll and remove all corresponding options and voting
                    data.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-4">
                  <DialogClose
                    render={
                      <Button variant="secondary" size="lg">
                        Cancel
                      </Button>
                    }
                  />
                  <Button
                    onClick={() => deletePoll(poll.id)}
                    variant="destructive"
                    size="lg"
                  >
                    DELETE
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

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

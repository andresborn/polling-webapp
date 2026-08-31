"use client";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { pollSelectSchema } from "@/db/schema/poll";
import { Poll, Option } from "@/db/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PollWithOptions extends Poll {
  options: Option[];
}

export default function EditPoll() {
  const { id } = useParams();
  const [poll, setPoll] = useState<PollWithOptions | undefined>();
  const [option, setOption] = useState("");

  useEffect(() => {
    const getUserPoll = async () => {
      const res = await fetch(`/api/poll?id=${id}`);

      if (!res.ok) return;
      const pollData = await res.json();
      if (pollData) setPoll(pollData as PollWithOptions);
    };
    getUserPoll();
  }, [id]);

  return (
    <>
      {poll && (
        <>
          <h1>{poll.label}</h1>
          <FieldGroup>
            {poll.options?.map((o) => (
              <Field>
                <FieldLabel htmlFor={o.id}>New option</FieldLabel>
                <Input id={o.id} type="text" disabled value={o.label} />
              </Field>
            ))}
            <Field>
              <FieldLabel htmlFor="new-option">New option</FieldLabel>
              <Input
                id="new-option"
                type="text"
                onChange={(e) => setOption(e.target.value)}
                value={option}
              />
            </Field>
          </FieldGroup>
        </>
      )}
    </>
  );
}

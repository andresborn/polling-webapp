"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { nanoid } from "nanoid";

interface VoteOption {
  id: string;
  label: string;
}

interface Props {
  options: VoteOption[];
  pollId: string;
  user: { userId: string | undefined; voted: boolean; voteOptionId: string };
  pollClosed: boolean;
}

interface VoteState {
  anonId: string;
  voted: boolean;
}

export const VotingCard = (props: Props) => {
  const [hasVoted, setHasVoted] = useState(false);

  const submitVote = async (optionId: string) => {
    if (props.pollClosed) return;

    const item = localStorage.getItem(props.pollId);
    const vs = item ? (JSON.parse(item) as VoteState) : null;
    console.log(vs);
    const res = await fetch("/api/vote", {
      method: "POST",
      body: JSON.stringify({
        anonId: vs ? vs.anonId : "",
        pollId: props.pollId,
        optionId,
      }),
    });

    if (!res.ok) {
      console.error(await res.json());
      return;
    }

    const { result } = await res.json();
    if (result) {
      setHasVoted(true);
      const item = localStorage.getItem(props.pollId);
      if (item) {
        const prevVoteState = JSON.parse(item) as VoteState;
        const updatedVoteState = {
          anonId: prevVoteState.anonId,
          voted: true,
        } as VoteState;
        localStorage.setItem(props.pollId, JSON.stringify(updatedVoteState));
      }
    }
  };

  useEffect(() => {
    if (props.pollClosed) return;

    // Create anonId only for non-users
    if (props.user.userId) {
      setHasVoted(props.user.voted);
      return;
    }

    // Check if anonId exists before creating a new one
    const item = localStorage.getItem(props.pollId);
    if (item) {
      const obj = JSON.parse(item) as VoteState;
      setHasVoted(obj.voted);
    } else {
      const anonId = nanoid();
      const item = { anonId, voted: false };
      localStorage.setItem(props.pollId, JSON.stringify(item));
      setHasVoted(item.voted);
    }
  }, []);

  return (
    <Card className="md:w-1/3 w-full py-6 bg-card/35">
      <CardHeader>
        <h1 className="font-heading text-2xl">Vote</h1>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {props.options.map((o) => (
          <Button
            className="justify-start w-full font-bold h-12"
            variant={hasVoted || props.pollClosed ? "outline" : "default"}
            disabled={!!hasVoted || props.pollClosed}
            key={o.id}
            onClick={() => submitVote(o.id)}
          >
            {o.label}
          </Button>
        ))}
        {hasVoted && (
          <p className="text-xs text-muted-foreground pt-2">
            Your vote has been submitted
          </p>
        )}
      </CardContent>
    </Card>
  );
};

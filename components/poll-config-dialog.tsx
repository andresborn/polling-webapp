"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { PollWithOptions } from "./poll-config";
import { useRouter } from "next/navigation";
import z from "zod";
import { pollSelectSchema } from "@/db/schema/poll";
import { Badge } from "./ui/badge";
import {
  CircleCheck,
  CircleX,
  HatGlasses,
  FingerprintPattern,
} from "lucide-react";

interface Props {
  poll: PollWithOptions;
  setPoll: Dispatch<SetStateAction<PollWithOptions | undefined>>;
}

export const PollConfigDialog = (props: Props) => {
  const router = useRouter();

  const deletePoll = async (pollId: string) => {
    const res = await fetch("/api/poll", {
      method: "DELETE",
      body: JSON.stringify({ pollId }),
    });
    if (!res.ok) return;
    router.push("/dashboard");
  };

  const updatePublishStatus = async (publish: boolean) => {
    const res = await fetch("/api/poll", {
      method: "PUT",
      body: JSON.stringify({
        id: props.poll.id,
        published: publish,
      }),
    });
    if (!res.ok) {
      console.error(await res.json());
      return;
    }
    const { result } = await res.json();
    const parsed = z.array(pollSelectSchema).parse(result);
    if (parsed.length > 1) {
      console.error("More that one poll.");
      return;
    }
    props.setPoll((prev) => {
      if (prev) return { ...prev, published: parsed[0].published };
    });
  };

  const updateAuthStatus = async (authenticatedVoting: boolean) => {
    const res = await fetch("/api/poll", {
      method: "PUT",
      body: JSON.stringify({
        id: props.poll.id,
        authenticatedVoting,
      }),
    });
    if (!res.ok) {
      console.error(await res.json());
      return;
    }
    const { result } = await res.json();
    const parsed = z.array(pollSelectSchema).parse(result);
    if (parsed.length > 1) {
      console.error("More that one poll.");
      return;
    }
    props.setPoll((prev) => {
      if (prev)
        return { ...prev, authenticatedVoting: parsed[0].authenticatedVoting };
    });
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="lg" variant="secondary">
            Settings
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Advanced Poll Configuration.
          </DialogTitle>
          <DialogDescription>
            Here you can: publish or unpublish, set the type of voting allowed
            (authenticated or anonymous), set the expiration date for voting,
            and delete the current poll.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* TODO: expires_at */}
          {/* TODO: manually close */}
          <div className="flex justify-between items-baseline">
            <Badge
              variant="outline"
              className="h-6 font-bold"
              data-icon="inline-start"
            >
              {props.poll.published ? (
                <>
                  <CircleCheck className="stroke-success" size={12} />
                  Published
                </>
              ) : (
                <>
                  <CircleX className="stroke-destructive" size={12} />
                  Unpublished
                </>
              )}
            </Badge>
            <Button
              size="lg"
              variant="default"
              className="font-bold right"
              onClick={() => updatePublishStatus(!props.poll.published)}
            >
              {!props.poll.published ? "Publish" : "Unpublish"}
            </Button>
          </div>
          <div className="flex justify-between items-baseline">
            <Badge
              variant="outline"
              className="h-6 font-bold"
              data-icon="inline-start"
            >
              {props.poll.authenticatedVoting ? (
                <>
                  <FingerprintPattern className="stroke-primary" size={12} />
                  Authenticated Voting
                </>
              ) : (
                <>
                  <HatGlasses className="stroke-muted-foreground" size={12} />
                  Anonymous Voting
                </>
              )}
            </Badge>
            <Button
              size="lg"
              variant="default"
              className="font-bold right"
              onClick={() => updateAuthStatus(!props.poll.authenticatedVoting)}
            >
              {!props.poll.authenticatedVoting
                ? "Activate Authenticated voting"
                : "Activate Anonymous voting"}
            </Button>
          </div>

          <p className="font-heading pt-12 text-lg">Danger Zone</p>
          <div className="flex justify-between items-baseline">
            <p>Delete poll</p>
            <Button
              onClick={() => deletePoll(props.poll.id)}
              variant="destructive"
              size="lg"
            >
              DELETE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

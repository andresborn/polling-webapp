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
  MonitorCheck,
  MonitorX,
} from "lucide-react";
import { PublishedBadge } from "./badges/published-badge";
import { AuthBadge } from "./badges/auth-badge";
import { ClosedBadge } from "./badges/closed-badge";

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

          <div className="flex justify-between items-baseline">
            <PublishedBadge published={props.poll.published} />
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
            <AuthBadge authenticatedVoting={props.poll.authenticatedVoting} />
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
            <ClosedBadge closed={props.poll.closed} />
            <Button
              size="lg"
              variant="default"
              disabled={props.poll.closed}
              className="font-bold right"
              onClick={() => {}}
            >
              {!props.poll.closed
                ? "Close (this action is permanent)"
                : "Closed"}
            </Button>
          </div>
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

import { Lock } from "lucide-react";

interface Props {
  live: boolean;
}

export const VotingIndicator = (props: Props) => {
  return (
    <>
      {props.live ? (
        <div className="w-fit border border-destructive/60 px-3 py-1 text-destructive font-heading mb-6 flex items-center gap-4">
          <span className="size-3 rounded-full bg-destructive animate-blink"></span>

          <p>live voting</p>
        </div>
      ) : (
        <div className="w-fit border border-muted-foreground/60 px-3 py-1 text-muted-foreground font-heading mb-6 flex items-center gap-4">
          <Lock size={12} />
          <span className="flex gap-2">
            <p>Poll closed</p>
            <p>·</p>
            <p>final results</p>
          </span>
        </div>
      )}
    </>
  );
};

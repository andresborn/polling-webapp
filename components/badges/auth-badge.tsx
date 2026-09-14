import { FingerprintPattern, HatGlasses } from "lucide-react";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface Props {
  authenticatedVoting: boolean;
  withTooltip?: boolean;
}

export const AuthBadge = (props: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge
          variant="outline"
          className="h-6 font-bold"
          data-icon="inline-start"
        >
          {props.authenticatedVoting ? (
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
      </TooltipTrigger>
      {props.withTooltip && (
        <TooltipContent>
          <p>
            {props.authenticatedVoting
              ? "Only authenticated users may vote. You must be logged in to vote."
              : "Votes for this poll are anonymous. You must be logged out of your account to vote."}
          </p>
        </TooltipContent>
      )}
    </Tooltip>
  );
};

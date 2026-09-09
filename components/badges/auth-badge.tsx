import { FingerprintPattern, HatGlasses } from "lucide-react";
import { Badge } from "../ui/badge";

interface Props {
  authenticatedVoting: boolean;
}

export const AuthBadge = (props: Props) => {
  return (
    <Badge variant="outline" className="h-6 font-bold" data-icon="inline-start">
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
  );
};

import { MonitorCheck, MonitorX } from "lucide-react";
import { Badge } from "../ui/badge";

interface Props {
  closed: boolean;
}

export const ClosedBadge = (props: Props) => {
  return (
    <Badge variant="outline" className="h-6 font-bold" data-icon="inline-start">
      {props.closed ? (
        <>
          <MonitorX className="stroke-destructive" size={12} />
          Closed
        </>
      ) : (
        <>
          <MonitorCheck className="stroke-foreground" size={12} />
          Open
        </>
      )}
    </Badge>
  );
};

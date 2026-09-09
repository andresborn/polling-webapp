import { CircleCheck, CircleX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  published: boolean;
}

export const PublishedBadge = (props: Props) => {
  return (
    <Badge variant="outline" className="h-6 font-bold" data-icon="inline-start">
      {props.published ? (
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
  );
};

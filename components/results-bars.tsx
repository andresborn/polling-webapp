"use client";

import { VotingIndicator } from "./live-voting-indicator";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

interface ChartData {
  optionId: string;
  votes: number;
  optionLabel: string;
}

interface Props {
  chartData: ChartData[];
  pollClosed: boolean;
  className?: string;
}

export function ResultsBars(props: Props) {
  const totalVotes = props.chartData.reduce((sum, d) => sum + d.votes, 0);
  const maxVotes = Math.max(0, ...props.chartData.map((d) => d.votes));

  return (
    <Card className={cn("max-w-3xl w-full py-6 bg-card/35", props.className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <h1 className="font-heading text-2xl">Results</h1>
        <VotingIndicator live={!props.pollClosed} />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {props.chartData.map((d) => {
          const pct =
            totalVotes === 0 ? 0 : Math.round((d.votes / totalVotes) * 100);
          const isLeading = d.votes === maxVotes && maxVotes > 0;

          return (
            <div key={d.optionId} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-bold">{d.optionLabel}</span>
                <span className="text-muted-foreground shrink-0">
                  {d.votes} votes · {pct}%
                </span>
              </div>
              <div className="h-10 w-full bg-muted">
                <div
                  className={cn(
                    "h-full transition-[width] duration-500 ease-out",
                    isLeading ? "bg-primary" : "bg-muted-foreground",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        <Separator />

        <p className="text-muted-foreground">{totalVotes} total votes</p>
      </CardContent>
    </Card>
  );
}

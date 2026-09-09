"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { VotingIndicator } from "./live-voting-indicator";
import { VotingCard } from "./voting-card";

const chartConfig = {
  option: {
    label: "Option",
  },
} satisfies ChartConfig;

interface VoteOption {
  id: string;
  label: string;
}

interface ChartData {
  optionId: string;
  votes: number;
  optionLabel: string;
}

interface Props {
  chartData: ChartData[];
  options: VoteOption[];
  pollId: string;
}

interface VoteState {
  anonId: string;
  voted: boolean;
}

export function ChartExample(props: Props) {
  console.log(props.chartData);

  return (
    <main className="flex flex-col md:flex-row md:gap-4 gap-8 w-full">
      <Card className="max-w-3xl md:w-2/3 w-full py-6 bg-card/35">
        <CardHeader className="flex flex-row justify-between items-baseline">
          <h1 className="font-heading text-2xl">Results</h1>
          <VotingIndicator live />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={props.chartData}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <XAxis type="number" dataKey="votes" hide />
              <YAxis
                dataKey="optionLabel"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                hide
              />

              <Bar dataKey="votes" fill="var(--color-chart-2)" radius={0}>
                <LabelList
                  dataKey="optionLabel"
                  position="insideLeft"
                  offset={8}
                  className="fill-foreground font-bold text-sm"
                  fontSize={12}
                />
                <LabelList
                  dataKey="votes"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <VotingCard
        pollId={props.pollId}
        options={props.options}
        user={{ userId: "", voted: false, voteOptionId: "" }}
      />
    </main>
  );
}

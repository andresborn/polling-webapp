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

  const submitVote = async (optionId: string) => {
    const item = localStorage.getItem(props.pollId);
    const vs = item ? (JSON.parse(item) as VoteState) : null;

    await fetch("/api/vote", {
      method: "POST",
      body: JSON.stringify({
        anonId: vs ? vs.anonId : "",
        pollId: props.pollId,
        optionId,
      }),
    });
  };

  useEffect(() => {
    const item = localStorage.getItem(props.pollId);
    if (item) {
      const obj = JSON.parse(item) as { anonId: string; voted: boolean };
      // set hasVoted state
      obj.voted;
    } else {
      const item = { anonId: nanoid(), voted: false };
      localStorage.setItem(props.pollId, JSON.stringify(item));
    }
  }, []);

  return (
    <main className="flex flex-col md:flex-row md:gap-4 gap-8 w-full px-18 pt-12">
      <Card className="max-w-3xl md:w-2/3 w-full">
        <CardHeader></CardHeader>
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
              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent hideLabel={false} indicator="line" />
                }
              />

              <Bar dataKey="votes" fill="var(--color-chart-2)" radius={4}>
                <LabelList
                  dataKey="optionLabel"
                  position="insideLeft"
                  offset={8}
                  className="fill-foreground"
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

      <div className="md:w-1/3 w-full h-50 bg-white">
        {props.options.map((o) => (
          <Button key={o.id} onClick={() => submitVote(o.id)}>
            {o.label}
          </Button>
        ))}
      </div>
    </main>
  );
}

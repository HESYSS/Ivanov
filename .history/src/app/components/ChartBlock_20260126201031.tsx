"use client";

import { useEffect, useState, useTransition } from "react";
import NumberFlow from "@number-flow/react";
import { ChartPoint, Timeframe } from "../types/chart";
import { ChartView } from "./ChartView";
import { TimeframeSelector } from "./TimeframeSelector";
import { getChartData } from "../actions/chart.actions";

type Props = {
  publicKey: string;
};

export function ChartBlock({ publicKey }: Props) {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [hovered, setHovered] = useState<ChartPoint | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const d = await getChartData(publicKey, timeframe);
      setData(d);
    });
  }, [publicKey, timeframe]);

  if (!data.length) return null;

  const last = data[data.length - 1];
  const active = hovered ?? last;

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <NumberFlow value={active.value} className="text-3xl font-semibold" />
          <span className="text-sm text-muted-foreground">
            {new Date(active.timestamp).toLocaleDateString()}
          </span>
        </div>

        <TimeframeSelector value={timeframe} onChange={setTimeframe} />
      </div>

      {/* CHART */}
      <div className={isPending ? "opacity-50" : ""}>
        <ChartView data={data} onHover={setHovered} />
      </div>
    </div>
  );
}

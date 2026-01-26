"use client";

import { useState } from "react";
import NumberFlow from "@number-flow/react";
import { ChartPoint } from "../types/chart";
import { ChartView } from "./ChartView";

type Props = {
  data: ChartPoint[];
};

export function ChartBlock({ data }: Props) {
  const [hovered, setHovered] = useState<ChartPoint | null>(null);

  const lastPoint = data[data.length - 1];
  const active = hovered ?? lastPoint;

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex flex-col">
        <NumberFlow
          value={active.value}
          format={{ maximumFractionDigits: 2 }}
          className="text-3xl font-semibold"
        />
        <span className="text-sm text-muted-foreground">
          {new Date(active.timestamp).toLocaleDateString()}
        </span>
      </div>

      {/* CHART */}
      <ChartView data={data} onHover={setHovered} />
    </div>
  );
}

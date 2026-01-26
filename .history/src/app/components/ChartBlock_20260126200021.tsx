"use client";

import { useState } from "react";
import NumberFlow from "@number-flow/react";
import { ChartPoint } from "../types/chart";
import { Chart } from "./Chart"; // если у тебя отдельный компонент

type Props = {
  data: ChartPoint[];
};

export function ChartBlock({ data }: Props) {
  const [hovered, setHovered] = useState<ChartPoint | null>(null);

  const lastPoint = data[data.length - 1];
  const activePoint = hovered ?? lastPoint;

  return (
    <div className="space-y-4">
      {/* 🔹 HEADER */}
      <div className="flex flex-col">
        <NumberFlow
          value={activePoint.value}
          format={{ notation: "standard", maximumFractionDigits: 2 }}
          className="text-3xl font-semibold"
        />
        <span className="text-sm text-muted-foreground">
          {new Date(activePoint.timestamp).toLocaleDateString()}
        </span>
      </div>

      {/* 🔹 CHART */}
      <Chart data={data} onHover={setHovered} />
    </div>
  );
}

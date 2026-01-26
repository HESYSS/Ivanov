"use client";

import { LineChart, Line, Tooltip, XAxis } from "recharts";
import NumberFlow from "@number-flow/react";
import { useState } from "react";
import { ChartPoint, ChartRange } from "../types/chart";
import { MotionButton } from "./MotionButton";

export function ChartBlock({
  data,
  onRangeChange,
}: {
  data: ChartPoint[];
  onRangeChange: (r: ChartRange) => void;
}) {
  const [value, setValue] = useState(data.at(-1)?.value ?? 0);

  return (
    <div>
      <NumberFlow value={value} />

      <LineChart width={520} height={280} data={data}>
        <XAxis dataKey="time" />
        <Line dataKey="value" strokeWidth={2} />
        <Tooltip
          formatter={(v: number) => {
            setValue(v);
            return v;
          }}
        />
      </LineChart>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {(["1D", "1W", "1M"] as ChartRange[]).map((r) => (
          <MotionButton key={r} onClick={() => onRangeChange(r)}>
            {r}
          </MotionButton>
        ))}
      </div>
    </div>
  );
}

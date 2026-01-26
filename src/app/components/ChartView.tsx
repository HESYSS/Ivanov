"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartPoint } from "../types/chart";

type Props = {
  data: ChartPoint[];
  onHover: (point: ChartPoint | null) => void;
};

export function ChartView({ data, onHover }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={data}
        onMouseMove={(e) => {
          if (e.activePayload?.[0]) {
            const p = e.activePayload[0].payload;
            onHover({
              timestamp: p.timestamp,
              value: p.value,
            });
          }
        }}
        onMouseLeave={() => onHover(null)}
      >
        <XAxis
          dataKey="timestamp"
          tickFormatter={(v) => new Date(v).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip content={null} />
        <Line type="monotone" dataKey="value" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

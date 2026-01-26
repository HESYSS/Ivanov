"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import { ChartPoint } from "../types/chart";

type Props = {
  data: ChartPoint[];
  onHover: (point: ChartPoint | null) => void;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 rounded shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-900">
          ${data.value.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(data.timestamp).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function ChartView({ data, onHover }: Props) {
  const minValue = Math.min(...data.map((p) => p.value)) - 20;
  const maxValue = Math.max(...data.map((p) => p.value)) + 20;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
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
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff8c42" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ff8c42" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="timestamp"
          tickFormatter={(v) => new Date(v).toLocaleDateString("en-US")}
          stroke="#d1d5db"
        />
        <YAxis
          domain={[minValue, maxValue]}
          stroke="#d1d5db"
          label={{ value: "USD", angle: -90, position: "insideLeft" }}
        />
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#ff8c42"
          strokeWidth={2}
          fill="url(#colorGradient)"
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

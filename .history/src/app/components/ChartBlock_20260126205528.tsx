"use client";

import { useEffect, useState, useTransition } from "react";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { ChartPoint, Timeframe } from "../types/chart";
import { ChartView } from "./ChartView";
import { TimeframeSelector } from "./TimeframeSelector";
import { getChartData } from "../actions/chart.actions";
import { ChartSkeleton } from "./ChartSkeleton";

type Props = {
  publicKey: string;
};

export function ChartBlock({ publicKey }: Props) {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [hovered, setHovered] = useState<ChartPoint | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("1D");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const d = await getChartData(publicKey, timeframe);
      setData(d);
    });
  }, [publicKey, timeframe]);

  if (!data.length) return <ChartSkeleton />;

  const last = data[data.length - 1];
  const active = hovered ?? last;
  const isProfit = active.value >= (data[0]?.value ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-3xl p-8 shadow-xl"
    >
      {/* Header with Timeframe */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📈</span>
          <h2 className="text-2xl font-bold text-gray-900">Profit/Loss</h2>
        </div>
        <TimeframeSelector
          selected={timeframe}
          onChange={setTimeframe}
          disabled={isPending}
        />
      </div>

      {/* Value Display */}
      <div className="mb-8">
        <motion.div
          key={active.value}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-5xl font-bold text-gray-900"
        >
          <span className={isProfit ? "text-green-500" : "text-red-500"}>
            {isProfit ? "+" : "-"}$
            <NumberFlow value={Math.abs(active.value)} format={{ minimumFractionDigits: 2 }} />
          </span>
        </motion.div>
        <p className="text-sm text-gray-500 mt-2">
          {new Date(active.timestamp).toLocaleDateString("en-US", {
            weekday: "long",
          })}
        </p>
      </div>

      {/* Chart */}
      {!isPending ? (
        <ChartView data={data} onHover={setHovered} />
      ) : (
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      )}
    </motion.div>
  );
}

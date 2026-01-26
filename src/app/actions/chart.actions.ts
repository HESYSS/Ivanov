"use server";

import { unstable_cache } from "next/cache";
import { ChartRange, ChartPoint } from "../types/chart";

async function _getChart(
  range: ChartRange,
  publicKey: string,
): Promise<ChartPoint[]> {
  // mock price history logic (replace with etherscan / price api if needed)
  const now = Date.now();
  const points: ChartPoint[] = [];

  const steps = range === "1D" ? 24 : range === "1W" ? 7 : 30;

  for (let i = steps; i >= 0; i--) {
    points.push({
      time: new Date(now - i * 86400000).toISOString().slice(0, 10),
      value: 1000 + Math.random() * 300,
    });
  }

  return points;
}

export const getChart = unstable_cache(_getChart, ["chart"], {
  revalidate: 60,
});

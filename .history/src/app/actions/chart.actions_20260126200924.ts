"use server";

import { withCache } from "../lib/cache";
import { ChartPoint, Timeframe } from "../types/chart";

function generateMockData(tf: Timeframe): ChartPoint[] {
  const now = Date.now();

  const config = {
    "1D": { points: 24, step: 60 * 60 * 1000 },
    "1W": { points: 7, step: 24 * 60 * 60 * 1000 },
    "1M": { points: 30, step: 24 * 60 * 60 * 1000 },
  }[tf];

  return Array.from({ length: config.points }).map((_, i) => ({
    timestamp: now - (config.points - i) * config.step,
    value: 1800 + i * 8,
  }));
}

export async function getChartData(
  publicKey: string,
  timeframe: Timeframe,
): Promise<ChartPoint[]> {
  return withCache(`${publicKey}:chart:${timeframe}`, 60_000, async () =>
    generateMockData(timeframe),
  );
}

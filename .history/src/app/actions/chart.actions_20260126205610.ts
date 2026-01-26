"use server";

import { withCache } from "../lib/cache";
import { ChartPoint, Timeframe } from "../types/chart";

function generateMockData(tf: Timeframe): ChartPoint[] {
  const now = Date.now();

  const config: Record<Timeframe, { points: number; step: number }> = {
    "1H": { points: 60, step: 60 * 1000 },
    "6H": { points: 72, step: 5 * 60 * 1000 },
    "1D": { points: 24, step: 60 * 60 * 1000 },
    "1W": { points: 7, step: 24 * 60 * 60 * 1000 },
    "1M": { points: 30, step: 24 * 60 * 60 * 1000 },
    All: { points: 365, step: 24 * 60 * 60 * 1000 },
  };

  const settings = config[tf];
  const baseValue = 223.43;

  return Array.from({ length: settings.points }).map((_, i) => ({
    timestamp: now - (settings.points - i) * settings.step,
    value: baseValue + (Math.sin(i / 10) * 50 + Math.random() * 30),
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

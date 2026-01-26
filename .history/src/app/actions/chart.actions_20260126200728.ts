"use server";

import { withCache } from "../lib/cache";
import { ChartPoint } from "../types/chart";

export async function getChartData(
  publicKey: string,
  timeframe: string,
): Promise<ChartPoint[]> {
  return withCache(`${publicKey}:chart:${timeframe}`, 60_000, async () => {
    // mock data допустим для тестового
    return Array.from({ length: 30 }).map((_, i) => ({
      timestamp: Date.now() - (30 - i) * 86400000,
      value: 1800 + i * 10,
    }));
  });
}

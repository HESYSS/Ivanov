"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MotionButton } from "./MotionButton";
import { ChartRange } from "../types/chart";

export function ChartBlock({ data, activeRange }) {
  const router = useRouter();
  const params = useSearchParams();

  const onChangeRange = (range: ChartRange) => {
    const next = new URLSearchParams(params.toString());
    next.set("range", range);
    router.push(`?${next.toString()}`);
  };

  return (
    <>
      {/* график */}

      {(["1D", "1W", "1M"] as ChartRange[]).map((r) => (
        <MotionButton
          key={r}
          onClick={() => onChangeRange(r)}
          disabled={r === activeRange}
        >
          {r}
        </MotionButton>
      ))}
    </>
  );
}

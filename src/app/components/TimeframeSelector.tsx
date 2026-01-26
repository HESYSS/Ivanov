"use client";

import { MotionButton } from "./MotionButton";
import { Timeframe } from "../types/chart";

type Props = {
  value: Timeframe;
  onChange: (tf: Timeframe) => void;
};

const FRAMES: Timeframe[] = ["1D", "1W", "1M"];

export function TimeframeSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {FRAMES.map((tf) => (
        <MotionButton
          key={tf}
          onClick={() => onChange(tf)}
          className={`px-3 py-1 rounded ${
            value === tf ? "bg-white text-black" : "bg-neutral-800 text-white"
          }`}
        >
          {tf}
        </MotionButton>
      ))}
    </div>
  );
}

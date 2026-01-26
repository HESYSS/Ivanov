"use client";

import { motion } from "framer-motion";
import { Timeframe } from "../types/chart";

type Props = {
  selected: Timeframe;
  onChange: (tf: Timeframe) => void;
  disabled?: boolean;
};

const FRAMES: Timeframe[] = ["1H", "6H", "1D", "1W", "1M", "All"];

export function TimeframeSelector({ selected, onChange, disabled }: Props) {
  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
      {FRAMES.map((tf) => (
        <motion.button
          key={tf}
          onClick={() => onChange(tf as Timeframe)}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
            selected === tf
              ? "bg-white text-orange-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          } disabled:opacity-50`}
        >
          {tf}
        </motion.button>
      ))}
    </div>
  );
}

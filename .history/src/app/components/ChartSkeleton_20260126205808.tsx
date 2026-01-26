"use client";

import { motion } from "framer-motion";

export function ChartSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <div className="bg-gradient-to-b from-gray-100 to-gray-50 h-64 rounded-2xl overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
      </div>
    </motion.div>
  );
}

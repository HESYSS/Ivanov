"use client";

import { motion } from "framer-motion";

export function PageHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <h1 className="text-5xl font-bold text-white mb-2">DeFi Dashboard</h1>
      <p className="text-orange-100">Track your portfolio and manage your assets</p>
    </motion.div>
  );
}

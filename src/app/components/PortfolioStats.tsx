"use client";

import { useEffect, useState, useTransition } from "react";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { getWalletBalance } from "../actions/wallet.actions";

type Props = {
  publicKey: string;
};

export function PortfolioStats({ publicKey }: Props) {
  const [stats, setStats] = useState({
    totalValue: 0,
    change24h: 0,
    change24hPercent: 0,
    highValue: 0,
    lowValue: 0,
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getWalletBalance(publicKey);
        setStats({
          totalValue: data.balanceUsd,
          change24h: data.dayChange,
          change24hPercent: data.dayChangePercent,
          highValue: data.balanceUsd * 1.05,
          lowValue: data.balanceUsd * 0.95,
        });
      } catch (e) {
        console.error("[PortfolioStats] Failed to fetch", e);
      }
    });
  }, [publicKey]);

  const statCards = [
    {
      label: "Total Value",
      value: stats.totalValue,
      suffix: "$",
      color: "text-blue-600",
    },
    {
      label: "24h Change",
      value: Math.abs(stats.change24h),
      suffix: "$",
      color: stats.change24h >= 0 ? "text-green-600" : "text-red-600",
      prefix: stats.change24h >= 0 ? "+" : "-",
    },
    {
      label: "24h Change %",
      value: Math.abs(stats.change24hPercent),
      suffix: "%",
      color: stats.change24hPercent >= 0 ? "text-green-600" : "text-red-600",
      prefix: stats.change24hPercent >= 0 ? "+" : "-",
    },
    {
      label: "High",
      value: stats.highValue,
      suffix: "$",
      color: "text-purple-600",
    },
    {
      label: "Low",
      value: stats.lowValue,
      suffix: "$",
      color: "text-cyan-600",
    },
  ];

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {statCards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow"
        >
          <p className="text-xs text-gray-500 mb-2">{card.label}</p>
          <p className={`text-lg font-bold ${card.color}`}>
            {card.prefix}
            {card.suffix === "$" ? "$" : ""}
            <NumberFlow
              value={card.value}
              format={{
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }}
            />
            {card.suffix === "%" ? "%" : ""}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

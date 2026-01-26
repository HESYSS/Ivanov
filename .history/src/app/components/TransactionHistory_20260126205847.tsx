"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  type: "in" | "out";
}

type Props = {
  publicKey: string;
};

export function TransactionHistory({ publicKey }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // В реальном приложении здесь был бы вызов сервера
    // для получения транзакций из EtherScan
    setLoading(true);
    setTimeout(() => {
      setTransactions([
        {
          hash: "0x123...abc",
          from: "0x742d...bE0",
          to: "0x123...def",
          value: "0.5 WETH",
          timeStamp: new Date().toISOString(),
          type: "out",
        },
        {
          hash: "0x456...def",
          from: "0x456...ghi",
          to: "0x742d...bE0",
          value: "1.2 WETH",
          timeStamp: new Date(Date.now() - 3600000).toISOString(),
          type: "in",
        },
      ]);
      setLoading(false);
    }, 500);
  }, [publicKey]);

  if (loading) {
    return <div className="animate-pulse h-20 bg-gray-200 rounded-lg" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-3xl p-8 shadow-xl"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.map((tx, i) => (
          <motion.div
            key={tx.hash}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-xl border ${
              tx.type === "in"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === "in"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {tx.type === "in" ? "⬇️" : "⬆️"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{tx.value}</p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.timeStamp).toLocaleDateString()}
                </p>
              </div>
            </div>
            <a
              href={`https://etherscan.io/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-orange-600 hover:text-orange-700"
            >
              {tx.hash}
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

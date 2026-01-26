"use client";

import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  getStoredTransactions,
  getTransactionStats,
  shouldRefreshCache,
  type LocalTransaction,
} from "../lib/localStorage";
import { getTransactionHistory } from "../actions/transactions.actions";
import NumberFlow from "@number-flow/react";

type Props = {
  publicKey: string;
};

export function TransactionHistory({ publicKey }: Props) {
  const [transactions, setTransactions] = useState<LocalTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    incoming: 0,
    outgoing: 0,
  });
  const [isPending, startTransition] = useTransition();

  // Функция для обновления списка транзакций
  const refreshTransactions = () => {
    const stored = getStoredTransactions();
    setTransactions(stored);
    setStats(getTransactionStats());
  };

  // Загружаем транзакции при монтировании
  useEffect(() => {
    setLoading(true);

    // Сначала показываем сохранённые транзакции
    refreshTransactions();

    // Если кеш устарел, загружаем с сервера
    if (shouldRefreshCache()) {
      startTransition(async () => {
        try {
          const serverTxs = await getTransactionHistory(publicKey);

          // Преобразуем серверные транзакции в локальный формат
          const localTxs: LocalTransaction[] = serverTxs.map((tx) => ({
            id: tx.hash,
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            timestamp: new Date(tx.timeStamp).getTime(),
            type: tx.type,
            status: "completed" as const,
            description: `${tx.type === "in" ? "Received" : "Sent"} ${tx.value} WETH`,
          }));

          setTransactions(localTxs);
          // Сохраняем в localStorage
          localTxs.forEach((tx) => {
            const stored = getStoredTransactions();
            if (!stored.find((s) => s.hash === tx.hash)) {
              localStorage.setItem(
                "defi_transactions",
                JSON.stringify([tx, ...stored]),
              );
            }
          });

          setStats(getTransactionStats());
        } catch (e) {
          console.error("[TransactionHistory] Failed to fetch", e);
          // Используем сохранённые данные если ошибка
        } finally {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  }, [publicKey]);

  // Слушаем евент обновления транзакций
  useEffect(() => {
    const handleTransactionUpdate = () => {
      refreshTransactions();
    };

    window.addEventListener("transactionUpdated", handleTransactionUpdate);
    return () =>
      window.removeEventListener("transactionUpdated", handleTransactionUpdate);
  }, []);

  if (loading && transactions.length === 0) {
    return <div className="animate-pulse h-20 bg-gray-200 rounded-lg" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-3xl p-8 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Recent Transactions
        </h3>
        <div className="text-sm text-gray-500">
          {transactions.length} transactions
        </div>
      </div>

      {/* Статистика */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-xs text-gray-500">Incoming</p>
            <p className="text-lg font-bold text-green-600">
              <NumberFlow value={stats.incoming} />
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Outgoing</p>
            <p className="text-lg font-bold text-red-600">
              <NumberFlow value={stats.outgoing} />
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-bold text-gray-900">
              <NumberFlow value={stats.total} />
            </p>
          </div>
        </div>
      )}

      {/* Список транзакций */}
      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.slice(0, 10).map((tx, i) => (
            <motion.div
              key={tx.hash}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md ${
                tx.type === "in"
                  ? "border-green-200 bg-green-50 hover:bg-green-100"
                  : "border-red-200 bg-red-50 hover:bg-red-100"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
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
                  <p className="text-sm font-semibold text-gray-900">
                    {tx.description ||
                      `${tx.type === "in" ? "Received" : "Sent"} ${tx.value} WETH`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.timestamp).toLocaleDateString()} at{" "}
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    tx.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : tx.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {tx.status}
                </span>

                <a
                  href={`https://etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-orange-600 hover:text-orange-700 underline"
                  title="View on EtherScan"
                >
                  {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {isPending ? "Loading transactions..." : "No transactions yet"}
        </div>
      )}
    </motion.div>
  );
}

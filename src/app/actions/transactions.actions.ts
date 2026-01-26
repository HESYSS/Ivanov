"use server";

import { getTokenTransfers } from "../lib/etherscan";
import { withCache } from "../lib/cache";

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  type: "in" | "out";
  blockNumber: string;
  transactionIndex: string;
  gasUsed: string;
  gasPrice: string;
  methodId: string;
  functionName: string;
}

export async function getTransactionHistory(
  publicKey: string,
  tokenAddress?: string,
): Promise<Transaction[]> {
  return withCache(`${publicKey}:transactions`, 300_000, async () => {
    try {
      const token = tokenAddress || process.env.TOKEN_ADDRESS;
      if (!token) return [];

      const rawTransactions = await getTokenTransfers(publicKey, token);

      if (!Array.isArray(rawTransactions)) return [];

      // Преобразуем данные из EtherScan в наш формат
      const transactions: Transaction[] = rawTransactions
        .slice(0, 10) // Берём последние 10
        .map((tx: any) => ({
          hash: tx.hash,
          from: tx.from.toLowerCase(),
          to: tx.to.toLowerCase(),
          value: (Number(tx.value) / 1e18).toFixed(4),
          timeStamp: new Date(Number(tx.timeStamp) * 1000).toISOString(),
          type: tx.to.toLowerCase() === publicKey.toLowerCase() ? "in" : "out",
          blockNumber: tx.blockNumber,
          transactionIndex: tx.transactionIndex,
          gasUsed: tx.gas,
          gasPrice: tx.gasPrice,
          methodId: tx.methodId,
          functionName: tx.functionName,
        }));

      return transactions;
    } catch (e) {
      console.error("[getTransactionHistory] Error:", e);
      return [];
    }
  });
}

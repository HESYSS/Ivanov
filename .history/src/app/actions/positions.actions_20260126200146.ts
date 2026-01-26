"use server";

import { provider } from "../lib/ethers";
import { cacheByKey } from "../lib/cache";
import { formatEther } from "ethers";

import { getEthPrice } from "../lib/etherscan";
import { getEntryPrice } from "../lib/wallet";

async function _getPosition(publicKey: string) {
  const balanceWei = await provider.getBalance(publicKey);
  const balance = Number(formatEther(balanceWei));

  // simplified P/L logic placeholder
  const profitLoss = balance * 0.08;

  return {
    balance,
    profitLoss,
  };
}

export async function getPositionPnL(publicKey: string) {
  const entryPrice = await getEntryPrice(publicKey);
  const currentPrice = await getEthPrice();
  const amount = 1; // или из позиций

  const pnl = (currentPrice - entryPrice) * amount;
  const pnlPercent = (currentPrice / entryPrice - 1) * 100;

  return {
    pnl,
    pnlPercent,
    isProfit: pnl >= 0,
  };
}
export const getPosition = cacheByKey(_getPosition, "position", 60);

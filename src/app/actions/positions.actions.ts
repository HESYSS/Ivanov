"use server";

import { formatEther } from "ethers";

import { getEthPrice } from "../lib/etherscan";
import { getEntryPrice } from "../lib/wallet";

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

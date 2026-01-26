"use server";

import { getSafeWallet } from "../lib/wallet";
import { getEthPrice, getTokenBalance } from "../lib/etherscan";
import { withCache } from "../lib/cache";

export async function getWalletBalance(publicKey: string) {
  return withCache(`${publicKey}:balance`, 30_000, async () => {
    try {
      const currentPrice = await getEthPrice();
      const tokenBalance = await getTokenBalance(publicKey);

      // Преобразуем в человеческий формат (18 decimals для WETH)
      const balance = Number(tokenBalance) / 1e18;
      const balanceUsd = balance * currentPrice;

      // Вычисляем изменение за день (мок для теста)
      const dayChange = 15.5;
      const dayChangePercent = (dayChange / balanceUsd) * 100;

      return {
        balance: parseFloat(balance.toFixed(2)),
        balanceUsd: parseFloat(balanceUsd.toFixed(2)),
        dayChange: parseFloat(dayChange.toFixed(2)),
        dayChangePercent: parseFloat(dayChangePercent.toFixed(2)),
      };
    } catch (e) {
      console.error("[getWalletBalance] Error:", e);
      return {
        balance: 0,
        balanceUsd: 0,
        dayChange: 0,
        dayChangePercent: 0,
      };
    }
  });
}

export async function handleDeposit(publicKey: string) {
  try {
    const wallet = getSafeWallet();
    if (!wallet) throw new Error("Wallet not configured");

    // В реальном приложении здесь был бы вызов смарт-контракта
    // Для теста - просто логируем
    console.log(`[DEPOSIT] From: ${publicKey}, Amount: 0.5 WETH`);

    // Имитируем задержку транзакции
    await new Promise((r) => setTimeout(r, 2000));

    return {
      success: true,
      hash: `0x${Math.random().toString(16).slice(2)}`,
    };
  } catch (e) {
    console.error("[handleDeposit] Error:", e);
    throw e;
  }
}

export async function handleWithdraw(publicKey: string) {
  try {
    const wallet = getSafeWallet();
    if (!wallet) throw new Error("Wallet not configured");

    // В реальном приложении здесь был бы вызов смарт-контракта
    console.log(`[WITHDRAW] To: ${publicKey}, Amount: 0.25 WETH`);

    // Имитируем задержку транзакции
    await new Promise((r) => setTimeout(r, 2000));

    return {
      success: true,
      hash: `0x${Math.random().toString(16).slice(2)}`,
    };
  } catch (e) {
    console.error("[handleWithdraw] Error:", e);
    throw e;
  }
}

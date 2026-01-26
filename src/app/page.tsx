"use client";

import { BalanceCard } from "./components/BalanceCard";
import { ChartBlock } from "./components/ChartBlock";
import { ActionButtons } from "./components/ActionButtons";
import { Toaster, toast } from "react-hot-toast";

export default function Page() {
  const publicKey = "0xTEST";

  const handleDeposit = async () => {
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Deposit successful!");
    } catch (e) {
      toast.error("Deposit failed!");
    }
  };

  const handleWithdraw = async () => {
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Withdraw successful!");
    } catch (e) {
      toast.error("Withdraw failed!");
    }
  };

  return (
    <main style={{ padding: 32, display: "grid", gap: 24 }}>
      <h1>DeFi Dashboard</h1>

      {/* Balance + Profit/Loss */}
      <BalanceCard publicKey={publicKey} />

      {/* Chart with timeframe switch */}
      <ChartBlock publicKey={publicKey} />

      <ActionButtons onDeposit={handleDeposit} onWithdraw={handleWithdraw} />

      <Toaster position="top-right" />
    </main>
  );
}

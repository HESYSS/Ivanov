"use client";

import NumberFlow from "@number-flow/react";

export function BalanceCard({
  balance,
  profitLoss,
}: {
  balance: number;
  profitLoss: number;
}) {
  return (
    <div>
      <h3>Balance</h3>
      <NumberFlow value={balance} />

      <h4>PnL</h4>
      <NumberFlow value={profitLoss} />
    </div>
  );
}

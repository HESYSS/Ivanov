import NumberFlow from "@number-flow/react";

export function BalanceCard({ pnl }: { pnl: number }) {
  return (
    <NumberFlow
      value={pnl}
      className={pnl >= 0 ? "text-green-500" : "text-red-500"}
    />
  );
}

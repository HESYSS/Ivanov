"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { getPositionPnL } from "../actions/positions.actions";

type Props = {
  publicKey: string;
};

export function BalanceCard({ publicKey }: Props) {
  const [pnl, setPnl] = useState(0);

  useEffect(() => {
    let isMounted = true;

    getPositionPnL(publicKey)
      .then((res) => {
        if (isMounted) setPnl(res.pnl);
      })
      .catch((e) => console.error("[BalanceCard] getPositionPnL failed", e));

    return () => {
      isMounted = false;
    };
  }, [publicKey]);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">Profit / Loss</span>
      <NumberFlow
        value={pnl}
        className={
          pnl >= 0
            ? "text-green-500 text-2xl font-semibold"
            : "text-red-500 text-2xl font-semibold"
        }
      />
    </div>
  );
}

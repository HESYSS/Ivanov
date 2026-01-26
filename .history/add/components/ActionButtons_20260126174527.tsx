"use client";

import { MotionButton } from "./MotionButton";
import { deposit, withdraw } from "@/app/actions/wallet.actions";
import { useTransition } from "react";

export function ActionButtons() {
  const [isPending, startTransition] = useTransition();

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <MotionButton
        disabled={isPending}
        onClick={() =>
          startTransition(() => {
            deposit("0.01");
          })
        }
      >
        Deposit
      </MotionButton>

      <MotionButton
        disabled={isPending}
        onClick={() =>
          startTransition(() => {
            withdraw(process.env.NEXT_PUBLIC_WALLET_ADDRESS!, "0.01");
          })
        }
      >
        Withdraw
      </MotionButton>
    </div>
  );
}

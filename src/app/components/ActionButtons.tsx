"use client";

import { MotionButton } from "./MotionButton";

type Props = {
  onDeposit: () => Promise<void>;
  onWithdraw: () => Promise<void>;
  loading?: boolean;
};

export function ActionButtons({ onDeposit, onWithdraw, loading }: Props) {
  return (
    <div className="flex gap-2">
      <MotionButton
        onClick={onDeposit}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        Deposit
      </MotionButton>

      <MotionButton
        onClick={onWithdraw}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
      >
        Withdraw
      </MotionButton>
    </div>
  );
}

"use client";

import { useEffect, useState, useTransition } from "react";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { getWalletBalance } from "../actions/wallet.actions";
import { getPositionPnL } from "../actions/positions.actions";
import { MotionButton } from "./MotionButton";
import toast from "react-hot-toast";
import { handleDeposit, handleWithdraw } from "../actions/wallet.actions";

type Props = {
  publicKey: string;
};

const walletJoinDate = "Nov 2025"; // или из конфига

export function BalanceCard({ publicKey }: Props) {
  const [balance, setBalance] = useState(0);
  const [balanceUsd, setBalanceUsd] = useState(0);
  const [dayChange, setDayChange] = useState(0);
  const [dayChangePercent, setDayChangePercent] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getWalletBalance(publicKey);
        setBalance(data.balance);
        setBalanceUsd(data.balanceUsd);
        setDayChange(data.dayChange);
        setDayChangePercent(data.dayChangePercent);
      } catch (e) {
        console.error("[BalanceCard] Failed to fetch balance", e);
      }
    });
  }, [publicKey]);

  const handleDepositClick = async () => {
    try {
      startTransition(async () => {
        await handleDeposit(publicKey);
        // Refetch balance
        const data = await getWalletBalance(publicKey);
        setBalance(data.balance);
        setBalanceUsd(data.balanceUsd);
        toast.success("Deposit successful!");
      });
    } catch (e) {
      toast.error("Deposit failed!");
    }
  };

  const handleWithdrawClick = async () => {
    try {
      startTransition(async () => {
        await handleWithdraw(publicKey);
        // Refetch balance
        const data = await getWalletBalance(publicKey);
        setBalance(data.balance);
        setBalanceUsd(data.balanceUsd);
        toast.success("Withdraw successful!");
      });
    } catch (e) {
      toast.error("Withdraw failed!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl p-8 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">💼</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Wallet</h2>
            <p className="text-sm text-gray-500">Joined {walletJoinDate}</p>
          </div>
        </div>
      </div>

      {/* Portfolio Info */}
      <div className="flex justify-between mb-8 text-sm">
        <div>
          <p className="text-gray-500 text-xs mb-1">Portfolio ( Not USDC )</p>
          <p className="font-semibold text-gray-900">
            $
            <NumberFlow value={balanceUsd} />
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs mb-1">
            {process.env.NEXT_PUBLIC_TOKEN_SYMBOL} + Portfolio
          </p>
          <p className="font-semibold text-gray-900">
            $
            <NumberFlow value={balanceUsd} />
          </p>
        </div>
      </div>

      {/* Main Balance */}
      <div className="mb-6">
        <motion.div
          key={balance}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-5xl font-bold text-gray-900 mb-2"
        >
          <NumberFlow value={balance} />
          <span className="text-2xl ml-2">WETH</span>
        </motion.div>

        {/* Day Change */}
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-semibold ${
              dayChange >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {dayChange >= 0 ? "+" : ""}
            <NumberFlow value={dayChange} />
          </span>
          <span
            className={`text-xs font-medium ${
              dayChangePercent >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {dayChangePercent >= 0 ? "+" : ""}
            <NumberFlow value={dayChangePercent} />%
          </span>
          <span className="text-xs text-gray-500">Today</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <MotionButton
          onClick={handleDepositClick}
          disabled={isPending}
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <span>⬇️</span>
          Deposit
        </MotionButton>

        <MotionButton
          onClick={handleWithdrawClick}
          disabled={isPending}
          className="flex-1 border-2 border-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <span>⬆️</span>
          Withdraw
        </MotionButton>
      </div>
    </motion.div>
  );
}

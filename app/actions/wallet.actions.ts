"use server";

import { wallet } from "../lib/ethers";
import { parseEther } from "ethers";

export async function deposit(amountEth: string) {
  const tx = await wallet.sendTransaction({
    to: wallet.address,
    value: parseEther(amountEth),
  });

  await tx.wait();

  return {
    hash: tx.hash,
  };
}

export async function withdraw(to: string, amountEth: string) {
  const tx = await wallet.sendTransaction({
    to,
    value: parseEther(amountEth),
  });

  await tx.wait();

  return {
    hash: tx.hash,
  };
}

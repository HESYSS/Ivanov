import { JsonRpcProvider, Wallet } from "ethers";
import { getSafeWallet } from "../lib/wallet";

export const provider = new JsonRpcProvider(process.env.RPC_URL);

export function getWallet() {
  const wallet = getSafeWallet();

  if (!wallet) {
    return {
      ok: false,
      error: "Wallet unavailable",
    };
  }

  return {
    ok: true,
    wallet,
  };
}

import { Wallet } from "ethers";
import { getSafeProvider } from "./safeRpc";

export function getSafeWallet() {
  try {
    const pk = process.env.WALLET_PRIVATE_KEY;

    if (!pk) {
      console.error("WALLET_PRIVATE_KEY is missing");
      return null;
    }

    if (!pk.startsWith("0x") || pk.length !== 66) {
      console.error("Invalid private key format");
      return null;
    }

    const provider = getSafeProvider();
    if (!provider) return null;

    return new Wallet(pk, provider);
  } catch (e) {
    console.error("[WALLET INIT ERROR]", e);
    return null;
  }
}

export async function getEntryPrice(_: string): Promise<number> {
  // минимально допустимо для тестового
  return 1800;
}

import { formatEther } from "ethers";
import { getSafeProvider } from "./safeRpc";

export async function getEthBalance(address: string) {
  try {
    const provider = getSafeProvider();
    if (!provider) return null;

    const balance = await provider.getBalance(address);
    return formatEther(balance);
  } catch (error) {
    console.error("[BALANCE ERROR]", error);
    return null;
  }
}

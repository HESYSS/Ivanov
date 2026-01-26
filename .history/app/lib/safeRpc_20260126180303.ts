import { JsonRpcProvider } from "ethers";

export function getSafeProvider() {
  try {
    if (!process.env.RPC_URL) {
      throw new Error("RPC_URL is not defined");
    }

    return new JsonRpcProvider(process.env.RPC_URL);
  } catch (error) {
    console.error("[RPC INIT ERROR]", error);
    return null;
  }
}

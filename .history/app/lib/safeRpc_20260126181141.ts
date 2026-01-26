import { JsonRpcProvider } from "ethers";

export function getSafeProvider() {
  try {
    const rpc = process.env.RPC_URL;

    if (!rpc) {
      console.error("RPC_URL is missing");
      return null;
    }

    return new JsonRpcProvider(rpc);
  } catch (e) {
    console.error("[RPC ERROR]", e);
    return null;
  }
}

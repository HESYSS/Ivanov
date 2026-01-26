const ETHERSCAN_API = "https://api.etherscan.io/api";

export async function getTokenTransfers(address: string, token: string) {
  const url = `${ETHERSCAN_API}?module=account&action=tokentx&address=${address}&contractaddress=${token}&apikey=${process.env.ETHERSCAN_API_KEY}`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  return data.result || [];
}

export async function getEthPrice(): Promise<number> {
  try {
    const res = await fetch(
      `${ETHERSCAN_API}?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_API_KEY}`,
      { cache: "no-store" },
    );
    const json = await res.json();
    return Number(json.result.ethusd);
  } catch (e) {
    console.error("[getEthPrice] Error:", e);
    // Fallback to mock price
    return 2500;
  }
}

export async function getTokenBalance(
  address: string,
  tokenAddress?: string,
): Promise<string> {
  const token = tokenAddress || process.env.TOKEN_ADDRESS;
  if (!token) return "0";

  try {
    const url = `${ETHERSCAN_API}?module=account&action=tokenbalance&address=${address}&contractaddress=${token}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`;

    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    if (json.status === "1") {
      return json.result;
    }
    return "0";
  } catch (e) {
    console.error("[getTokenBalance] Error:", e);
    // Fallback to mock balance
    return (1.5 * 1e18).toString();
  }
}

export async function getEthBalance(address: string): Promise<string> {
  try {
    const url = `${ETHERSCAN_API}?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`;

    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    if (json.status === "1") {
      return json.result;
    }
    return "0";
  } catch (e) {
    console.error("[getEthBalance] Error:", e);
    return "0";
  }
}

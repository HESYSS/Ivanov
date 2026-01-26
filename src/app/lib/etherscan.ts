const ETHERSCAN_API = "https://api.etherscan.io/api";

export async function getTokenTransfers(address: string, token: string) {
  try {
    const url = `${ETHERSCAN_API}?module=account&action=tokentx&address=${address}&contractaddress=${token}&apikey=${process.env.ETHERSCAN_API_KEY}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    return data.result || [];
  } catch (e) {
    console.warn("[getTokenTransfers] API unavailable, using fallback");
    return [];
  }
}

export async function getEthPrice(): Promise<number> {
  try {
    const res = await fetch(
      `${ETHERSCAN_API}?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_API_KEY}`,
      { cache: "no-store" },
    );
    const json = await res.json();

    if (json.status === "1" && json.result?.ethusd) {
      return Number(json.result.ethusd);
    }
    return 2500; // Fallback
  } catch (e) {
    console.warn("[getEthPrice] API unavailable, using fallback");
    return 2500; // Fallback to mock price
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

    if (json.status === "1" && json.result) {
      return json.result;
    }
    return (1.5 * 1e18).toString(); // Fallback
  } catch (e) {
    console.warn("[getTokenBalance] API unavailable, using fallback");
    return (1.5 * 1e18).toString(); // Fallback to mock balance
  }
}

export async function getEthBalance(address: string): Promise<string> {
  try {
    const url = `${ETHERSCAN_API}?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`;
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    if (json.status === "1" && json.result) {
      return json.result;
    }
    return (0.5 * 1e18).toString(); // Fallback
  } catch (e) {
    console.warn("[getEthBalance] API unavailable, using fallback");
    return (0.5 * 1e18).toString(); // Fallback
  }
}

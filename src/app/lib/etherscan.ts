const ETHERSCAN_API = "https://api.etherscan.io/api";

export async function getTokenTransfers(address: string, token: string) {
  const url = `${ETHERSCAN_API}?module=account&action=tokentx&address=${address}&contractaddress=${token}&apikey=${process.env.ETHERSCAN_API_KEY}`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  return data.result || [];
}

export async function getEthPrice(): Promise<number> {
  const res = await fetch(
    `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_API_KEY}`,
  );
  const json = await res.json();
  return Number(json.result.ethusd);
}

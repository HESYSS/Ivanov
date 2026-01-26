const ETHERSCAN_API = "https://api.etherscan.io/api";

export async function getTokenTransfers(address: string, token: string) {
  const url = `${ETHERSCAN_API}?module=account&action=tokentx&address=${address}&contractaddress=${token}&apikey=${process.env.ETHERSCAN_API_KEY}`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  return data.result || [];
}

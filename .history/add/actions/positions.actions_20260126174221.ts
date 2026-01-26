"use server";


import { provider } from "@/lib/ethers";
import { cacheByKey } from "@/lib/cache";
import { formatEther } from "ethers";


async function _getPosition(publicKey: string) {
const balanceWei = await provider.getBalance(publicKey);
const balance = Number(formatEther(balanceWei));


// simplified P/L logic placeholder
const profitLoss = balance * 0.08;


return {
balance,
profitLoss,
};
}


export const getPosition = cacheByKey(
_getPosition,
"position",
60
);
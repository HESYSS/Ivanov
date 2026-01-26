import { getPosition } from "./actions/positions.actions";
import { getChart } from "./actions/chart.actions";
import { BalanceCard } from "./components/BalanceCard";
import { ChartBlock } from "./components/ChartBlock";
import { ActionButtons } from "./components/ActionButtons";
import { ChartRange } from "./types/chart";
import { number } from "prop-types";

export default async function Page({
  searchParams,
}: {
  searchParams: { range?: ChartRange };
}) {
  const publicKey = process.env.PUBLIC_WALLET_ADDRESS;
  const range: ChartRange = searchParams.range ?? "1D";

  /** fallback значения */
  let position: { balance: number; profitLoss: number } = {
    balance: 0,
    profitLoss: 0,
  };

  let chart: any[] = [];

  if (!publicKey) {
    console.error("PUBLIC_WALLET_ADDRESS is missing");
  } else {
    try {
      const result = await getPosition(publicKey);
      if (result) position = result;
    } catch (e) {
      console.error("[GET POSITION FAILED]", e);
    }

    try {
      const result = await getChart(range, publicKey);
      if (result) chart = result;
    } catch (e) {
      console.error("[GET CHART FAILED]", e);
    }
  }

  return (
    <main style={{ padding: 32, display: "grid", gap: 24 }}>
      <h1>DeFi Dashboard</h1>

      <BalanceCard
        balance={position.balance}
        profitLoss={position.profitLoss}
      />

      <ChartBlock data={chart} activeRange={range} />

      <ActionButtons />
    </main>
  );
}

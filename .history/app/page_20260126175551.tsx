import { getPosition } from "./actions/positions.actions";
import { getChart } from "./actions/chart.actions";
import { BalanceCard } from "./components/BalanceCard";
import { ChartBlock } from "./components/ChartBlock";
import { ActionButtons } from "./components/ActionButtons";
import { ChartRange } from "./types/chart";

export default async function Page({
  searchParams,
}: {
  searchParams: { range?: ChartRange };
}) {
  const publicKey = process.env.PUBLIC_WALLET_ADDRESS!;
  const range = searchParams.range ?? "1D";

  const position = await getPosition(publicKey);
  const chart = await getChart(range, publicKey);

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

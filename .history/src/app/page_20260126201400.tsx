import { BalanceCard } from "./components/BalanceCard";
import { ChartBlock } from "./components/ChartBlock";
import { ActionButtons } from "./components/ActionButtons";

export default function Page() {
  const publicKey = process.env.PUBLIC_WALLET_ADDRESS;

  if (!publicKey) {
    console.error("PUBLIC_WALLET_ADDRESS is missing");
    return <div>Please set PUBLIC_WALLET_ADDRESS in .env</div>;
  }

  return (
    <main style={{ padding: 32, display: "grid", gap: 24 }}>
      <h1>DeFi Dashboard</h1>

      {/* Balance + Profit/Loss */}
      <BalanceCard publicKey={publicKey} />

      {/* Chart with timeframe switch */}
      <ChartBlock publicKey={publicKey} />

      <ActionButtons />
    </main>
  );
}

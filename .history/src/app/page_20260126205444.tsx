import { BalanceCard } from "./components/BalanceCard";
import { ChartBlock } from "./components/ChartBlock";
import { ToasterProvider } from "./components/ToasterProvider";

const publicKey = process.env.PUBLIC_WALLET_ADDRESS || "0x0";

export default function Page() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-700 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Block - Wallet Balance */}
            <BalanceCard publicKey={publicKey} />

            {/* Right Block - Profit/Loss Chart */}
            <ChartBlock publicKey={publicKey} />
          </div>
        </div>
      </main>
      <ToasterProvider />
    </>
  );
}

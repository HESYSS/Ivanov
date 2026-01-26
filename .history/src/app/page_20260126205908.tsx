import { BalanceCard } from "./components/BalanceCard";
import { ChartBlock } from "./components/ChartBlock";
import { TransactionHistory } from "./components/TransactionHistory";
import { PortfolioStats } from "./components/PortfolioStats";
import { ToasterProvider } from "./components/ToasterProvider";
import { PageHeader } from "./components/PageHeader";

const publicKey = process.env.PUBLIC_WALLET_ADDRESS || "0x0";

export default function Page() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-700 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <PageHeader />

          {/* Portfolio Stats */}
          <div className="mb-8">
            <PortfolioStats publicKey={publicKey} />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Block - Wallet Balance */}
            <BalanceCard publicKey={publicKey} />

            {/* Right Block - Profit/Loss Chart */}
            <ChartBlock publicKey={publicKey} />
          </div>

          {/* Transaction History */}
          <TransactionHistory publicKey={publicKey} />
        </div>
      </main>
      <ToasterProvider />
    </>
  );
}

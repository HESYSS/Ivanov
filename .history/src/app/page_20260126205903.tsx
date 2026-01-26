import { motion } from "framer-motion";
import { BalanceCard } from "./components/BalanceCard";
import { ChartBlock } from "./components/ChartBlock";
import { TransactionHistory } from "./components/TransactionHistory";
import { PortfolioStats } from "./components/PortfolioStats";
import { ToasterProvider } from "./components/ToasterProvider";

const publicKey = process.env.PUBLIC_WALLET_ADDRESS || "0x0";

export default function Page() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-700 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-2">DeFi Dashboard</h1>
            <p className="text-orange-100">Track your portfolio and manage your assets</p>
          </motion.div>

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

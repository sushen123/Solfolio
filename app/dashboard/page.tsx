"use client"

import { WalletConnectButton } from "@/components/wallet-connect-button"
import { PortfolioOverview } from "@/components/portfolio-overview"
import { HoldingsTable } from "@/components/holdings-table"
import { HistoricalChart } from "@/components/historical-chart"
import { ActivityFeed } from "@/components/activity-feed"
import { AIInsights } from "@/components/ai-insights"
import { useState } from "react"

export default function DashboardPage() {
  const [connectedWallet, setConnectedWallet] = useState<string>("")

  const handleWalletConnect = (address: string) => {
    setConnectedWallet(address)
  }

  const displayAddress = connectedWallet || "9B5X4bsuM373NUZAUBbGkCBDm2KwBL5zTg6G5V8UqJ7k"

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {connectedWallet ? "Your connected wallet portfolio" : "Default portfolio view"}
            </p>
          </div>
          <WalletConnectButton
            onConnect={handleWalletConnect}
            isConnected={!!connectedWallet}
            connectedAddress={connectedWallet}
          />
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Portfolio Overview */}
          <PortfolioOverview walletAddress={displayAddress} />

          {/* Charts and Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <HistoricalChart />
            </div>
            <div>
              <AIInsights />
            </div>
          </div>

          {/* Holdings Table */}
          <HoldingsTable />

          {/* Activity Feed */}
          <ActivityFeed />
        </div>
      </div>
    </main>
  )
}

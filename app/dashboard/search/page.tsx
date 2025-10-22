"use client"

import { useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { PortfolioOverview } from "@/components/portfolio-overview"
import { HoldingsTable } from "@/components/holdings-table"
import { HistoricalChart } from "@/components/historical-chart"
import { ActivityFeed } from "@/components/activity-feed"
import { AIInsights } from "@/components/ai-insights"

export default function SearchPage() {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isSearched, setIsSearched] = useState<boolean>(false)

  const handleSearch = (address: string) => {
    setWalletAddress(address)
    setIsSearched(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">Search Wallet</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Enter a wallet address to analyze its portfolio</p>
        </div>

        <SearchBar onSearch={handleSearch} />

        {/* Search Results */}
        {isSearched && (
          <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
            {/* Portfolio Overview */}
            <PortfolioOverview walletAddress={walletAddress} />

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
        )}

        {/* Empty State */}
        {!isSearched && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="text-center px-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">Search for any Solana wallet</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Enter a wallet address above to view detailed portfolio analytics and holdings
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

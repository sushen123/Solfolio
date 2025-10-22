import { PortfolioOverview } from "@/components/portfolio-overview"
import { HoldingsTable } from "@/components/holdings-table"
import { HistoricalChart } from "@/components/historical-chart"
import { ActivityFeed } from "@/components/activity-feed"
import { AIInsights } from "@/components/ai-insights"
import { MultifolioGrid } from "@/components/multifolio-grid"

export default function MultifolioPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Multifolio</h1>
          <p className="text-muted-foreground">View aggregated data across all your portfolios</p>
        </div>

        <div className="space-y-6">
          {/* Portfolio Overview - Aggregated */}
          <PortfolioOverview walletAddress="all-portfolios" />

          {/* Charts and Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HistoricalChart />
            </div>
            <div>
              <AIInsights />
            </div>
          </div>

          {/* Holdings Table - Aggregated */}
          <HoldingsTable />

          {/* Activity Feed - Aggregated */}
          <ActivityFeed />

          {/* Portfolio Management Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Manage Portfolios</h2>
            <MultifolioGrid />
          </div>
        </div>
      </div>
    </main>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface PortfolioOverviewProps {
  walletAddress: string
}

const DUMMY_PORTFOLIO_DATA = {
  totalValue: 125430.5,
  change24h: 3250.75,
  changePercent24h: 2.65,
  topAssets: [
    { name: "SOL", value: 45000, percentage: 35.8 },
    { name: "USDC", value: 32000, percentage: 25.5 },
    { name: "ORCA", value: 22500, percentage: 17.9 },
    { name: "COPE", value: 15000, percentage: 11.9 },
    { name: "Others", value: 10930.5, percentage: 8.7 },
  ],
}

const COLORS = [
  "#a78bfa", // Purple (chart-1)
  "#22d3ee", // Cyan (chart-2)
  "#10b981", // Green (chart-3)
  "#f59e0b", // Orange (chart-4)
  "#ec4899", // Pink (chart-5)
]

export function PortfolioOverview({ walletAddress }: PortfolioOverviewProps) {
  const isPositive = DUMMY_PORTFOLIO_DATA.change24h >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Value Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-foreground">
              ${DUMMY_PORTFOLIO_DATA.totalValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">
              Wallet: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 24h Change Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">24h Change</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className={`text-3xl font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? "+" : ""}
              {DUMMY_PORTFOLIO_DATA.change24h.toLocaleString("en-US", { maximumFractionDigits: 2 })} USD
            </p>
            <p className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? "+" : ""}
              {DUMMY_PORTFOLIO_DATA.changePercent24h.toFixed(2)}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Top Assets Pie Chart */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Top 5 Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={DUMMY_PORTFOLIO_DATA.topAssets}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {DUMMY_PORTFOLIO_DATA.topAssets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {DUMMY_PORTFOLIO_DATA.topAssets.map((asset, index) => (
              <div key={asset.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-foreground font-medium">{asset.name}</span>
                </div>
                <span className="text-muted-foreground">{asset.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

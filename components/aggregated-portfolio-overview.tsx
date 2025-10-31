"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChainDistributionCard } from "./ChainDistributionCard"
import { Skeleton } from "./ui/skeleton"

const PnlValue = ({ value, percentage, hideSign = false }: { value: number; percentage?: number, hideSign?: boolean }) => {
  const isPositive = value >= 0;
  const color = isPositive ? "text-green-500" : "text-red-500";
  const sign = isPositive ? "+" : "";

  return (
    <div className="font-bold">
      <span className={color}>
        {hideSign ? "" : sign}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      {percentage !== undefined && (
        <span className={`text-sm ml-2 ${color}`}>
          ({sign}{percentage.toFixed(1)}%)
        </span>
      )}
    </div>
  );
};

interface AggregatedPortfolioOverviewProps {
  aggregatedData: any;
  pnlSummary: any;
  loading: boolean;
}

export function AggregatedPortfolioOverview({ aggregatedData, pnlSummary, loading }: AggregatedPortfolioOverviewProps) {
  if (loading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle></CardHeader><CardContent><Skeleton className="h-10 w-3/4" /></CardContent></Card>
            <Card className="bg-card border-border"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">24h Change</CardTitle></CardHeader><CardContent><Skeleton className="h-10 w-3/4" /></CardContent></Card>
            <Card className="bg-card border-border"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Chain Distribution</CardTitle></CardHeader><CardContent><div className="flex items-center justify-center h-48"><Skeleton className="h-36 w-36 rounded-full" /></div></CardContent></Card>
        </div>
    )
  }

  if (!aggregatedData) {
    return (
      <div className="text-center py-12 text-lg text-muted-foreground">
        Add a portfolio to see your aggregated data.
      </div>
    )
  }

  const { totalValue, change24h, changePercent24h, positions_distribution_by_chain } = aggregatedData;
  console.log(positions_distribution_by_chain, "console.log")
  const isPositive = change24h >= 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Value Card */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              ${totalValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </p>
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
                {change24h.toLocaleString("en-US", { maximumFractionDigits: 2 })} USD
              </p>
              <p className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? "+" : ""}
                {changePercent24h.toFixed(2)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pnlSummary && pnlSummary.net_invested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Realized PnL</CardTitle>
            </CardHeader>
            <CardContent>
              {pnlSummary && <PnlValue value={pnlSummary.realized_gain} />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unrealized PnL</CardTitle>
            </CardHeader>
            <CardContent>
              {pnlSummary && <PnlValue value={pnlSummary.unrealized_gain} />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pnlSummary && pnlSummary.received_external.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pnlSummary && pnlSummary.sent_external.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </CardContent>
          </Card>
        </div>
        <ChainDistributionCard distribution={positions_distribution_by_chain} />
      </div>
    </div>
  )
}

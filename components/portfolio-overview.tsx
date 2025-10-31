
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChainDistributionCard } from "./ChainDistributionCard"

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

interface PortfolioOverviewProps {
  walletAddress: string;
  pnlSummary: any;
}

export function PortfolioOverview({ walletAddress, pnlSummary }: PortfolioOverviewProps) {
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (walletAddress) {
      setLoading(true)
      setNotFound(false)
      setError(null)
      fetch(`/api/portfolio/${walletAddress}`)
        .then((res) => {
          if (res.status === 404) {
            setNotFound(true)
            throw new Error('Wallet not found');
          }
          if (!res.ok) {
            throw new Error('Failed to fetch portfolio data');
          }
          return res.json()
        })
        .then((data) => {
          setPortfolioData(data.data)
          setLoading(false)
        })
        .catch((err) => {
          if (!notFound) {
            setError(err.message)
          }
          setLoading(false)
        })
    }
  }, [walletAddress, notFound])

  if (loading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle></CardHeader><CardContent><div className="h-16 w-1/2 bg-muted/50 animate-pulse rounded-md"></div></CardContent></Card>
            <Card className="bg-card border-border"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">24h Change</CardTitle></CardHeader><CardContent><div className="h-16 w-1/2 bg-muted/50 animate-pulse rounded-md"></div></CardContent></Card>
            <Card className="bg-card border-border"><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Chain Distribution</CardTitle></CardHeader><CardContent><div className="h-48 w-full bg-muted/50 animate-pulse rounded-full"></div></CardContent></Card>
        </div>
    )
  }

  if (notFound) {
    return <div className="text-center py-12 text-lg text-muted-foreground">Wallet not found. Please check the address and try again.</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!portfolioData) {
    return null
  }

  const { attributes } = portfolioData;
  const totalValue = attributes.total.positions || 0;
  const change24h = attributes.changes.absolute_1d || 0;
  const changePercent24h = attributes.changes.percent_1d || 0;
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
            <div className="space-y-2">
              <p className="text-3xl font-bold text-foreground">
                ${totalValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}
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
        <ChainDistributionCard distribution={attributes.positions_distribution_by_chain} />
      </div>
    </div>
  )
}


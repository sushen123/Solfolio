"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Portfolio {
  id: string
  name: string
  description: string
  walletAddress: string
  totalValue: number
  change24h: number
  changePercent24h: number
  assetCount: number
  createdDate: string
  isLoading: boolean
}

interface MultifolioGridProps {
  portfolios: Portfolio[]
  onPortfolioDeleted: () => void
}

export function MultifolioGrid({ portfolios, onPortfolioDeleted }: MultifolioGridProps) {
  const [internalPortfolios, setInternalPortfolios] = useState<Portfolio[]>(portfolios)

  useEffect(() => {
    setInternalPortfolios(portfolios)
  }, [portfolios])

  useEffect(() => {
    const fetchPortfolioData = async (portfolio: Portfolio) => {
      try {
        const response = await fetch(`/api/portfolio/${portfolio.walletAddress}`)
        console.log(response, "response")
        
        if (response.status === 404) {
          // Handle wallet not found gracefully
          setInternalPortfolios((prev) =>
            prev.map((p) =>
              p.id === portfolio.id ? { ...p, isLoading: false, totalValue: 0, change24h: 0 } : p
            )
          );
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch portfolio data. Status: ${response.status}`)
        }

        const data = await response.json()
        const portfolioData = data.data.attributes
        console.log(portfolioData, "portfoliodata")
        setInternalPortfolios((prev) =>
          prev.map((p) =>
            p.id === portfolio.id
              ? {
                  ...p,
                  totalValue: portfolioData.total.positions || 0,
                  change24h: portfolioData.changes.absolute_1d || 0,
                  changePercent24h: portfolioData.changes.percent_1d || 0,
                  assetCount: portfolioData.total.positions > 0 ? 1 : 0, // This is a simplification
                  isLoading: false,
                }
              : p
          )
        )
      } catch (error) {
        console.error(`Error fetching portfolio data for ${portfolio.walletAddress}:`, error)
        setInternalPortfolios((prev) => prev.map((p) => (p.id === portfolio.id ? { ...p, isLoading: false } : p)))
      }
    }

    internalPortfolios.forEach((p) => {
      if (p.isLoading) {
        fetchPortfolioData(p)
      }
    })
  }, [internalPortfolios])

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch(`/api/multifolio/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove portfolio');
      onPortfolioDeleted(); // Refetch portfolios in parent
    } catch (err: any) {
      console.error(err.message);
    }
  }
 
  const totalPortfolioValue = internalPortfolios.reduce((sum, p) => sum + (p.totalValue ?? 0), 0)
  const totalChange = internalPortfolios.reduce((sum, p) => sum + (p.change24h ?? 0), 0)
  console.log(internalPortfolios, 'inter')

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-background to-background/50 border-border/50">
          <p className="text-sm text-muted-foreground mb-2">Total Portfolio Value</p>
          <p className="text-3xl font-bold text-foreground">
            ${totalPortfolioValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-background to-background/50 border-border/50">
          <p className="text-sm text-muted-foreground mb-2">24h Change</p>
          <div className="flex items-center gap-2">
            {totalChange >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            <p className={`text-3xl font-bold ${totalChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              ${Math.abs(totalChange).toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </p>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-background to-background/50 border-border/50">
          <p className="text-sm text-muted-foreground mb-2">Active Portfolios</p>
          <p className="text-3xl font-bold text-foreground">{internalPortfolios.length}</p>
        </Card>
      </div>

      {/* Portfolios Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Your Portfolios</h2>
        {internalPortfolios.length === 0 ? (
          <Card className="p-12 text-center border-border/50">
            <p className="text-muted-foreground text-lg">No portfolios created yet</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internalPortfolios.map((portfolio) =>
              portfolio.isLoading ? (
                <Card
                  key={portfolio.id}
                  className="p-6 bg-gradient-to-br from-background to-background/50 border-border/50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full mt-1" />
                    </div>
                    <Skeleton className="w-5 h-5" />
                  </div>
                  <div className="space-y-4">
                    <div className="bg-background/50 rounded-lg p-4">
                      <Skeleton className="h-4 w-1/4 mb-2" />
                      <Skeleton className="h-8 w-1/2" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-background/50 rounded-lg p-3">
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-5 w-3/4" />
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <Skeleton className="h-4 w-1/3 mb-2" />
                        <Skeleton className="h-5 w-1/4" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </Card>
              ) : (
                <Card
                  key={portfolio.id}
                  className="p-6 bg-gradient-to-br from-background to-background/50 border-border/50 hover:border-purple-500/50 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-purple-400 transition-colors">
                        {portfolio.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{portfolio.description}</p>
                      <p className="text-sm text-muted-foreground mt-1 truncate">{portfolio.walletAddress}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(portfolio.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors ml-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-background/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${(portfolio.totalValue ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">24h Change</p>
                        <div className="flex items-center gap-1">
                          {portfolio.change24h >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <p
                            className={`text-sm font-semibold ${
                              portfolio.change24h >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {portfolio.changePercent24h > 0 ? "+" : ""}
                            {(portfolio.changePercent24h ?? 0).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Assets</p>
                        <p className="text-sm font-semibold text-foreground">{portfolio.assetCount}</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">Created {portfolio.createdDate}</p>
                  </div>
                </Card>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, TrendingUp, TrendingDown } from "lucide-react"

interface Portfolio {
  id: string
  name: string
  description: string
  totalValue: number
  change24h: number
  changePercent24h: number
  assetCount: number
  createdDate: string
}

export function MultifolioGrid() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      id: "1",
      name: "Long Term Holdings",
      description: "Core investment portfolio",
      totalValue: 125430.5,
      change24h: 2150.75,
      changePercent24h: 1.74,
      assetCount: 12,
      createdDate: "2024-01-01",
    },
    {
      id: "2",
      name: "Trading Portfolio",
      description: "Active trading positions",
      totalValue: 45230.2,
      change24h: -850.5,
      changePercent24h: -1.85,
      assetCount: 8,
      createdDate: "2024-01-10",
    },
    {
      id: "3",
      name: "Meme Coins",
      description: "High-risk meme tokens",
      totalValue: 12450.75,
      change24h: 3250.25,
      changePercent24h: 35.2,
      assetCount: 15,
      createdDate: "2024-01-15",
    },
  ])

  const [newPortfolioName, setNewPortfolioName] = useState("")
  const [newPortfolioDesc, setNewPortfolioDesc] = useState("")

  const handleAddPortfolio = () => {
    if (newPortfolioName) {
      const newPortfolio: Portfolio = {
        id: Date.now().toString(),
        name: newPortfolioName,
        description: newPortfolioDesc,
        totalValue: 0,
        change24h: 0,
        changePercent24h: 0,
        assetCount: 0,
        createdDate: new Date().toISOString().split("T")[0],
      }
      setPortfolios([...portfolios, newPortfolio])
      setNewPortfolioName("")
      setNewPortfolioDesc("")
    }
  }

  const handleRemove = (id: string) => {
    setPortfolios(portfolios.filter((p) => p.id !== id))
  }

  const totalPortfolioValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0)
  const totalChange = portfolios.reduce((sum, p) => sum + p.change24h, 0)

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
          <p className="text-3xl font-bold text-foreground">{portfolios.length}</p>
        </Card>
      </div>

      {/* Create New Portfolio */}
      <Card className="p-8 bg-gradient-to-br from-background to-background/50 border-border/50">
        <h2 className="text-2xl font-bold text-foreground mb-6">Create New Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Portfolio Name</label>
            <Input
              placeholder="e.g., Growth Portfolio"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <Input
              placeholder="e.g., Long-term investment strategy"
              value={newPortfolioDesc}
              onChange={(e) => setNewPortfolioDesc(e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>
        </div>
        <Button onClick={handleAddPortfolio} className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Portfolio
        </Button>
      </Card>

      {/* Portfolios Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Your Portfolios</h2>
        {portfolios.length === 0 ? (
          <Card className="p-12 text-center border-border/50">
            <p className="text-muted-foreground text-lg">No portfolios created yet</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
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
                      ${portfolio.totalValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}
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
                          {portfolio.changePercent24h.toFixed(2)}%
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

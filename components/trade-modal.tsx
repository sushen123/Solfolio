"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TradeModalProps {
  isOpen: boolean
  onClose: () => void
  token: {
    name: string
    symbol: string
    price: number
    change24h: number
    balance: number
    value: number
  } | null
}

export function TradeModal({ isOpen, onClose, token }: TradeModalProps) {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")

  if (!token) return null

  // Generate token address (mock)
  const tokenAddress = `PUSS${Math.random().toString(36).substring(2, 15).toUpperCase()}...${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  // Mock data for token info
  const tokenInfo = {
    priceUSD: token.price,
    priceTRX: token.price * 57.14,
    liquidity: Math.random() * 1000 + 500,
    volume24h: Math.random() * 5 + 1,
    volumeChange: (Math.random() - 0.5) * 10,
  }

  const isPositiveChange = tokenInfo.volumeChange >= 0

  const formatPrice = (value: number, decimals = 2) => {
    return Number.parseFloat(value.toFixed(decimals)).toString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">{token.symbol}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{token.name}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Token Address */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Token Address</p>
            <p className="text-sm font-mono text-foreground break-all">{tokenAddress}</p>
          </div>

          {/* Token Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price USD</p>
              <p className="text-xl font-bold text-foreground">${formatPrice(tokenInfo.priceUSD, 2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price TRX</p>
              <p className="text-xl font-bold text-foreground">{formatPrice(tokenInfo.priceTRX, 3)} TRX</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Liquidity</p>
              <p className="text-xl font-bold text-foreground">${formatPrice(tokenInfo.liquidity, 0)}K</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">24h Volume</p>
              <p className="text-xl font-bold text-foreground">{formatPrice(tokenInfo.volume24h, 1)}K TRX</p>
            </div>
            <div className="col-span-2 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">24h Change</p>
              <div className={`flex items-center gap-2 ${isPositiveChange ? "text-green-500" : "text-red-500"}`}>
                {isPositiveChange ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <p className="text-xl font-bold">{Math.abs(tokenInfo.volumeChange).toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Buy/Sell Tabs */}
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab("buy")}
              className={`px-4 py-2 font-semibold text-sm transition-all ${
                activeTab === "buy"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              className={`px-4 py-2 font-semibold text-sm transition-all ${
                activeTab === "sell"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sell
            </button>
          </div>

          {/* Trade Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                {activeTab === "buy" ? "Amount to Buy" : "Amount to Sell"}
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-muted border-border text-foreground"
                />
                <Button variant="outline" size="sm" className="bg-transparent">
                  Max
                </Button>
              </div>
            </div>

            {/* Price Breakdown */}
            {amount && (
              <Card className="bg-muted/30 border-border/50 p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Price per token:</span>
                  <span className="text-foreground font-semibold">${formatPrice(tokenInfo.priceUSD, 2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Fee (0.5%):</span>
                  <span className="text-foreground font-semibold">
                    ${(Number.parseFloat(amount) * tokenInfo.priceUSD * 0.005).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Total:</span>
                  <span className="text-lg text-foreground font-bold">
                    ${(Number.parseFloat(amount) * tokenInfo.priceUSD * 1.005).toFixed(2)}
                  </span>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                className={`flex-1 ${activeTab === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              >
                {activeTab === "buy" ? "Buy" : "Sell"} {token.symbol}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

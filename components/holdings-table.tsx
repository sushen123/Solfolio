"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { TradeModal } from "./trade-modal"

const DUMMY_ASSETS = [
  {
    id: 1,
    name: "Solana",
    symbol: "SOL",
    price: 142.5,
    change24h: 5.23,
    balance: 315.5,
    value: 44956.75,
  },
  {
    id: 2,
    name: "USD Coin",
    symbol: "USDC",
    price: 1.0,
    change24h: 0.02,
    balance: 32000,
    value: 32000,
  },
  {
    id: 3,
    name: "Orca",
    symbol: "ORCA",
    price: 1.85,
    change24h: -2.15,
    balance: 12162.16,
    value: 22510,
  },
  {
    id: 4,
    name: "Cope Token",
    symbol: "COPE",
    price: 0.0892,
    change24h: 8.45,
    balance: 168224.72,
    value: 15009.27,
  },
  {
    id: 5,
    name: "Marinade",
    symbol: "MNDE",
    price: 2.34,
    change24h: -1.23,
    balance: 4672.5,
    value: 10938.45,
  },
]

const DUMMY_MEMES = [
  {
    id: 1,
    name: "Dogwifhat",
    symbol: "WIF",
    price: 2.45,
    change24h: 12.5,
    balance: 5000,
    value: 12250,
  },
  {
    id: 2,
    name: "Bonk",
    symbol: "BONK",
    price: 0.0089,
    change24h: -3.2,
    balance: 2500000,
    value: 22250,
  },
  {
    id: 3,
    name: "Shib",
    symbol: "SHIB",
    price: 0.000012,
    change24h: 6.8,
    balance: 1000000000,
    value: 12000,
  },
  {
    id: 4,
    name: "Floki",
    symbol: "FLOKI",
    price: 0.00015,
    change24h: -5.4,
    balance: 50000000,
    value: 7500,
  },
]

const DUMMY_NFTS = [
  {
    id: 1,
    name: "Magic Eden Wizard",
    symbol: "MEW",
    price: 15.5,
    change24h: 8.2,
    balance: 3,
    value: 46.5,
  },
  {
    id: 2,
    name: "Solana Monkey Business",
    symbol: "SMB",
    price: 8.75,
    change24h: -2.1,
    balance: 2,
    value: 17.5,
  },
  {
    id: 3,
    name: "DeGods",
    symbol: "DGOD",
    price: 12.3,
    change24h: 4.5,
    balance: 1,
    value: 12.3,
  },
  {
    id: 4,
    name: "Okay Bears",
    symbol: "OKBR",
    price: 5.2,
    change24h: 1.8,
    balance: 4,
    value: 20.8,
  },
]

export function HoldingsTable() {
  const [activeTab, setActiveTab] = useState<"assets" | "memes" | "nfts">("assets")
  const [selectedToken, setSelectedToken] = useState<any>(null)
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)

  const getDisplayData = () => {
    switch (activeTab) {
      case "memes":
        return DUMMY_MEMES
      case "nfts":
        return DUMMY_NFTS
      default:
        return DUMMY_ASSETS
    }
  }

  const handleTradeClick = (token: any) => {
    setSelectedToken(token)
    setIsTradeModalOpen(true)
  }

  const displayData = getDisplayData()

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Your Holdings</CardTitle>
          <div className="flex gap-2 mt-4">
            <Button
              variant={activeTab === "assets" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("assets")}
              className="rounded-full"
            >
              Assets
            </Button>
            <Button
              variant={activeTab === "memes" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("memes")}
              className="rounded-full"
            >
              Memes
            </Button>
            <Button
              variant={activeTab === "nfts" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("nfts")}
              className="rounded-full"
            >
              NFTs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Token</TableHead>
                  <TableHead className="text-right text-muted-foreground">Price</TableHead>
                  <TableHead className="text-right text-muted-foreground">24h Change</TableHead>
                  <TableHead className="text-right text-muted-foreground">Balance</TableHead>
                  <TableHead className="text-right text-muted-foreground">Value</TableHead>
                  <TableHead className="text-center text-muted-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((holding) => {
                  const isPositive = holding.change24h >= 0
                  return (
                    <TableRow key={holding.id} className="border-border hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div>
                          <p className="text-foreground">{holding.name}</p>
                          <p className="text-xs text-muted-foreground">{holding.symbol}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-foreground">${holding.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`flex items-center justify-end gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}
                        >
                          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          <span>{Math.abs(holding.change24h).toFixed(2)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-foreground">
                        {holding.balance.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        ${holding.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" onClick={() => handleTradeClick(holding)}>
                          Trade
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TradeModal isOpen={isTradeModalOpen} onClose={() => setIsTradeModalOpen(false)} token={selectedToken} />
    </>
  )
}

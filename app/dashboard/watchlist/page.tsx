"use client"

import { useState } from "react"
import { WatchlistTable } from "@/components/watchlist-table"
import { AddToWatchlist } from "@/components/add-to-watchlist"

const INITIAL_WATCHLIST = [
  {
    id: 1,
    name: "Solana",
    symbol: "SOL",
    price: 142.5,
    change24h: 5.23,
    marketCap: 65000000000,
    volume24h: 2500000000,
  },
  {
    id: 2,
    name: "Raydium",
    symbol: "RAY",
    price: 5.45,
    change24h: -2.15,
    marketCap: 1200000000,
    volume24h: 85000000,
  },
  {
    id: 3,
    name: "Magic Eden",
    symbol: "ME",
    price: 3.2,
    change24h: 8.45,
    marketCap: 850000000,
    volume24h: 45000000,
  },
  {
    id: 4,
    name: "Phantom",
    symbol: "PHANTOM",
    price: 0.85,
    change24h: -1.23,
    marketCap: 500000000,
    volume24h: 25000000,
  },
  {
    id: 5,
    name: "Marinade",
    symbol: "MNDE",
    price: 2.34,
    change24h: 3.67,
    marketCap: 450000000,
    volume24h: 15000000,
  },
]

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST)

  const handleAddToken = (token: any) => {
    const newToken = {
      id: Math.max(...watchlist.map((t) => t.id), 0) + 1,
      name: token.name,
      symbol: token.symbol,
      price: token.price,
      change24h: Math.random() * 20 - 10,
      marketCap: Math.random() * 5000000000,
      volume24h: Math.random() * 500000000,
    }
    setWatchlist([...watchlist, newToken])
  }

  const handleRemoveToken = (id: number) => {
    setWatchlist(watchlist.filter((token) => token.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Watchlist</h1>
        <p className="text-muted-foreground">Track your favorite tokens and monitor their performance</p>
      </div>

      <AddToWatchlist onAdd={handleAddToken} />
      <WatchlistTable watchlist={watchlist} onRemove={handleRemoveToken} />
    </div>
  )
}

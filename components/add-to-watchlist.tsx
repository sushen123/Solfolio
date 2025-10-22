"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

const AVAILABLE_TOKENS = [
  { id: 6, name: "Jupiter", symbol: "JUP", price: 0.95 },
  { id: 7, name: "Orca", symbol: "ORCA", price: 1.23 },
  { id: 8, name: "Serum", symbol: "SRM", price: 0.45 },
  { id: 9, name: "Cope", symbol: "COPE", price: 0.12 },
  { id: 10, name: "Tulip", symbol: "TULIP", price: 0.08 },
  { id: 11, name: "Cope Token", symbol: "COPE", price: 0.15 },
  { id: 12, name: "Atrix", symbol: "ATRIX", price: 0.22 },
]

interface AddToWatchlistProps {
  onAdd: (token: any) => void
}

export function AddToWatchlist({ onAdd }: AddToWatchlistProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTokens, setFilteredTokens] = useState(AVAILABLE_TOKENS)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredTokens(AVAILABLE_TOKENS)
    } else {
      const filtered = AVAILABLE_TOKENS.filter(
        (token) =>
          token.name.toLowerCase().includes(query.toLowerCase()) ||
          token.symbol.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredTokens(filtered)
    }
  }

  return (
    <Card className="bg-card border-border mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add to Watchlist
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">Search and add tokens to track</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tokens by name or symbol..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{token.symbol}</p>
                    <p className="text-xs text-muted-foreground">{token.name}</p>
                    <p className="text-sm text-primary font-semibold">${token.price.toFixed(2)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onAdd(token)
                      setSearchQuery("")
                      setFilteredTokens(AVAILABLE_TOKENS)
                    }}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No tokens found</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

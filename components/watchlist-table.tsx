"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react"

interface WatchlistTableProps {
  watchlist: any[]
  onRemove: (id: number) => void
}

export function WatchlistTable({ watchlist, onRemove }: WatchlistTableProps) {
  if (watchlist.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-12">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">No items in watchlist</h2>
              <p className="text-muted-foreground">Add tokens to your watchlist to track them here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Your Watchlist</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">{watchlist.length} tokens tracked</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Token</TableHead>
                <TableHead className="text-right text-muted-foreground">Price</TableHead>
                <TableHead className="text-right text-muted-foreground">24h Change</TableHead>
                <TableHead className="text-right text-muted-foreground">Market Cap</TableHead>
                <TableHead className="text-right text-muted-foreground">24h Volume</TableHead>
                <TableHead className="text-center text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchlist.map((token) => {
                const isPositive = token.change24h >= 0
                return (
                  <TableRow key={token.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <p className="text-foreground">{token.name}</p>
                        <p className="text-xs text-muted-foreground">{token.symbol}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-foreground">${token.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`flex items-center justify-end gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}
                      >
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span>{Math.abs(token.change24h).toFixed(2)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      ${(token.marketCap / 1000000000).toFixed(2)}B
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      ${(token.volume24h / 1000000).toFixed(2)}M
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(token.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
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
  )
}

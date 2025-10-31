"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TradeModal } from "./trade-modal"

interface HoldingsTableProps {
  limit?: number
  walletAddresses?: string[]
}

export function HoldingsTable({ limit, walletAddresses }: HoldingsTableProps) {
  const { data: session } = useSession()
  const connectedAddress = (session as any)?.publicKey
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedToken, setSelectedToken] = useState<any>(null)
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)

  useEffect(() => {
    const addresses = walletAddresses && walletAddresses.length > 0 ? walletAddresses : (connectedAddress ? [connectedAddress] : [])
    
    if (addresses.length > 0) {
      setLoading(true)
      setError(null)
      
      const fetchAllHoldings = async () => {
        try {
          const allPositions: any[] = []
          for (const address of addresses) {
            const res = await fetch(`/api/positions/${address}`)
            if (!res.ok) throw new Error(`Failed to fetch holdings for ${address}`)
            const data = await res.json()
            const positions = data.data
              .filter((pos: any) => pos.attributes.value && pos.attributes.value > 0.001 && pos.type !== 'nft' && !pos.attributes.fungible_info?.flags?.is_meme)
              .map((pos: any) => ({ ...pos, walletAddress: address })) // Add wallet address to each position
            allPositions.push(...positions)
          }

          // Simple aggregation: combine and sort by value
          const aggregatedAssets = allPositions.sort((a, b) => (b.attributes.value || 0) - (a.attributes.value || 0));
          setAssets(aggregatedAssets)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }
      
      fetchAllHoldings()
    } else {
      setLoading(false)
      setAssets([])
    }
  }, [connectedAddress, walletAddresses])

  const handleTradeClick = (token: any) => {
    setSelectedToken(token)
    setIsTradeModalOpen(true)
  }

  const allData = assets
  const displayData = limit ? allData.slice(0, limit) : allData

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>{walletAddresses ? 'Aggregated Holdings' : 'Your Holdings'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="h-64 w-full bg-muted/50 animate-pulse rounded-md"></div>
            ) : error ? (
              <div className="text-red-500">Error: {error}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Token</TableHead>
                    <TableHead className="text-right text-muted-foreground">Price</TableHead>
                    <TableHead className="text-right text-muted-foreground">Balance</TableHead>
                    <TableHead className="text-right text-muted-foreground">Value</TableHead>
                    <TableHead className="text-center text-muted-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayData.map((holding, index) => {
                    const attributes = holding.attributes
                    const fungibleInfo = attributes.fungible_info
                    
                    return (
                      <TableRow key={`${holding.walletAddress}-${holding.id}-${index}`} className="border-border hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Link href={`/dashboard/asset/${holding.id}`}>
                            <div>
                              <p className="text-foreground hover:underline">{fungibleInfo?.name || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground">{fungibleInfo?.symbol || 'N/A'}</p>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right text-foreground">${attributes.price?.toFixed(2) || '0.00'}</TableCell>
                        <TableCell className="text-right text-foreground">
                          {attributes.quantity.float.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground">
                          ${(attributes.value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
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
            )}
          </div>
        </CardContent>
        {limit && allData.length > limit && (
          <CardFooter className="flex justify-center">
            <Link href="/dashboard/assets">
              <Button variant="outline">See All</Button>
            </Link>
          </CardFooter>
        )}
      </Card>

      <TradeModal isOpen={isTradeModalOpen} onClose={() => setIsTradeModalOpen(false)} token={selectedToken} />
    </>
  )
}

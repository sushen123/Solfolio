"use client"

import { HoldingsTable } from "@/components/holdings-table"
import { HistoricalChart } from "@/components/historical-chart"
import { ActivityFeed } from "@/components/activity-feed"
import { AIInsights } from "@/components/ai-insights"
import { MultifolioGrid } from "@/components/multifolio-grid"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { DUMMY_PROTOCOLS } from "@/lib/dummy-protocols"
import { ProtocolViewTable } from "@/components/protocol-view-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AggregatedPortfolioOverview } from "@/components/aggregated-portfolio-overview"
import { useSession } from "next-auth/react"

export default function MultifolioPage() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false)
  const [newPortfolioName, setNewPortfolioName] = useState("")
  const [newPortfolioDesc, setNewPortfolioDesc] = useState("")
  const [newPortfolioAddress, setNewPortfolioAddress] = useState("")

  const [portfolios, setPortfolios] = useState<any[]>([])
  const [aggregatedData, setAggregatedData] = useState<any>(null)
  const [aggregatedPnl, setAggregatedPnl] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolios = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch('/api/multifolio');
      if (!res.ok) throw new Error('Failed to fetch portfolios');
      const data = await res.json();

      // Add client-side specific fields, including isLoading: true
      const initializedPortfolios = data.map((p: any) => ({
        ...p,
        totalValue: 0, // Initialize to 0
        change24h: 0, // Initialize to 0
        changePercent24h: 0, // Initialize to 0
        assetCount: 0, // Initialize to 0
        isLoading: true, // Set to true to trigger data fetching in MultifolioGrid
      }));

      setPortfolios(initializedPortfolios);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [session]);

  useEffect(() => {
    const aggregateData = async () => {
      if (portfolios.length === 0) {
        setAggregatedData(null)
        setAggregatedPnl(null)
        return
      }

      setLoading(true)
      let totalValue = 0
      let totalChange24h = 0
      let combinedDistribution: { [key: string]: number } = {}
      
      let totalNetInvested = 0
      let totalRealizedGain = 0
      let totalUnrealizedGain = 0
      let totalReceived = 0
      let totalSent = 0

      for (const portfolio of portfolios) {
        try {
          const portfolioRes = await fetch(`/api/portfolio/${portfolio.walletAddress}`)
          if (portfolioRes.ok) {
            const portfolioData = await portfolioRes.json()
            const attributes = portfolioData.data.attributes
            totalValue += attributes.total.positions || 0
            totalChange24h += attributes.changes.absolute_1d || 0
            
            Object.entries(attributes.positions_distribution_by_chain).forEach(([chainId, chainValue]: [string, any]) => {
              if (!combinedDistribution[chainId]) {
                combinedDistribution[chainId] = 0
              }
              combinedDistribution[chainId] += chainValue || 0 // Correctly use the direct value
            })
          }

          const pnlRes = await fetch(`/api/pnl/${portfolio.walletAddress}`)
          if (pnlRes.ok) {
            const pnlData = await pnlRes.json()
            const pnlAttributes = pnlData.data.attributes
            totalNetInvested += pnlAttributes.net_invested || 0
            totalRealizedGain += pnlAttributes.realized_gain || 0
            totalUnrealizedGain += pnlAttributes.unrealized_gain || 0
            totalReceived += pnlAttributes.received_external || 0
            totalSent += pnlAttributes.sent_external || 0
          }
        } catch (error) {
          console.error(`Failed to fetch data for ${portfolio.walletAddress}`, error)
        }
      }

      setAggregatedData({
        totalValue,
        change24h: totalChange24h,
        changePercent24h: totalValue > 0 ? (totalChange24h / (totalValue - totalChange24h)) * 100 : 0,
        positions_distribution_by_chain: combinedDistribution,
      })
      
      setAggregatedPnl({
        net_invested: totalNetInvested,
        realized_gain: totalRealizedGain,
        unrealized_gain: totalUnrealizedGain,
        received_external: totalReceived,
        sent_external: totalSent,
      })

      setLoading(false)
    }

    aggregateData()
  }, [portfolios])

  const handleAddPortfolio = async () => {
    if (newPortfolioName && newPortfolioAddress) {
      try {
        console.log("Adding portfolio:", { name: newPortfolioName, walletAddress: newPortfolioAddress });
        const res = await fetch('/api/multifolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newPortfolioName, walletAddress: newPortfolioAddress, description: newPortfolioDesc }),
        });
        console.log("Add portfolio response:", res);
        if (!res.ok) {
          const errorBody = await res.json();
          throw new Error(errorBody.error || 'Failed to add portfolio');
        }
        fetchPortfolios(); // Refetch
        setNewPortfolioName("")
        setNewPortfolioDesc("")
        setNewPortfolioAddress("")
        setOpen(false)
      } catch (err: any) {
        console.error("Error adding portfolio:", err);
        setError(err.message);
      }
    }
  }

  const walletAddresses = portfolios.map(p => p.walletAddress)

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">Multifolio</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Aggregated view of all your portfolios
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Portfolio</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Portfolio</DialogTitle>
                <DialogDescription>
                  Add a new wallet address to track in your multifolio.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newPortfolioName}
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Growth Portfolio"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newPortfolioDesc}
                    onChange={(e) => setNewPortfolioDesc(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Long-term holds"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={newPortfolioAddress}
                    onChange={(e) => setNewPortfolioAddress(e.target.value)}
                    className="col-span-3"
                    placeholder="Wallet Address"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddPortfolio}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Aggregated Portfolio Overview */}
          <AggregatedPortfolioOverview aggregatedData={aggregatedData} pnlSummary={aggregatedPnl} loading={loading} />

          {/* Charts and Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <HistoricalChart walletAddresses={walletAddresses} />
            </div>
            <div>
              <AIInsights />
            </div>
          </div>

          <Tabs defaultValue="token-view">
            <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
              <TabsTrigger value="token-view">Token View</TabsTrigger>
              <TabsTrigger value="protocol-view">Protocol View</TabsTrigger>
            </TabsList>
            <TabsContent value="token-view">
              <div className="space-y-4 sm:space-y-6 mt-4">
                {/* Aggregated Holdings Table */}
                <HoldingsTable limit={10} walletAddresses={walletAddresses} />
                {/* Aggregated Activity Feed */}
                <ActivityFeed limit={10} walletAddresses={walletAddresses} />
              </div>
            </TabsContent>
            <TabsContent value="protocol-view">
              <div className="mt-4">
                <ProtocolViewTable protocols={DUMMY_PROTOCOLS} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Manage Portfolios</h2>
          <MultifolioGrid portfolios={portfolios} onPortfolioDeleted={fetchPortfolios} />
        </div>
      </div>
    </main>
  )
}

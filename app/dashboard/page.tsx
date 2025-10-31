"use client"

import { PortfolioOverview } from "@/components/portfolio-overview"
import { HoldingsTable } from "@/components/holdings-table"
import { HistoricalChart } from "@/components/historical-chart"
import { ActivityFeed } from "@/components/activity-feed"
import { AIInsights } from "@/components/ai-insights"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtocolViewTable } from "@/components/protocol-view-table"
import { DUMMY_PROTOCOLS } from "@/lib/dummy-protocols"
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export default function DashboardPage() {
  const { data: session } = useSession()
  const connectedAddress = (session as any)?.publicKey
  const [pnlSummary, setPnlSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connectedAddress) {
      setLoading(true);
      fetch(`/api/pnl/${connectedAddress}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch P&L data");
          return res.json();
        })
        .then(data => {
          setPnlSummary(data.data.attributes);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [connectedAddress]);

  const displayAddress = connectedAddress || "9B5X4bsuM373NUZAUBbGkCBDm2KwBL5zTg6G5V8UqJ7k"

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {connectedAddress ? "Your connected wallet portfolio" : "Default portfolio view"}
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Portfolio Overview */}
          {displayAddress && <PortfolioOverview walletAddress={displayAddress} pnlSummary={pnlSummary} />}

          {/* Charts and Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <HistoricalChart walletAddresses={[displayAddress]} />
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
                {/* Holdings Table */}
                <HoldingsTable limit={5} />

                {/* Activity Feed */}
                <ActivityFeed limit={5} />
              </div>
            </TabsContent>
            <TabsContent value="protocol-view">
              <div className="mt-4">
                <ProtocolViewTable protocols={DUMMY_PROTOCOLS} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

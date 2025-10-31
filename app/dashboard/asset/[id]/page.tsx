
import { use } from 'react';
import { HistoricalChart } from "@/components/historical-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ALL_ASSETS } from "@/lib/dummy-assets";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

// The props are a promise here, so we type it accordingly for clarity
type AssetDetailPageProps = {
  params: Promise<{ id: string }>;
}

export default function AssetDetailPage({ params }: AssetDetailPageProps) {
  // We must use the `use` hook to unwrap the promise for params
  const resolvedParams = use(params);
  const asset = ALL_ASSETS.find(a => a.id === parseInt(resolvedParams.id));

  if (!asset) {
    return <div>Asset not found</div>;
  }

  // Placeholder wallet address for demonstration
  const placeholderWalletAddress = "0x123abc..."; // Replace with a real test address if available

  const isPositive = asset.change24h >= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{asset.name} ({asset.symbol})</h1>
          <p className="text-lg text-muted-foreground">Detailed view of your {asset.name} holdings.</p>
        </div>
        <div className="text-right">
          <p className="text-3xl sm:text-4xl font-bold text-foreground">${asset.price.toFixed(asset.price > 1 ? 2 : 6)}</p>
          <div className={`flex items-center justify-end gap-1 text-lg ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            <span>{Math.abs(asset.change24h).toFixed(2)}% (24h)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Pass the placeholder wallet address as an array */}
          <HistoricalChart walletAddresses={[placeholderWalletAddress]} />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Holdings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-2xl font-semibold text-foreground">{asset.balance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-2xl font-semibold text-foreground">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Market Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {asset.marketCap && (
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-lg font-semibold text-foreground">${asset.marketCap.toLocaleString()}</p>
                </div>
              )}
              {asset.volume24h && (
                <div>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-lg font-semibold text-foreground">${asset.volume24h.toLocaleString()}</p>
                </div>
              )}
              {asset.circulatingSupply && (
                <div>
                  <p className="text-sm text-muted-foreground">Circulating Supply</p>
                  <p className="text-lg font-semibold text-foreground">{asset.circulatingSupply.toLocaleString()} {asset.symbol}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

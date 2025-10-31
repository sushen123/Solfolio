"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  dummyAssetPnl,
  PnlTimeframes,
  AssetPnl,
} from "@/lib/dummy-pnl-data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import PnlChart from "@/components/pnl-chart";

type Timeframe = "daily" | "weekly" | "monthly" | "all_time";

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


export default function PnlPage() {
  const [chartTimeframe, setChartTimeframe] = useState<Timeframe>("all_time");
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("all_time");

  const chains = useMemo(() => {
    const allChains = dummyAssetPnl.map((a) => a.chain.name);
    return ["All Chains", ...Array.from(new Set(allChains))];
  }, []);

  const filteredAssets = useMemo(() => {
    if (!selectedChain || selectedChain === "All Chains") {
      return dummyAssetPnl;
    }
    return dummyAssetPnl.filter((asset) => asset.chain.name === selectedChain);
  }, [selectedChain]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profit & Loss Analysis</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Portfolio Performance</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant={chartTimeframe === "daily" ? "default" : "outline"} onClick={() => setChartTimeframe("daily")}>24h</Button>
            <Button variant={chartTimeframe === "weekly" ? "default" : "outline"} onClick={() => setChartTimeframe("weekly")}>7d</Button>
            <Button variant={chartTimeframe === "monthly" ? "default" : "outline"} onClick={() => setChartTimeframe("monthly")}>30d</Button>
            <Button variant={chartTimeframe === "all_time" ? "default" : "outline"} onClick={() => setChartTimeframe("all_time")}>All-Time</Button>
          </div>
        </CardHeader>
        <CardContent>
          <PnlChart timeframe={chartTimeframe} />
        </CardContent>
      </Card>

      

      <Card>
        <CardHeader>
          <CardTitle>PnL by Asset</CardTitle>
          <div className="flex items-center gap-2 pt-4">
            <span className="text-sm font-medium">Filter by Chain:</span>
            {chains.map(chain => (
              <Button
                key={chain}
                variant={selectedChain === chain || (chain === "All Chains" && !selectedChain) ? "default" : "outline"}
                onClick={() => setSelectedChain(chain === "All Chains" ? null : chain)}
              >
                {chain}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-4">
            <span className="text-sm font-medium">Filter by Timeframe:</span>
            <Button variant={timeframe === "daily" ? "default" : "outline"} onClick={() => setTimeframe("daily")}>24h</Button>
            <Button variant={timeframe === "weekly" ? "default" : "outline"} onClick={() => setTimeframe("weekly")}>7d</Button>
            <Button variant={timeframe === "monthly" ? "default" : "outline"} onClick={() => setTimeframe("monthly")}>30d</Button>
            <Button variant={timeframe === "all_time" ? "default" : "outline"} onClick={() => setTimeframe("all_time")}>All-Time</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Chain</TableHead>
                <TableHead className="text-right">Holdings</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">PnL ({timeframe.replace("_", "-")})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((assetPnl) => (
                <TableRow key={assetPnl.asset.symbol}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Image src={assetPnl.asset.image} alt={assetPnl.asset.name} width={32} height={32} />
                      <div>
                        <div>{assetPnl.asset.name}</div>
                        <div className="text-sm text-muted-foreground">{assetPnl.asset.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{assetPnl.chain.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{assetPnl.holdings.toLocaleString()} {assetPnl.asset.symbol}</TableCell>
                  <TableCell className="text-right">${assetPnl.current_price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <PnlValue
                      value={assetPnl.pnl[timeframe].value}
                      percentage={assetPnl.pnl[timeframe].percentage}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
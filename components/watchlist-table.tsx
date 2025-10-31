'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import Image from "next/image";
import { WatchlistTableRowSkeleton } from "./watchlist-table-row-skeleton";

interface WatchlistTableProps {
  watchlist: any[];
  onRemove: (id: string) => void;
  loading: boolean;
}

const AVAILABLE_LOGOS = ['arbitrum', 'base', 'ethereum', 'optimism', 'polygon', 'solana'];

const formatNumber = (num: number) => {
    if (num > 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num > 1_000_000) {
        return `${(num / 1_000_000).toFixed(2)}M`;
    } else if (num > 1_000) {
        return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toFixed(2);
}

export function WatchlistTable({ watchlist, onRemove, loading }: WatchlistTableProps) {

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Your Watchlist</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">Loading tokens...</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Token</TableHead>
                <TableHead className="text-right text-muted-foreground">Price</TableHead>
                <TableHead className="text-right text-muted-foreground">24h Change</TableHead>
                <TableHead className="text-right text-muted-foreground">24h High</TableHead>
                <TableHead className="text-right text-muted-foreground">24h Low</TableHead>
                <TableHead className="text-right text-muted-foreground">Market Cap</TableHead>
                <TableHead className="text-center text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => <WatchlistTableRowSkeleton key={i} />)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

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
    );
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
                <TableHead className="text-right text-muted-foreground">24h High</TableHead>
                <TableHead className="text-right text-muted-foreground">24h Low</TableHead>
                <TableHead className="text-right text-muted-foreground">Market Cap</TableHead>
                <TableHead className="text-center text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchlist.map((token) => {
                const marketData = token.attributes.market_data;
                const price = marketData?.price || 0;
                const change24h = marketData?.changes?.percent_1d || 0;
                const high24h = token.day_high || 0;
                const low24h = token.day_low || 0;
                const marketCap = marketData?.market_cap || 0;
                const isPositive = change24h >= 0;
                const chains = token.attributes.implementations?.map((impl: any) => impl.chain_id).filter((id: string) => AVAILABLE_LOGOS.includes(id)) || [];

                return (
                    <TableRow key={token.id} className="border-border hover:bg-muted/50">
                        <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                            <Image src={token.attributes.icon?.url || '/placeholder.svg'} alt={token.attributes.name} width={32} height={32} className="rounded-full" />
                            <div>
                                <div className="flex items-center gap-1">
                                    <p className="text-foreground">{token.attributes.name}</p>
                                    <div className="flex items-center">
                                        {chains.slice(0, 3).map((chain: string) => (
                                            <Image key={chain} src={`/logos/${chain}.svg`} alt={chain} width={12} height={12} className="-ml-1" />
                                        ))}
                                    </div>
                                </div>
                            <p className="text-xs text-muted-foreground">{token.attributes.symbol}</p>
                            </div>
                        </div>
                        </TableCell>
                        <TableCell className="text-right text-foreground">${price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                        <div
                            className={`flex items-center justify-end gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}
                        >
                            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            <span>{Math.abs(change24h).toFixed(2)}%</span>
                        </div>
                        </TableCell>
                        <TableCell className="text-right text-foreground">${high24h.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-foreground">${low24h.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-foreground">${formatNumber(marketCap)}</TableCell>
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
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

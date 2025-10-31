
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TotalValueCardProps {
  totalValue: number;
  walletAddress: string;
}

export function TotalValueCard({ totalValue, walletAddress }: TotalValueCardProps) {
  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-foreground">
            ${totalValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground">
            Wallet: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

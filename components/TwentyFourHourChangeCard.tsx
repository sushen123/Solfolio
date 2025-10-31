
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TwentyFourHourChangeCardProps {
  change24h: number;
  changePercent24h: number;
}

export function TwentyFourHourChangeCard({ change24h, changePercent24h }: TwentyFourHourChangeCardProps) {
  const isPositive = change24h >= 0

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">24h Change</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className={`text-3xl font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "+" : ""}
            {change24h.toLocaleString("en-US", { maximumFractionDigits: 2 })} USD
          </p>
          <p className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "+" : ""}
            {changePercent24h.toFixed(2)}%
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

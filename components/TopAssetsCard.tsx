
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface Asset {
    name: string;
    value: number;
    percentage: number;
}

interface TopAssetsCardProps {
    topAssets: Asset[];
}

const COLORS = [
  "#a78bfa", // Purple (chart-1)
  "#22d3ee", // Cyan (chart-2)
  "#10b981", // Green (chart-3)
  "#f59e0b", // Orange (chart-4)
  "#ec4899", // Pink (chart-5)
]

export function TopAssetsCard({ topAssets }: TopAssetsCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">Top 5 Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={topAssets}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {topAssets.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {topAssets.map((asset, index) => (
            <div key={asset.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-foreground font-medium">{asset.name}</span>
              </div>
              <span className="text-muted-foreground">{asset.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

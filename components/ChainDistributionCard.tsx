
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface ChainDistributionCardProps {
  distribution: { [key: string]: number };
}

const COLORS = [
  "#a78bfa", // Purple (chart-1)
  "#22d3ee", // Cyan (chart-2)
  "#10b981", // Green (chart-3)
  "#f59e0b", // Orange (chart-4)
  "#ec4899", // Pink (chart-5)
]

export function ChainDistributionCard({ distribution }: ChainDistributionCardProps) {
  const processData = () => {
    if (!distribution) return [];

    const sortedChains = Object.entries(distribution)
      .filter(([, value]) => value > 0)
      .sort(([, a], [, b]) => b - a);

    const top4 = sortedChains.slice(0, 4);
    const othersValue = sortedChains.slice(4).reduce((acc, [, value]) => acc + value, 0);

    const chartData = top4.map(([name, value]) => ({ name, value }));

    if (othersValue > 0) {
      chartData.push({ name: "Others", value: othersValue });
    }

    return chartData;
  };

  const chartData = processData();
  const totalValue = chartData.reduce((acc, { value }) => acc + value, 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">Chain Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {chartData.map((asset, index) => (
            <div key={asset.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-foreground font-medium">{asset.name}</span>
              </div>
              <span className="text-muted-foreground">{((asset.value / totalValue) * 100).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

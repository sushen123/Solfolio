"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const DUMMY_CHART_DATA = [
  { time: "00:00", value: 120000 },
  { time: "04:00", value: 122500 },
  { time: "08:00", value: 121800 },
  { time: "12:00", value: 123200 },
  { time: "16:00", value: 124100 },
  { time: "20:00", value: 125430 },
]

const TIME_RANGES = [
  { label: "24H", value: "24h" },
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "All-Time", value: "all" },
]

export function HistoricalChart() {
  const [selectedRange, setSelectedRange] = useState("24h")

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-2xl">Portfolio Value History</CardTitle>
        <div className="flex gap-2">
          {TIME_RANGES.map((range) => (
            <Button
              key={range.value}
              variant={selectedRange === range.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRange(range.value)}
              className="text-xs"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={DUMMY_CHART_DATA} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" opacity={0.3} />
            <XAxis dataKey="time" stroke="#888888" style={{ fontSize: "12px" }} />
            <YAxis
              stroke="#888888"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "2px solid #7c3aed",
                borderRadius: "12px",
                padding: "12px",
              }}
              labelStyle={{ color: "#ffffff" }}
              formatter={(value) => [`$${value.toLocaleString()}`, "Value"]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#a78bfa"
              strokeWidth={3}
              dot={{ fill: "#a78bfa", r: 5 }}
              activeDot={{ r: 7 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

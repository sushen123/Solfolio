"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSession } from "next-auth/react"

const TIME_RANGES = [
  { label: "24H", value: "24h" },
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "1Y", value: "1y" },
  { label: "Max", value: "max" },
]

// Helper function for formatting time (moved outside component)
const formatTime = (timestamp: number, range: string) => {
  const date = new Date(timestamp * 1000);
  switch (range) {
    case '24h':
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    case '7d':
      return date.toLocaleDateString([], { weekday: 'short' });
    case '30d':
    case '1y':
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    case 'max':
      return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
    default:
      return date.toLocaleDateString();
  }
};

export function HistoricalChart({ walletAddresses }: { walletAddresses: string[] }) {
  const { data: session } = useSession()
  const [selectedRange, setSelectedRange] = useState("1y")
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only fetch if there are wallet addresses
    if (walletAddresses && walletAddresses.length > 0) {
      setLoading(true)
      setError(null) // Clear previous errors

      const fetchAllChartData = async () => {
        try {
          const fetchPromises = walletAddresses.map(address =>
            fetch(`/api/charts/${address}/${selectedRange}`)
              .then(res => {
                if (!res.ok) {
                  // If one wallet fails, we still want to try others, but log the error
                  console.error(`Failed to fetch chart data for ${address}: ${res.status}`);
                  return null; // Return null to indicate failure for this specific wallet
                }
                return res.json();
              })
          );

          const results = await Promise.all(fetchPromises);

          // Aggregate data
          const aggregatedDataMap = new Map<number, number>(); // Map<timestamp, totalValue>

          results.forEach(data => {
            if (data && data.data && data.data.attributes && data.data.attributes.points) {
              data.data.attributes.points.forEach((point: [number, number]) => {
                const timestamp = point[0];
                const value = point[1];
                aggregatedDataMap.set(timestamp, (aggregatedDataMap.get(timestamp) || 0) + value);
              });
            }
          });

          // Convert map to sorted array for chart
          const sortedAggregatedData = Array.from(aggregatedDataMap.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([timestamp, value]) => ({
              time: formatTime(timestamp, selectedRange), // Use formatTime helper
              value: value,
            }));

          setChartData(sortedAggregatedData);
          setLoading(false);

        } catch (err: any) {
          setError(err.message);
          setLoading(false);
          console.error("Error fetching aggregated chart data:", err);
        }
      };

      fetchAllChartData();
    } else {
      // No wallet addresses, clear chart data and stop loading
      setChartData([]);
      setLoading(false);
    }
  }, [walletAddresses, selectedRange]); // Dependencies: walletAddresses and selectedRange

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
        {loading ? (
          <div className="h-[400px] w-full bg-muted/50 animate-pulse rounded-md"></div>
        ) : error ? (
          <div className="h-[400px] w-full flex items-center justify-center text-red-500">{error}</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" opacity={0.3} />
              <XAxis dataKey="time" stroke="#888888" style={{ fontSize: "12px" }} />
              <YAxis
                stroke="#888888"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "2px solid #7c3aed",
                  borderRadius: "12px",
                  padding: "12px",
                }}
                labelStyle={{ color: "#ffffff" }}
                formatter={(value) => [`${Number(value).toLocaleString()}`, "Value"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#a78bfa"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 7 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
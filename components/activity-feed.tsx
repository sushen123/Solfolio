"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Repeat2 } from "lucide-react"

const DUMMY_ACTIVITIES = [
  {
    id: 1,
    type: "swap",
    from: "SOL",
    to: "USDC",
    amount: 1.5,
    value: 213.75,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "send",
    token: "USDC",
    amount: 500,
    recipient: "9B5X4b...7kL2m",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    type: "receive",
    token: "ORCA",
    amount: 250,
    sender: "3xK9Lm...2pQ8r",
    timestamp: "1 day ago",
  },
  {
    id: 4,
    type: "swap",
    from: "USDC",
    to: "SOL",
    amount: 2000,
    value: 14035,
    timestamp: "2 days ago",
  },
  {
    id: 5,
    type: "receive",
    token: "COPE",
    amount: 50000,
    sender: "7mN2Pq...9sT4u",
    timestamp: "3 days ago",
  },
]

export function ActivityFeed() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {DUMMY_ACTIVITIES.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {activity.type === "swap" && <Repeat2 className="w-5 h-5 text-chart-1" />}
                  {activity.type === "send" && <ArrowUpRight className="w-5 h-5 text-red-500" />}
                  {activity.type === "receive" && <ArrowDownLeft className="w-5 h-5 text-green-500" />}
                </div>

                {/* Details */}
                <div>
                  {activity.type === "swap" && (
                    <p className="text-foreground font-medium">
                      Swap {activity.amount} {activity.from} for {activity.to}
                    </p>
                  )}
                  {activity.type === "send" && (
                    <p className="text-foreground font-medium">
                      Sent {activity.amount} {activity.token}
                    </p>
                  )}
                  {activity.type === "receive" && (
                    <p className="text-foreground font-medium">
                      Received {activity.amount} {activity.token}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>

              {/* Value */}
              {activity.type === "swap" && (
                <p className="text-foreground font-medium">
                  ${activity.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

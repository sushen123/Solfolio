"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

const DUMMY_INSIGHTS = {
  degenScore: 72,
  insights: [
    "Your portfolio is 35.8% concentrated in SOL",
    "Strong diversification across 5+ assets",
    "Recent activity shows active trading",
  ],
}

export function AIInsights() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Degen Score */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32">
            <CircularProgressbar
              value={DUMMY_INSIGHTS.degenScore}
              text={`${DUMMY_INSIGHTS.degenScore}`}
              styles={buildStyles({
                rotation: 0.25,
                strokeLinecap: "round",
                textSize: "24px",
                pathTransitionDuration: 0.5,
                pathColor: "var(--color-chart-1)",
                textColor: "var(--color-foreground)",
                trailColor: "var(--color-muted)",
              })}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Degen Score</p>
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Key Insights</h3>
          {DUMMY_INSIGHTS.insights.map((insight, index) => (
            <div key={index} className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-foreground">{insight}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

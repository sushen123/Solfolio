"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

// Define an interface for our data structure for better type safety
interface InsightsData {
  degenScore: number;
  insights: string[];
}

// The component now needs to know the user's wallet address.
// We'll pass it in as a prop.
export function AIInsights() {
  const router = useRouter();
  
  // State to hold the data fetched from our API
  const [data, setData] = useState<InsightsData | null>(null);
  // State to handle the loading UI while we fetch
  const [isLoading, setIsLoading] = useState(true);
  // State to handle any potential errors during the fetch
  const [error, setError] = useState<string | null>(null);

  //const {connectedaddress} = useDashboard()
  const walletAddress = "0x42b9df65b219b3dd36ff330a4dd8f327a6ada990" //change this in future for testing purposed

  // This effect runs when the component mounts or when the walletAddress changes
  useEffect(() => {
    // Only fetch if a wallet address is provided
    if (walletAddress) {
      const fetchInsights = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch("/api/ai/insights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: walletAddress }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch insights from the server.");
          }

          const result = await response.json();
          setData(result);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchInsights();
    } else {
      // If there's no wallet, we're not loading and there's no data
      setIsLoading(false);
      setData(null);
    }
  }, [walletAddress]); // The dependency array ensures this re-runs if the wallet changes

  // A helper function to render the content based on the current state
  const renderContent = () => {
    if (isLoading) {
      return <p className="text-sm text-muted-foreground text-center">Generating insights...</p>;
    }

    if (error) {
      return <p className="text-sm text-red-500 text-center">{error}</p>;
    }

    if (!data || !walletAddress) {
      return <p className="text-sm text-muted-foreground text-center">Connect your wallet to see AI insights.</p>;
    }

    // This is the successful state, using real data
    return (
      <div className="space-y-6">
        {/* Degen Score */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32">
            <CircularProgressbar
              value={data.degenScore}
              text={`${data.degenScore}`}
              styles={buildStyles({
                rotation: 0.25,
                strokeLinecap: "round",
                textSize: "24px",
                pathTransitionDuration: 0.5,
                pathColor: "hsl(var(--primary))", // Using theme variables for color
                textColor: "hsl(var(--foreground))",
                trailColor: "hsl(var(--muted))",
              })}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Degen Score</p>
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Key Insights</h3>
          {data.insights.map((insight, index) => (
            <div key={index} className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-foreground">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderContent()}
        <Button 
            onClick={() => router.push("/dashboard/ai-chat")} // Corrected path to be absolute
            disabled={!walletAddress} // Disable button if no wallet is connected
        >
          Chat with AI
        </Button>
      </CardContent>
    </Card>
  );
}
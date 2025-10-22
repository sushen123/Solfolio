"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, BarChart3, Zap, Wallet } from "lucide-react"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export default function LandingPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState("")

  const handleConnect = (address: string) => {
    if (address) {
      setConnectedAddress(address)
      setIsConnected(true)
    } else {
      setConnectedAddress("")
      setIsConnected(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">SolFolio</div>
          <div className="flex items-center gap-4">
            <WalletConnectButton
              onConnect={handleConnect}
              isConnected={isConnected}
              connectedAddress={connectedAddress}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
              Analyze Your Crypto Portfolio in Real-Time
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Get instant insights into your Solana wallet holdings, track portfolio performance, and make data-driven
              investment decisions with SolFolio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {isConnected ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    const mockWalletAddress = "9B5X4bsuM373NUZAUBbGkCBDm2KwBL5zTg6G5V8UqJ7k"
                    handleConnect(mockWalletAddress)
                  }}
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </Button>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    Explore Demo
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-y border-border py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">Everything you need to manage your crypto portfolio</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Real-Time Analytics</h3>
              <p className="text-muted-foreground">
                Track your portfolio value, holdings, and performance metrics updated in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Historical Charts</h3>
              <p className="text-muted-foreground">
                Visualize your portfolio growth over time with interactive charts and multiple timeframes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">AI Insights</h3>
              <p className="text-muted-foreground">
                Get intelligent portfolio analysis and recommendations powered by advanced algorithms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8 bg-card border border-border rounded-lg p-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Ready to analyze your portfolio?</h2>
            <p className="text-lg text-muted-foreground">
              Enter any Solana wallet address to get started with comprehensive portfolio analytics.
            </p>
          </div>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-foreground font-semibold mb-4 md:mb-0">SolFolio</div>
            <p className="text-muted-foreground text-sm">© 2025 SolFolio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

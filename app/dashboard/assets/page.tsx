"use client"

import { HoldingsTable } from "@/components/holdings-table"

export default function AssetsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Your Assets</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            A complete list of your crypto assets, memes, and NFTs.
          </p>
        </div>
        <HoldingsTable />
      </div>
    </main>
  )
}

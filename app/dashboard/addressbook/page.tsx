import { WhaleWatchDashboard } from "@/components/WhaleWatchDashboard"

export default function WhaleWatchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Whale Watch</h1>
        <p className="text-muted-foreground">Follow wallets and subscribe to their on-chain activity</p>
      </div>

      <WhaleWatchDashboard />
    </div>
  )
}

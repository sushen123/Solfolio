
"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { FollowedWallet } from "@/lib/dummy-whale-data"
import { Switch } from "@/components/ui/switch"
import { Bell, Copy, Check } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface FollowedWalletCardProps {
  wallet: FollowedWallet;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function FollowedWalletCard({ wallet, isSelected, onSelect }: FollowedWalletCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation() // prevent card selection
    navigator.clipboard.writeText(wallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (wallet.isLoading) {
    return (
      <Card className="p-3 border-2 border-border/50 bg-card">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-grow">
            <Skeleton className="h-5 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="mb-3">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-6 w-12" />
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={`p-3 border-2 transition-colors cursor-pointer ${isSelected ? 'border-purple-500 bg-purple-500/10' : 'border-border/50 bg-card hover:bg-muted/50'}`}
      onClick={() => onSelect(wallet.id)}
    >
      <div className="flex items-center gap-3 mb-3">
        <Image src={wallet.avatar} alt={wallet.label} width={40} height={40} className="rounded-full" />
        <div className="flex-grow">
          <h3 className="font-bold text-base text-foreground">{wallet.label}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm font-mono text-muted-foreground">{wallet.address}</p>
            <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm text-muted-foreground">Portfolio Value</p>
        <p className="text-xl font-bold text-foreground">${wallet.portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
      </div>

      {/* TODO: Implement Top Assets from portfolio data */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bell className="w-4 h-4" />
          <span className="text-sm">Notify Me</span>
        </div>
        <Switch defaultChecked={wallet.notify} />
      </div>
    </Card>
  )
}

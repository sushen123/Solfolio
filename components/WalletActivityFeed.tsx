
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FollowedWallet } from "@/lib/dummy-whale-data"
import { ArrowRight, Zap, Droplets, Send, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from 'date-fns';

interface WalletActivityFeedProps {
  wallet: FollowedWallet | null;
}

const TypeIcon = ({type}: {type: string}) => {
    switch (type) {
        case 'swap':
            return <Zap className="w-4 h-4 text-yellow-400" />
        case 'mint':
            return <Droplets className="w-4 h-4 text-blue-400" />
        case 'send':
            return <ArrowRight className="w-4 h-4 text-red-400" />
        case 'receive':
            return <ArrowLeft className="w-4 h-4 text-green-400" />
        default:
            return <ArrowRight className="w-4 h-4 text-muted-foreground" />
    }
}

const TransactionDescription = ({ tx }: { tx: any }) => {
  const type = tx.attributes.acts[0]?.type;
  const transfer = tx.attributes.transfers[0];

  if (!type || !transfer) return <p className="font-medium text-foreground text-sm">Unknown Transaction</p>;

  const quantity = transfer.quantity.float.toFixed(4);
  const symbol = transfer.fungible_info?.symbol || 'tokens';

  switch (type) {
    case 'receive':
      return <p className="font-medium text-foreground text-sm">Received {quantity} {symbol}</p>;
    case 'send':
      return <p className="font-medium text-foreground text-sm">Sent {quantity} {symbol}</p>;
    case 'swap':
      return <p className="font-medium text-foreground text-sm">Swapped tokens</p>; // More detail could be added here
    default:
      return <p className="font-medium text-foreground text-sm">{type.charAt(0).toUpperCase() + type.slice(1)}</p>;
  }
};

export function WalletActivityFeed({ wallet }: WalletActivityFeedProps) {
  if (!wallet || wallet.isLoading) {
    return (
      <Card className="h-full border-border/50 bg-card">
        <CardHeader>
          <CardTitle>
            {wallet ? `Activity Feed for ${wallet.label}` : 'Activity Feed'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="w-7 h-7 rounded-full" />
                <div className="flex-grow">
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-5 w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle>Activity Feed for {wallet.label}</CardTitle>
      </CardHeader>
      <CardContent className="h-[600px] overflow-y-auto">
        <div className="space-y-3">
          {wallet.transactions.map(tx => (
            <div key={tx.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center">
                    <TypeIcon type={tx.attributes.acts[0]?.type} />
                </div>
              <div className="flex-grow">
                <TransactionDescription tx={tx} />
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(tx.attributes.mined_at), { addSuffix: true })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">${(tx.attributes.transfers[0]?.value || 0).toLocaleString('en-US', {maximumFractionDigits: 2})}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Repeat2, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { useSession } from "next-auth/react"

const operationIcons: { [key: string]: JSX.Element } = {
  send: <ArrowUpRight className="w-5 h-5 text-red-500" />,
  receive: <ArrowDownLeft className="w-5 h-5 text-green-500" />,
  trade: <Repeat2 className="w-5 h-5 text-chart-1" />,
  approve: <ShieldCheck className="w-5 h-5 text-gray-500" />,
};

const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
}

const getActivityTitle = (tx: any) => {
    const { operation_type, transfers, application_metadata } = tx.attributes;

    switch (operation_type) {
        case 'trade':
            const sent = transfers?.find((t: any) => t.direction === 'out');
            const received = transfers?.find((t: any) => t.direction === 'in');
            if (!sent || !received) return "Trade";
            const sentAsset = sent.fungible_info?.symbol || sent.nft_info?.name || 'asset';
            const receivedAsset = received.fungible_info?.symbol || received.nft_info?.name || 'asset';
            return `Swap ${sent.quantity?.numeric || 'some'} ${sentAsset} for ${receivedAsset}`;
        case 'send':
            const sentTransfer = transfers?.[0];
            if (!sentTransfer) return "Send";
            const sentAssetInfo = sentTransfer.fungible_info?.symbol || sentTransfer.nft_info?.name || 'asset';
            return `Sent ${sentTransfer.quantity?.numeric || 'some'} ${sentAssetInfo}`;
        case 'receive':
            const receivedTransfer = transfers?.[0];
            if (!receivedTransfer) return "Receive";
            const receivedAssetInfo = receivedTransfer.fungible_info?.symbol || receivedTransfer.nft_info?.name || 'asset';
            return `Received ${receivedTransfer.quantity?.numeric || 'some'} ${receivedAssetInfo}`;
        case 'approve':
            return `Approved ${application_metadata?.name || 'DApp'} for spending`;
        default:
            return operation_type ? operation_type.charAt(0).toUpperCase() + operation_type.slice(1) : "Transaction";
    }
}

interface ActivityFeedProps {
  limit?: number;
  walletAddresses?: string[];
}

export function ActivityFeed({ limit, walletAddresses }: ActivityFeedProps) {
  const { data: session } = useSession();
  const connectedAddress = (session as any)?.publicKey
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const addresses = walletAddresses && walletAddresses.length > 0 ? walletAddresses : (connectedAddress ? [connectedAddress] : [])

    if (addresses.length > 0) {
      setLoading(true);
      setError(null);

      const fetchAllTransactions = async () => {
        try {
          const allTxs: any[] = [];
          for (const address of addresses) {
            const res = await fetch(`/api/transactions/${address}`);
            if (!res.ok) throw new Error(`Failed to fetch transactions for ${address}`);
            const data = await res.json();
            const txsWithAddress = data.data.map((tx: any) => ({ ...tx, walletAddress: address }));
            allTxs.push(...txsWithAddress);
          }
          
          // Sort transactions by date, newest first
          allTxs.sort((a, b) => new Date(b.attributes.mined_at).getTime() - new Date(a.attributes.mined_at).getTime());
          
          setTransactions(allTxs);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchAllTransactions();
    } else {
      setLoading(false);
      setTransactions([]);
    }
  }, [connectedAddress, walletAddresses]);

  const allData = transactions;
  const displayData = limit ? allData.slice(0, limit) : allData;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>{walletAddresses ? 'Aggregated Transactions' : 'Recent Transactions'}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 w-full bg-muted/50 animate-pulse rounded-md"></div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <div className="space-y-4">
            {displayData.length === 0 ? (
              <div className="text-muted-foreground text-center py-4">No recent transactions found.</div>
            ) : (
              displayData.map((tx, index) => (
                <div
                  key={`${tx.walletAddress}-${tx.id}-${index}`}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3 w-full">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {tx.attributes.application_metadata?.icon?.url ? (
                        <Image src={tx.attributes.application_metadata.icon.url} alt={tx.attributes.application_metadata.name} width={24} height={24} />
                      ) : (
                        operationIcons[tx.attributes.operation_type] || operationIcons.send // Fallback icon
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <p className="text-foreground font-medium truncate">
                          {getActivityTitle(tx)}
                        </p>
                        {tx.attributes.transfers?.[0]?.value != null && (
                          <p className="text-foreground font-medium text-right flex-shrink-0">
                              ${tx.attributes.transfers[0].value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {formatTimestamp(tx.attributes.mined_at)}
                        {tx.attributes.application_metadata?.name && ` via ${tx.attributes.application_metadata.name}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
      {limit && allData.length > limit && (
        <CardFooter className="flex justify-center">
          <Link href="/dashboard/transactions">
            <Button variant="outline">See All</Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}

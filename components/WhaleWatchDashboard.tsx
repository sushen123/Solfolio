"use client"

import { useState, useEffect } from "react"
// import { FollowedWallet } from "@/lib/dummy-whale-data" // Removed
import { FollowedWalletCard } from "./FollowedWalletCard"
import { WalletActivityFeed } from "./WalletActivityFeed"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

// Define the base FollowedWallet type from the API/Prisma
interface FollowedWallet {
  id: string;
  label: string;
  address: string;
  createdAt: string;
  userId: string;
}

// Extend for client-side specific fields
interface ClientFollowedWallet extends FollowedWallet {
  avatar: string; // Assuming a default avatar for now
  portfolioValue: number;
  topAssets: any[]; // Adjust type as needed
  transactions: any[]; // Adjust type as needed
  notify: boolean;
  isLoading: boolean;
}

export function WhaleWatchDashboard() {
  const [whales, setWhales] = useState<ClientFollowedWallet[]>([])
  const [selectedWhaleId, setSelectedWhaleId] = useState<string | null>(null)
  const [newLabel, setNewLabel] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog

  // Effect to fetch initial followed wallets
  useEffect(() => {
    const fetchInitialWhales = async () => {
      try {
        const res = await fetch('/api/followed-wallets');
        if (!res.ok) {
          throw new Error('Failed to fetch followed wallets');
        }
        const data: FollowedWallet[] = await res.json();
        // Map fetched data to ClientFollowedWallet type
        const clientWhales: ClientFollowedWallet[] = data.map(w => ({
          ...w,
          avatar: '/placeholder-user.jpg', // Default avatar
          portfolioValue: 0,
          topAssets: [],
          transactions: [],
          notify: false,
          isLoading: true, // Set to true initially to trigger data fetching for each wallet
        }));
        setWhales(clientWhales);
        if (clientWhales.length > 0) {
          setSelectedWhaleId(clientWhales[0].id);
        }
      } catch (error) {
        console.error("Error fetching initial followed wallets:", error);
      }
    };

    fetchInitialWhales();
  }, []); // Run once on mount

  // Effect to fetch detailed wallet data (portfolio, transactions)
  useEffect(() => {
    const fetchWalletData = async (wallet: ClientFollowedWallet) => {
      try {
        const [portfolioRes, transactionsRes] = await Promise.all([
          fetch(`/api/portfolio/${wallet.address}`),
          fetch(`/api/transactions/${wallet.address}`),
        ]);

        if (!portfolioRes.ok || !transactionsRes.ok) {
          throw new Error("Failed to fetch wallet data");
        }

        const portfolioData = await portfolioRes.json();
        const transactionsData = await transactionsRes.json();

        setWhales((prev) =>
          prev.map((w) =>
            w.id === wallet.id
              ? {
                  ...w,
                  portfolioValue: portfolioData.data.attributes.total.positions,
                  topAssets: [], // TODO: Extract top assets from portfolio data
                  transactions: transactionsData.data,
                  isLoading: false,
                }
              : w
          )
        );
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        setWhales((prev) => prev.map((w) => (w.id === wallet.id ? { ...w, isLoading: false } : w)))
      }
    };

    whales.forEach((w) => {
      if (w.isLoading) {
        fetchWalletData(w);
      }
    });
  }, [whales]);

  const selectedWhale = whales.find(w => w.id === selectedWhaleId) || null

  const handleFollowWallet = async () => { // Made async
    if (newLabel && newAddress) {
      try {
        const res = await fetch('/api/followed-wallets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ label: newLabel, address: newAddress }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to follow wallet');
        }

        const newFollowedWallet: FollowedWallet = await res.json();
        const clientNewWhale: ClientFollowedWallet = {
          ...newFollowedWallet,
          avatar: '/placeholder-user.jpg',
          portfolioValue: 0,
          topAssets: [],
          transactions: [],
          notify: false,
          isLoading: true,
        };

        setWhales((prev) => [clientNewWhale, ...prev]);
        setSelectedWhaleId(clientNewWhale.id);
        setNewLabel("");
        setNewAddress("");
        setIsDialogOpen(false); // Close dialog on success
      } catch (error) {
        console.error("Error following wallet:", error);
        alert(error.message); // Provide user feedback
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Followed Wallets */}
      <div className="lg:col-span-1 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Followed Wallets</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}> {/* Control dialog state */}
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Follow Wallet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Follow a New Wallet</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="label" className="text-right">
                    Label
                  </Label>
                  <Input
                    id="label"
                    placeholder="e.g., DeFi King"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter wallet address"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                {/* Removed DialogClose from Button to handle closing manually after API call */}
                <Button onClick={handleFollowWallet} type="submit">Follow</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4">
          {whales.map(wallet => (
            <FollowedWalletCard
              key={wallet.id}
              wallet={wallet}
              isSelected={selectedWhaleId === wallet.id}
              onSelect={setSelectedWhaleId}
            />
          ))}
        </div>
      </div>

      {/* Right Column: Activity Feed */}
      <div className="lg:col-span-2">
        <WalletActivityFeed wallet={selectedWhale} />
      </div>
    </div>
  )
}
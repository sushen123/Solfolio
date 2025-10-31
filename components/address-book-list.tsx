"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Copy, Check } from "lucide-react"
import { useSession } from "next-auth/react"

interface SavedAddress {
  id: string
  label: string
  address: string
  chain: string
  createdAt: string
}

export function AddressBookList() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [newLabel, setNewLabel] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null);

  const fetchAddressBook = async () => {
    if (!session) return;
    try {
      const res = await fetch('/api/addressbook');
      if (!res.ok) throw new Error('Failed to fetch address book');
      const data = await res.json();
      setAddresses(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAddressBook();
  }, [session]);

  const handleAddAddress = async () => {
    if (newLabel && newAddress) {
      try {
        console.log("Adding address:", { label: newLabel, address: newAddress });
        const res = await fetch('/api/addressbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ label: newLabel, address: newAddress }),
        });
        console.log("Add address response:", res);
        if (!res.ok) {
          const errorBody = await res.json();
          throw new Error(errorBody.error || 'Failed to add address');
        }
        fetchAddressBook(); // Refetch
        setNewLabel("")
        setNewAddress("")
      } catch (err: any) {
        console.error("Error adding address:", err);
        setError(err.message);
      }
    }
  }

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch(`/api/addressbook/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove address');
      fetchAddressBook(); // Refetch
    } catch (err: any) {
      setError(err.message);
    }
  }

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-8">
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}
      {/* Add New Address Section */}
      <Card className="p-8 bg-gradient-to-br from-background to-background/50 border-border/50">
        <h2 className="text-2xl font-bold text-foreground mb-6">Add New Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Label</label>
            <Input
              placeholder="e.g., Main Wallet"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Wallet Address</label>
            <Input
              placeholder="Enter wallet address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>
        </div>
        <Button onClick={handleAddAddress} className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </Card>

      {/* Saved Addresses Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Saved Addresses</h2>
        {addresses.length === 0 ? (
          <Card className="p-12 text-center border-border/50">
            <p className="text-muted-foreground text-lg">No saved addresses yet</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <Card
                key={addr.id}
                className="p-6 bg-gradient-to-br from-background to-background/50 border-border/50 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{addr.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{addr.chain}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(addr.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-background/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Address</p>
                  <p className="text-sm font-mono text-foreground break-all">{addr.address}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>Added {new Date(addr.createdAt).toLocaleDateString()}</span>
                </div>

                <button
                  onClick={() => handleCopy(addr.address, addr.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 rounded-lg transition-colors"
                >
                  {copiedId === addr.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Address
                    </>
                  )}
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

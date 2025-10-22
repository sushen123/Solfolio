"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Copy, Check } from "lucide-react"

interface SavedAddress {
  id: string
  label: string
  address: string
  chain: string
  addedDate: string
}

export function AddressBookList() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "1",
      label: "Main Wallet",
      address: "PUSSTX5eXd...L93iv7",
      chain: "Solana",
      addedDate: "2024-01-15",
    },
    {
      id: "2",
      label: "Trading Account",
      address: "9B85wQnD2k...K2mP9x",
      chain: "Solana",
      addedDate: "2024-01-10",
    },
    {
      id: "3",
      label: "Cold Storage",
      address: "FvwEAJhqJ8...R7nQ4m",
      chain: "Solana",
      addedDate: "2024-01-05",
    },
  ])

  const [newLabel, setNewLabel] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleAddAddress = () => {
    if (newLabel && newAddress) {
      const newEntry: SavedAddress = {
        id: Date.now().toString(),
        label: newLabel,
        address: newAddress,
        chain: "Solana",
        addedDate: new Date().toISOString().split("T")[0],
      }
      setAddresses([...addresses, newEntry])
      setNewLabel("")
      setNewAddress("")
    }
  }

  const handleRemove = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-8">
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
                  <span>Added {addr.addedDate}</span>
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

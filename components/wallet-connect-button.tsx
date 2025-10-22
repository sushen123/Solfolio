"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface WalletConnectButtonProps {
  onConnect: (address: string) => void
  isConnected: boolean
  connectedAddress?: string
}

export function WalletConnectButton({ onConnect, isConnected, connectedAddress }: WalletConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const mockWalletAddress = "9B5X4bsuM373NUZAUBbGkCBDm2KwBL5zTg6G5V8UqJ7k"
      await new Promise((resolve) => setTimeout(resolve, 500))
      onConnect(mockWalletAddress)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    onConnect("")
    router.push("/")
  }

  if (isConnected && connectedAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none">
            <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${connectedAddress}`} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {connectedAddress.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-xs text-muted-foreground">Connected Wallet</p>
            <p className="text-sm font-medium text-foreground break-all font-mono">{connectedAddress}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect} className="text-red-500 cursor-pointer gap-2">
            <LogOut className="w-4 h-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading} className="gap-2" size="sm">
      <Wallet className="w-4 h-4" />
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}

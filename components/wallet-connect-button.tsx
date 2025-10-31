"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import bs58 from "bs58"
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
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react"
import { SigninMessage } from "./../utils/SignInMessage"

export function WalletConnectButton() {
  const router = useRouter()
  const { publicKey, disconnect, signMessage, connected, connecting, disconnecting } = useWallet()
  const { setVisible } = useWalletModal()
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  const handleSignIn = async () => {
    try {
      if (!connected) {
        setVisible(true)
        return;
      }

      const csrf = await getCsrfToken()
      if (!publicKey || !csrf || !signMessage) return

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: publicKey.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      });

      const data = new TextEncoder().encode(message.prepare())
      const signature = await signMessage(data)
      const serializedSignature = bs58.encode(signature)

      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      })
    } catch (error) {
      console.error("Authentication failed:", error)
      alert(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  useEffect(() => {
    if (connected && status === "unauthenticated" && !isLoading) {
      handleSignIn()
    }
  }, [connected, status, isLoading])

  const handleSignOut = async () => {
    await disconnect()
    signOut({ redirect: true, callbackUrl: "/" })
  }

  if (status === "authenticated" && session.publicKey) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none">
            <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={session.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.publicKey}`} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {session.publicKey.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-xs text-muted-foreground">Connected Wallet</p>
            <p className="text-sm font-medium text-foreground break-all font-mono">{session.publicKey}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer gap-2">
            <LogOut className="w-4 h-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={handleSignIn} disabled={isLoading || connecting || disconnecting} className="gap-2" size="sm">
      <Wallet className="w-4 h-4" />
      {connecting ? "Connecting..." : isLoading ? "Verifying..." : "Connect Wallet"}
    </Button>
  )
}

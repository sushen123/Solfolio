"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Menu, X } from "lucide-react"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState("9B5X4bsuM373NUZAUBbGkCBDm2KwBL5zTg6G5V8UqJ7k")

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-card border border-border"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar - hidden on mobile, visible on md and up */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content area */}
      <div className="flex-1 w-full flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card px-6 py-4 flex justify-end items-center">
          <WalletConnectButton onConnect={setConnectedAddress} isConnected={true} connectedAddress={connectedAddress} />
        </header>

        <main className="flex-1 w-full overflow-auto">{children}</main>
      </div>
    </div>
  )
}

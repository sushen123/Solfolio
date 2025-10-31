import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import NextAuthSessionProvider from "@/components/session-provider"
import { SolanaProvider } from "@/components/solana-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider" // Adjust import path if needed


const _inter = Inter({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SolFolio - Crypto Portfolio Analyzer",
  description: "Analyze your Solana crypto portfolio in real-time",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      
      <body className={`font-sans antialiased h-screen`}>
      <ThemeProvider
          attribute="class"
          defaultTheme="light" // <-- Set your preferred default theme
          enableSystem
          disableTransitionOnChange
        >
        <TooltipProvider>
          <SolanaProvider>
            <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
          </SolanaProvider>
        </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

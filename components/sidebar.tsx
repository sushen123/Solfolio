
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookmarkIcon, Users, Layers, Search, TrendingUp, History, Zap, Bot } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Assets",
      href: "/dashboard/assets",
      icon: Layers,
    },
    {
      name: "Search",
      href: "/dashboard/search",
      icon: Search,
    },
    {
      name: "AI Chat",
      href: "/dashboard/ai-chat",
      icon: Bot,
    },
    {
      name: "Watchlist",
      href: "/dashboard/watchlist",
      icon: BookmarkIcon,
    },
    {
      name: "Address Book",
      href: "/dashboard/addressbook",
      icon: Users,
    },
    {
      name: "Multifolio",
      href: "/dashboard/multifolio",
      icon: Layers,
    },
    {
      name: "NFT Gallery",
      href: "/dashboard/nft-gallery",
      icon: Layers,
    },
    
    {
      name: "Transactions",
      href: "/dashboard/transactions",
      icon: History,
    },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4 sm:p-6 overflow-y-auto">
      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">SolFolio</h2>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                isActive ? "bg-purple-600 text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export interface ProtocolAsset {
  id: string
  name: string
  symbol: string
  value: number
  apy?: number
  floorPrice?: number
}

export interface Protocol {
  id: string
  name: string
  logo: string
  assets: ProtocolAsset[]
  value: number
}

export const DUMMY_PROTOCOLS: Protocol[] = [
  {
    id: "marinade-finance",
    name: "Marinade Finance",
    logo: "/placeholder-logo.svg",
    assets: [
      {
        id: "msol",
        name: "Marinade Staked SOL",
        symbol: "mSOL",
        value: 500,
        apy: 7.5,
      },
    ],
    value: 500,
  },
  {
    id: "magic-eden",
    name: "Magic Eden",
    logo: "/placeholder-logo.svg",
    assets: [
      {
        id: "degods",
        name: "DeGods",
        symbol: "DEGODS",
        value: 1200,
        floorPrice: 100,
      },
    ],
    value: 1200,
  },
  {
    id: "kamino-lend",
    name: "Kamino Lend",
    logo: "/placeholder-logo.svg",
    assets: [
      { id: "usdc", name: "USD Coin", symbol: "USDC", value: 300, apy: 5.2 },
    ],
    value: 300,
  },
]

export interface PnlData {
  value: number;
  percentage: number;
}

export interface PnlTimeframes {
  daily: PnlData;
  weekly: PnlData;
  monthly: PnlData;
  all_time: PnlData;
}

export interface PnlSummary {
  realized_pnl: PnlData;
  unrealized_pnl: PnlData;
  net_invested: number;
}

export interface AssetPnl {
  asset: {
    name: string;
    symbol: string;
    image: string;
  };
  chain: {
    name: string;
    logo: string;
  };
  pnl: PnlTimeframes;
  current_price: number;
  holdings: number;
}

export const dummyPnlSummary: PnlSummary = {
  realized_pnl: { value: 5430.1, percentage: 15.2 },
  unrealized_pnl: { value: 9700.79, percentage: 28.9 },
  net_invested: 35780.25,
};

export const dummyOverallPnl: PnlTimeframes = {
  all_time: { value: 15230.89, percentage: 35.6 },
  daily: { value: 250.45, percentage: 1.2 },
  weekly: { value: -120.1, percentage: -0.5 },
  monthly: { value: 1250.78, percentage: 5.8 },
};

export const dummyAssetPnl: AssetPnl[] = [
  {
    asset: {
      name: "Solana",
      symbol: "SOL",
      image: "/placeholder.svg",
    },
    chain: {
      name: "Solana",
      logo: "/solana-logo.svg", // Assuming you have a logo
    },
    pnl: {
      all_time: { value: 8900.45, percentage: 45.2 },
      daily: { value: 150.2, percentage: 2.5 },
      weekly: { value: -50.5, percentage: -0.8 },
      monthly: { value: 800.0, percentage: 15.1 },
    },
    current_price: 172.5,
    holdings: 150.5,
  },
  {
    asset: {
      name: "Bonk",
      symbol: "BONK",
      image: "/placeholder.svg",
    },
    chain: {
      name: "Solana",
      logo: "/solana-logo.svg",
    },
    pnl: {
      all_time: { value: 2500.12, percentage: 150.5 },
      daily: { value: 80.5, percentage: 5.1 },
      weekly: { value: 20.0, percentage: 1.2 },
      monthly: { value: 300.5, percentage: 25.3 },
    },
    current_price: 0.000028,
    holdings: 500000000,
  },
  {
    asset: {
      name: "Jupiter",
      symbol: "JUP",
      image: "/placeholder.svg",
    },
    chain: {
      name: "Solana",
      logo: "/solana-logo.svg",
    },
    pnl: {
      all_time: { value: 3830.32, percentage: 22.1 },
      daily: { value: 19.75, percentage: 0.5 },
      weekly: { value: -90.6, percentage: -2.3 },
      monthly: { value: 150.28, percentage: 4.2 },
    },
    current_price: 1.15,
    holdings: 10000,
  },
  {
    asset: {
      name: "Wrapped Ether",
      symbol: "WETH",
      image: "/placeholder.svg",
    },
    chain: {
      name: "Ethereum",
      logo: "/ethereum-logo.svg",
    },
    pnl: {
      all_time: { value: 4500.0, percentage: 30.0 },
      daily: { value: 120.0, percentage: 1.5 },
      weekly: { value: -200.0, percentage: -2.5 },
      monthly: { value: 1000.0, percentage: 12.5 },
    },
    current_price: 3800.0,
    holdings: 5,
  },
];
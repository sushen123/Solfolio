
export interface WhaleAsset {
  name: string;
  symbol: string;
  logo: string;
  value: number;
}

export interface WhaleTransaction {
  id: string;
  type: string;
  description: string;
  time: string;
  value: number;
}

export interface FollowedWallet {
  id: string;
  label: string;
  address: string;
  avatar: string;
  portfolioValue: number;
  topAssets: WhaleAsset[];
  transactions: any[];
  notify: boolean;
  isLoading: boolean;
}

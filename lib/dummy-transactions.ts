
export type Transaction = {
  id: string;
  attributes: {
    operation_type: 'trade' | 'send' | 'receive' | 'approve';
    mined_at: string;
    status: 'confirmed' | 'failed' | 'pending';
    hash: string;
    fee: {
      value: number;
    };
    transfers: {
      fungible_info?: {
        name: string;
        symbol: string;
        icon?: { url: string };
      };
      nft_info?: {
        name: string;
        content?: {
          preview?: { url: string };
        };
      };
      direction: 'in' | 'out';
      quantity: {
        numeric: string;
      };
      value: number;
      sender: string;
      recipient: string;
    }[];
    application_metadata?: {
      name: string;
      icon?: { url: string };
    };
  };
  relationships: {
    chain: {
      data: {
        id: string;
      }
    }
  }
};

export const dummyTransactions: Transaction[] = [
  {
    id: 'tx1',
    attributes: {
      operation_type: 'trade',
      mined_at: '2023-10-26T10:00:00Z',
      status: 'confirmed',
      hash: '0x123...',
      fee: { value: 1.52 },
      transfers: [
        {
          fungible_info: { name: 'Solana', symbol: 'SOL', icon: { url: '/placeholder.svg' } },
          direction: 'out',
          quantity: { numeric: '1.5' },
          value: 258.75,
          sender: 'my_wallet',
          recipient: 'dex_contract',
        },
        {
          fungible_info: { name: 'Jupiter', symbol: 'JUP', icon: { url: '/placeholder.svg' } },
          direction: 'in',
          quantity: { numeric: '225.0' },
          value: 258.75,
          sender: 'dex_contract',
          recipient: 'my_wallet',
        },
      ],
      application_metadata: {
        name: 'Jupiter Aggregator',
        icon: { url: '/placeholder.svg' },
      },
    },
    relationships: { chain: { data: { id: 'solana' } } }
  },
  {
    id: 'tx2',
    attributes: {
      operation_type: 'send',
      mined_at: '2023-10-25T18:30:00Z',
      status: 'confirmed',
      hash: '0x456...',
      fee: { value: 0.01 },
      transfers: [
        {
          fungible_info: { name: 'Bonk', symbol: 'BONK', icon: { url: '/placeholder.svg' } },
          direction: 'out',
          quantity: { numeric: '1000000' },
          value: 28.0,
          sender: 'my_wallet',
          recipient: '0xabc...',
        },
      ],
    },
    relationships: { chain: { data: { id: 'solana' } } }
  },
  {
    id: 'tx3',
    attributes: {
      operation_type: 'receive',
      mined_at: '2023-10-24T12:00:00Z',
      status: 'confirmed',
      hash: '0x789...',
      fee: { value: 0.0 },
      transfers: [
        {
          nft_info: { name: 'Mad Lad #1234', content: { preview: { url: '/placeholder.svg' } } },
          direction: 'in',
          quantity: { numeric: '1' },
          value: 5000.0,
          sender: '0xdef...',
          recipient: 'my_wallet',
        },
      ],
    },
    relationships: { chain: { data: { id: 'solana' } } }
  },
  {
    id: 'tx4',
    attributes: {
      operation_type: 'approve',
      mined_at: '2023-10-23T09:00:00Z',
      status: 'confirmed',
      hash: '0xabc...',
      fee: { value: 0.25 },
      transfers: [],
      application_metadata: {
        name: 'Raydium',
        icon: { url: '/placeholder.svg' },
      },
    },
    relationships: { chain: { data: { id: 'solana' } } }
  },
];

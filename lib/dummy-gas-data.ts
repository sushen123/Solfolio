
// This data is structured to match the gas/prices API response.
// When you integrate the real API, you can replace this with the actual data.

export const DUMMY_GAS_PRICES = [
  {
    id: "1",
    type: "gas_price",
    attributes: {
      updated_at: new Date().toISOString(),
      gas_type: "eip1559",
      info: {
        base_fee: 25.5,
        standard: {
          priority_fee: 1.5,
          max_fee: 52.5,
          estimation_seconds: 45,
        },
        fast: {
          priority_fee: 2.5,
          max_fee: 55.0,
          estimation_seconds: 15,
        },
        rapid: {
            priority_fee: 3.5,
            max_fee: 58.0,
            estimation_seconds: 5,
        },
        slow: {
            priority_fee: 1.0,
            max_fee: 50.0,
            estimation_seconds: 120,
        }
      },
    },
    relationships: {
      chain: {
        data: {
          id: "ethereum",
          type: "chain",
        },
      },
    },
  },
  {
    id: "2",
    type: "gas_price",
    attributes: {
      updated_at: new Date().toISOString(),
      gas_type: "classic",
      info: {
        slow: 0.00001,
        standard: 0.00002,
        fast: 0.00003,
        rapid: 0.00005,
      },
    },
    relationships: {
      chain: {
        data: {
          id: "solana",
          type: "chain",
        },
      },
    },
  },
  {
    id: "3",
    type: "gas_price",
    attributes: {
      updated_at: new Date().toISOString(),
      gas_type: "eip1559",
      info: {
        base_fee: 15.2,
        standard: {
          priority_fee: 0.5,
          max_fee: 31.0,
          estimation_seconds: 30,
        },
        fast: {
            priority_fee: 1.0,
            max_fee: 32.0,
            estimation_seconds: 10,
        },
        rapid: {
            priority_fee: 1.5,
            max_fee: 33.0,
            estimation_seconds: 3,
        },
        slow: {
            priority_fee: 0.2,
            max_fee: 30.0,
            estimation_seconds: 90,
        }
      },
    },
    relationships: {
      chain: {
        data: {
          id: "polygon",
          type: "chain",
        },
      },
    },
  },
  {
    id: "4",
    type: "gas_price",
    attributes: {
      updated_at: new Date().toISOString(),
      gas_type: "optimistic",
      info: {
        l1: 0.000123,
        l2: 0.000045,
        fixed_overhead: 2100,
        dynamic_overhead: 1.0,
      },
    },
    relationships: {
      chain: {
        data: {
          id: "optimism",
          type: "chain",
        },
      },
    },
  },
  {
    id: "5",
    type: "gas_price",
    attributes: {
      updated_at: new Date().toISOString(),
      gas_type: "eip1559",
      info: {
        base_fee: 0.1,
        standard: {
          priority_fee: 0.05,
          max_fee: 0.25,
          estimation_seconds: 5,
        },
        fast: {
            priority_fee: 0.1,
            max_fee: 0.3,
            estimation_seconds: 2,
        },
        rapid: {
            priority_fee: 0.15,
            max_fee: 0.35,
            estimation_seconds: 1,
        },
        slow: {
            priority_fee: 0.02,
            max_fee: 0.2,
            estimation_seconds: 15,
        }
      },
    },
    relationships: {
      chain: {
        data: {
          id: "arbitrum",
          type: "chain",
        },
      },
    },
  },
  {
    id: "6",
    type: "gas_price",
    attributes: {
      updated_at: new Date().toISOString(),
      gas_type: "eip1559",
      info: {
        base_fee: 0.05,
        standard: {
          priority_fee: 0.01,
          max_fee: 0.1,
          estimation_seconds: 3,
        },
        fast: {
            priority_fee: 0.02,
            max_fee: 0.12,
            estimation_seconds: 1,
        },
        rapid: {
            priority_fee: 0.03,
            max_fee: 0.15,
            estimation_seconds: 0.5,
        },
        slow: {
            priority_fee: 0.005,
            max_fee: 0.08,
            estimation_seconds: 10,
        }
      },
    },
    relationships: {
      chain: {
        data: {
          id: "base",
          type: "chain",
        },
      },
    },
  },
];

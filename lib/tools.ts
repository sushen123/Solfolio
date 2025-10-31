// lib/tools.ts

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { FunctionDeclaration } from '@google/genai';

// TODO: Replace with your actual Zerion API key
const ZERION_API_KEY = process.env.ZERION_API_KEY || 'YOUR_ZERION_API_KEY';
const ZERION_API_BASE_URL = 'https://api.zerion.io/v1';

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${ZERION_API_KEY}:`).toString('base64')}`,
  }
};

// --- We keep your original tool definitions with execute logic ---
export const executableTools = {
  getWalletPortfolio: {
    description: "Get a high-level overview of a wallet's total value and top assets.",
    parameters: z.object({
      address: z.string().describe('The wallet address, e.g., "0x123...'),
    }),
    execute: async ({ address }: { address: string }) => {
      console.log(`Executing getWalletPortfolio for address: ${address}`);
      const url = `${ZERION_API_BASE_URL}/wallets/${address}/portfolio`;
      const response = await fetch(url, options);
      return response.json();
    },
  },
  getWalletFungiblePositions: {
    description: 'Get a detailed, paginated list of all fungible tokens a wallet holds.',
    parameters: z.object({
      address: z.string().describe('The wallet address, e.g., "0x123..."'),
    }),
    execute: async ({ address }: { address: string }) => {
      console.log(`Executing getWalletFungiblePositions for address: ${address}`);
      const url = `${ZERION_API_BASE_URL}/wallets/${address}/positions?currency=usd&sort=value`;
      const response = await fetch(url, options);
      return response.json();
    },
  },
  getWalletNFTs: {
    description: 'Fetch a list of all NFT collections and individual NFTs in a wallet.',
    parameters: z.object({
      address: z.string().describe('The wallet address, e.g., "0x123..."'),
    }),
    execute: async ({ address }: { address: string }) => {
      console.log(`Executing getWalletNFTs for address: ${address}`);
      const url = `${ZERION_API_BASE_URL}/wallets/${address}/nft-portfolio`;
      const response = await fetch(url, options);
      return response.json();
    },
  },
  getWalletTransactions: {
    description: "Retrieve the wallet's transaction history, with support for filtering.",
    parameters: z.object({
      address: z.string().describe('The wallet address, e.g., "0x123..."'),
    }),
    execute: async ({ address }: { address: string }) => {
      console.log(`Executing getWalletTransactions for address: ${address}`);
      const url = `${ZERION_API_BASE_URL}/wallets/${address}/transactions`;
      const response = await fetch(url, options);
      return response.json();
    },
  },
  getWalletPnL: {
    description: 'Get detailed Profit and Loss information for the wallet.',
    parameters: z.object({
      address: z.string().describe('The wallet address, e.g., "0x123..."'),
    }),
    execute: async ({ address }: { address: string }) => {
      console.log(`Executing getWalletPnL for address: ${address}`);
      const url = `${ZERION_API_BASE_URL}/wallets/${address}/pnl`;
      const response = await fetch(url, options);
      return response.json();
    },
  },
  generateWalletInsights: {
    description: "Analyzes a user's wallet portfolio to generate a 'Degen Score' and 3 key insights. Use this to provide a high-level analysis of a wallet's risk and composition.",
    parameters: z.object({
      address: z.string().describe('The wallet address to analyze, e.g., "0x123..."'),
    }),
    execute: async ({ address }: { address: string }) => {
      console.log(`Executing generateWalletInsights for address: ${address}`);
      
      try {
        // Part 1: Fetch raw portfolio data from Zerion
        const portfolioUrl = `${ZERION_API_BASE_URL}/wallets/${address}/portfolio`;
        const portfolioResponse = await fetch(portfolioUrl, options);
        if (!portfolioResponse.ok) throw new Error("Failed to fetch portfolio from Zerion.");
        const portfolioData = await portfolioResponse.json();

        // Part 2: Summarize the data into a simple string for the AI
        const totalValue = portfolioData.data.attributes.total.positions;
        const topPositions = portfolioData.data.attributes.positions.slice(0, 5);

        let summary = `The user's wallet has a total value of $${totalValue.toFixed(2)}. `;
        summary += `The top ${topPositions.length} assets are: `;
        topPositions.forEach((pos: any) => {
          const percentage = (pos.value / totalValue) * 100;
          summary += `${pos.asset.name} (${percentage.toFixed(1)}%), `;
        });

        // Part 3: Call the Gemini API with a specific prompt for analysis
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const prompt = `
          You are a crypto portfolio analyst. Based on the following wallet summary, generate a "Degen Score" and 3 key insights.
          The Degen Score is a number between 0 (very safe) and 100 (highly risky, degen).
          The insights must be short, one-sentence observations.
          Return ONLY a valid JSON object in this exact format: {"degenScore": number, "insights": ["string", "string", "string"]}

          Wallet Summary:
          ${summary}
        `;

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();
        
        // Clean the response to ensure it is valid JSON before parsing
        const jsonString = textResponse.replace(/```json|```/g, '').trim();
        const aiInsights = JSON.parse(jsonString);

        return aiInsights;

      } catch (error) {
        console.error("Error in generateWalletInsights:", error);
        return { error: "Failed to generate AI insights." };
      }
    },
  },
};

// --- New: Convert your Zod-based tools to Google GenAI FunctionDeclarations ---
export const googleGenAITools: FunctionDeclaration[] = Object.entries(
  executableTools
).map(([name, tool]) => {
  // Convert the Zod schema to a JSON schema
  const parametersJsonSchema = zodToJsonSchema(tool.parameters);

  return {
    name: name,
    description: tool.description,
    parametersJsonSchema,
  };
});
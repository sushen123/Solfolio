// app/api/ai/insights/route.ts

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// --- Zerion API Configuration ---
const ZERION_API_KEY = process.env.ZERION_API_KEY || 'YOUR_ZERION_API_KEY';
const ZERION_API_BASE_URL = 'https://api.zerion.io/v1';

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(`${ZERION_API_KEY}:`).toString('base64')}`,
  }
};

// --- Main API Handler ---
export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    // =======================================================================
    // Part 1: Fetch All Necessary Data Concurrently
    // =======================================================================
    console.log(`Fetching data for ${address} from Zerion...`);
    const urls = {
      portfolio: `${ZERION_API_BASE_URL}/wallets/${address}/portfolio`,
      positions: `${ZERION_API_BASE_URL}/wallets/${address}/positions?currency=usd&sort=value`,
      nfts: `${ZERION_API_BASE_URL}/wallets/${address}/nft-portfolio/?currency=usd&page[size]=15`,
      pnl: `${ZERION_API_BASE_URL}/wallets/${address}/pnl`,
    };

    // Use Promise.all to run all fetch requests in parallel
    const [portfolioRes, positionsRes, nftsRes, pnlRes] = await Promise.all([
      fetch(urls.portfolio, options),
      fetch(urls.positions, options),
      fetch(urls.nfts, options),
      fetch(urls.pnl, options),
    ]);


    // Check if any request failed
    if (!portfolioRes.ok || !positionsRes.ok || !nftsRes.ok || !pnlRes.ok) {
        console.log(portfolioRes.ok, positionsRes.ok, nftsRes.ok, pnlRes.ok)
      throw new Error("One or more Zerion API requests failed.");
    }

    // Parse all responses to JSON
    const [portfolioData, positionsData, nftsData, pnlData] = await Promise.all([
      portfolioRes.json(),
      positionsRes.json(),
      nftsRes.json(),
      pnlRes.json(),
    ]);

    // =======================================================================
    // Part 2: Summarize the Data for the AI
    // =======================================================================
     // =======================================================================
     console.log("Pruning raw data for AI analysis...");
 
 
     const relevantData = {
    portfolioData: portfolioData,
       pnldata: pnlData,
       nftCount: nftsData,
       topFungiblePositions: positionsData.data.slice(0, 10).map((pos: any) => ({
        assetName: pos.attributes.fungible_info?.name || pos.attributes.name,
        symbol: pos.attributes.fungible_info?.symbol || 'N/A',
        valueUSD: pos.attributes.value,
        chain: pos.relationships.chain.data.id,
        protocol: pos.attributes.protocol,
        positionType: pos.attributes.position_type,
      })),
     };

    // =======================================================================
    // Part 3: Call Gemini API for Analysis
    // =======================================================================
    console.log("Sending summary to Gemini for insights...");
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
    const modelName = "gemini-2.5-flash"; // Define model name once

    const prompt = `
           You are an expert crypto portfolio analyst. Based on the following JSON data representing a user's crypto wallet, generate a "Degen Score" and 3 key insights.
      
      - The 'Degen Score' is a number between 0 (very safe, diversified in blue-chips) and 100 (highly risky, concentrated in memecoins/altcoins). Consider the number of NFTs, the concentration in top assets, and the type of assets.
      - The 'insights' must be short, actionable, one-sentence observations about concentration, risk, or recent performance.
      - Return ONLY a valid JSON object in this exact format: {"degenScore": number, "insights": ["string", "string", "string"]}

      Wallet Data:
      ${JSON.stringify(relevantData, null, 2)}
    `;


    const result = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    const textResponse = result.text?.trim() || ""
    
    const jsonString = textResponse.replace(/```json|```/g, '').trim();
    const aiInsights = JSON.parse(jsonString);

    // =======================================================================
    // Part 4: Return the final insights to the frontend
    // =======================================================================
    return NextResponse.json(aiInsights);
    
  } catch (error: any) {
    console.error("Error in insights API route:", error.message);
    return NextResponse.json({ error: "Failed to generate AI insights." }, { status: 500 });
  }
}
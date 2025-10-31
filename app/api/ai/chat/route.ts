import { GoogleGenAI, FunctionCallingConfigMode, Part } from "@google/genai";
import { googleGenAITools, executableTools } from './../../../../lib/tools'; // Adjust the import path as needed

export const dynamic = "force-dynamic";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("Missing GOOGLE_API_KEY");
}

// Correct: Instantiate the client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const latestMessage = messages[messages.length - 1];
    const modelName = "gemini-2.5-flash"; // Define model name once

    // 1. === FIRST API CALL: Send user prompt and tools to the model ===
    // Correct: Call generateContent directly on ai.models
    const result = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: latestMessage.content }] }],
      config: {
        tools: [{ functionDeclarations: googleGenAITools }],
        toolConfig: {
          functionCallingConfig: {
            mode: FunctionCallingConfigMode.AUTO,
          },
        },
      },
      
    });

    
    const functionCalls = result.functionCalls

    // 2. === CHECK FOR FUNCTION CALL ===
    if (functionCalls && functionCalls.length > 0) {
      console.log('Model wants to call a tool:', functionCalls);

      const call = functionCalls[0];
      const toolToExecute = executableTools[call.name as keyof typeof executableTools];

      if (!toolToExecute) {
        throw new Error(`Unknown tool requested: ${call.name}`);
      }
      
      const toolResult = await toolToExecute.execute(call.args);

      // 3. === SECOND API CALL: Send the tool's result back to the model ===
      const toolResponseContent: Part[] = [
        { text: latestMessage.content },
        { functionCall: call },
        {
          functionResponse: {
            name: call.name,
            response: toolResult,
          },
        },
      ];
      
      // Correct: Call generateContentStream directly on ai.models
      const finalResultStream = await ai.models.generateContentStream({
        model: modelName,
        contents: [{ role: 'user', parts: toolResponseContent }],
      });

      // 4. === STREAM FINAL RESPONSE ===
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          for await (const chunk of finalResultStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });

    } else {
      // --- NO FUNCTION CALL - Normal streaming response ---
      // Correct: Call generateContentStream directly on ai.models
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents: [{ role: "user", parts: [{ text: latestMessage.content }] }],
      });

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  } catch (err) {
    console.error("Error with Google GenAI:", err);
    return new Response("An error occurred while processing your request.", {
      status: 500,
    });
  }
}
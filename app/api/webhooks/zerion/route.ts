
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received Zerion webhook:", JSON.stringify(body, null, 2));

    // TODO: Add signature verification logic here

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error("Error handling Zerion webhook:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
) {
  const { pathname } = request.nextUrl;
  const address = pathname.split('/')[3];
  
  const ZERION_API_KEY = process.env.ZERION_API_KEY;

  if (!ZERION_API_KEY) {
    return NextResponse.json({ error: 'Zerion API key not configured' }, { status: 500 });
  }

  const ZERION_API_URL = `https://api.zerion.io/v1/wallets/${address}/transactions`;

  try {
    const response = await fetch(ZERION_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${ZERION_API_KEY}:`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: 'Failed to fetch data from Zerion', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
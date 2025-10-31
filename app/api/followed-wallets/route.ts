import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret });
  if (!token || !token.sub) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    const followedWallets = await prisma.followedWallet.findMany({
      where: {
        userId: token.sub,
      },
    });
    return NextResponse.json(followedWallets);
  } catch (error) {
    console.error("GET /api/followed-wallets: Error fetching followed wallets:", error);
    return NextResponse.json({ error: "Failed to fetch followed wallets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret });
  if (!token || !token.sub) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const { label, address } = await req.json();

  if (!label || !address) {
    return NextResponse.json({ error: "Label and address are required" }, { status: 400 });
  }

  try {
    // Ensure the user exists in the database
    const user = await prisma.user.upsert({
      where: { id: token.sub },
      update: {},
      create: { id: token.sub },
    });

    const newFollowedWallet = await prisma.followedWallet.create({
      data: {
        userId: user.id,
        label,
        address,
      },
    });
    return NextResponse.json(newFollowedWallet);
  } catch (error) {
    console.error("POST /api/followed-wallets: Error creating followed wallet:", error);
    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Wallet with this address is already followed by this user." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create followed wallet" }, { status: 500 });
  }
}

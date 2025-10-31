
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const secret = process.env.NEXTAUTH_SECRET

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret })
  if (!token || !token.sub) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }

  const watchlist = await prisma.watchlistToken.findMany({
    where: {
      userId: token.sub,
    },
  })

  return NextResponse.json(watchlist)
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret })
  if (!token || !token.sub) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }

  const { tokenId } = await req.json()

  // Ensure the user exists in the database
  const user = await prisma.user.upsert({
    where: { id: token.sub },
    update: {},
    create: { id: token.sub },
  });

  // Upsert to avoid duplicates
  const newWatchlistToken = await prisma.watchlistToken.upsert({
    where: {
      userId_tokenId: {
        userId: user.id,
        tokenId: tokenId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      tokenId: tokenId,
    },
  })

  return NextResponse.json(newWatchlistToken)
}

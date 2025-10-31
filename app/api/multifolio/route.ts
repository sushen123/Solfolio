
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

  const portfolios = await prisma.portfolio.findMany({
    where: {
      userId: token.sub,
    },
  })

  return NextResponse.json(portfolios)
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret })
  if (!token || !token.sub) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }

  const { name, walletAddress } = await req.json()

  // Ensure the user exists in the database
  const user = await prisma.user.upsert({
    where: { id: token.sub },
    update: {},
    create: { id: token.sub },
  });

  const newPortfolio = await prisma.portfolio.create({
    data: {
      userId: user.id,
      name,
      walletAddress,
    },
  })

  return NextResponse.json(newPortfolio)
}

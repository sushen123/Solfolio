
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const secret = process.env.NEXTAUTH_SECRET

export async function DELETE(
  req: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  const token = await getToken({ req, secret })
  if (!token || !token.sub) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }

  const resolvedParams = await params;
  const { tokenId } = resolvedParams;

  if (!tokenId) {
    return NextResponse.json({ error: "Token ID is required" }, { status: 400 });
  }

  await prisma.watchlistToken.delete({
    where: {
      userId_tokenId: {
        userId: token.sub,
        tokenId: tokenId,
      },
    },
  })

  return NextResponse.json({ success: true })
}

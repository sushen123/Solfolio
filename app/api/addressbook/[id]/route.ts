
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const secret = process.env.NEXTAUTH_SECRET

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req, secret })
  if (!token || !token.sub) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }

  const { id } = params

  await prisma.addressBookEntry.delete({
    where: {
      id: id,
      userId: token.sub,
    },
  })

  return NextResponse.json({ success: true })
}

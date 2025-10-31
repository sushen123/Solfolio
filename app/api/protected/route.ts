import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.NEXTAUTH_SECRET

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret })

  if (!token || !token.sub) {
    return NextResponse.json({ error: "User wallet not authenticated" }, { status: 401 })
  }

  return NextResponse.json({
    content:
      "This is protected content. You can access this content because you are signed in with your Solana Wallet.",
  })
}

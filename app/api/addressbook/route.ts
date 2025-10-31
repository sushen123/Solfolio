
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

  const addressBook = await prisma.addressBookEntry.findMany({
    where: {
      userId: token.sub,
    },
  })

  return NextResponse.json(addressBook)
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret })
  if (!token || !token.sub) {
    console.log("POST /api/addressbook: User not authenticated");
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }

  const { label, address } = await req.json()
  console.log("POST /api/addressbook: Received data:", { userId: token.sub, label, address });

  try {
    // Ensure the user exists in the database
    const user = await prisma.user.upsert({
      where: { id: token.sub },
      update: {},
      create: { id: token.sub },
    });

    const newAddressBookEntry = await prisma.addressBookEntry.create({
      data: {
        userId: user.id,
        label,
        address,
      },
    })
    console.log("POST /api/addressbook: Successfully created entry:", newAddressBookEntry);
    return NextResponse.json(newAddressBookEntry)
  } catch (error) {
    console.error("POST /api/addressbook: Error creating entry:", error);
    return NextResponse.json({ error: "Failed to create address book entry" }, { status: 500 });
  }
}

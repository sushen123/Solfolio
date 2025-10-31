-- CreateTable
CREATE TABLE "FollowedWallet" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FollowedWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FollowedWallet_address_key" ON "FollowedWallet"("address");

-- CreateIndex
CREATE UNIQUE INDEX "FollowedWallet_userId_address_key" ON "FollowedWallet"("userId", "address");

-- AddForeignKey
ALTER TABLE "FollowedWallet" ADD CONSTRAINT "FollowedWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

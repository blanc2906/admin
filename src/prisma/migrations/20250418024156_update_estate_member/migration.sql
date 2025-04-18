/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EstateMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EstateMemberRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "EstateMemberStatus" AS ENUM ('ACTIVE', 'PENDING', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "_EstateMembers" DROP CONSTRAINT "_EstateMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_EstateMembers" DROP CONSTRAINT "_EstateMembers_B_fkey";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_EstateMembers";

-- CreateTable
CREATE TABLE "EstateMember" (
    "role" "EstateMemberRole" NOT NULL,
    "estateId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "nickname" VARCHAR(50),
    "status" "EstateMemberStatus" NOT NULL,
    "globalUserId" INTEGER,
    "fullName" VARCHAR(255),
    "emailAddress" VARCHAR(255),
    "phoneNumber" VARCHAR(50),
    "imageUrl" TEXT,
    "gender" VARCHAR(20),
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EstateMember_pkey" PRIMARY KEY ("estateId","userId")
);

-- CreateIndex
CREATE INDEX "EstateMember_userId_estateId_idx" ON "EstateMember"("userId", "estateId");

-- AddForeignKey
ALTER TABLE "EstateMember" ADD CONSTRAINT "EstateMember_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

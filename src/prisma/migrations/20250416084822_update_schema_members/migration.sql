/*
  Warnings:

  - The primary key for the `EstateMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `EstateMember` table. All the data in the column will be lost.
  - Added the required column `memberId` to the `EstateMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EstateMember_userId_estateId_idx";

-- AlterTable
ALTER TABLE "EstateMember" DROP CONSTRAINT "EstateMember_pkey",
DROP COLUMN "userId",
ADD COLUMN     "memberId" INTEGER NOT NULL,
ADD CONSTRAINT "EstateMember_pkey" PRIMARY KEY ("estateId", "memberId");

-- CreateIndex
CREATE INDEX "EstateMember_memberId_estateId_idx" ON "EstateMember"("memberId", "estateId");

/*
  Warnings:

  - The primary key for the `EstateMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `memberId` on the `EstateMember` table. All the data in the column will be lost.
  - Added the required column `userId` to the `EstateMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EstateMember_memberId_estateId_idx";

-- AlterTable
ALTER TABLE "EstateMember" DROP CONSTRAINT "EstateMember_pkey",
DROP COLUMN "memberId",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "emailAddress" VARCHAR(255),
ADD COLUMN     "fullName" VARCHAR(255),
ADD COLUMN     "gender" VARCHAR(20),
ADD COLUMN     "globalUserId" INTEGER,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "phoneNumber" VARCHAR(50),
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "EstateMember_pkey" PRIMARY KEY ("estateId", "userId");

-- CreateIndex
CREATE INDEX "EstateMember_userId_estateId_idx" ON "EstateMember"("userId", "estateId");

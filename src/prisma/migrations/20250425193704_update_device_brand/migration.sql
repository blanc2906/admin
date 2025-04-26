/*
  Warnings:

  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EstateMember" DROP CONSTRAINT "EstateMember_userId_fkey";

-- AlterTable
ALTER TABLE "EstateMember" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "emailAddress" VARCHAR(255),
ADD COLUMN     "fullName" VARCHAR(255),
ADD COLUMN     "gender" VARCHAR(20),
ADD COLUMN     "globalUserId" INTEGER,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "phoneNumber" VARCHAR(50);

-- DropTable
DROP TABLE "Member";

-- CreateTable
CREATE TABLE "DeviceBrand" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DeviceBrand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceBrand_code_key" ON "DeviceBrand"("code");

-- CreateIndex
CREATE INDEX "DeviceBrand_isDefault_idx" ON "DeviceBrand"("isDefault");

-- CreateIndex
CREATE INDEX "DeviceBrand_code_idx" ON "DeviceBrand"("code");

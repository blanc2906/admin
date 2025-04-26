/*
  Warnings:

  - You are about to drop the column `createdById` on the `Estate` table. All the data in the column will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AdminAccountRoles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EstateMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RolePermissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'SUB_ADMIN');

-- CreateEnum
CREATE TYPE "EstateMemberRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "EstateMemberStatus" AS ENUM ('ACTIVE', 'PENDING', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "Estate" DROP CONSTRAINT "Estate_createdById_fkey";

-- DropForeignKey
ALTER TABLE "_AdminAccountRoles" DROP CONSTRAINT "_AdminAccountRoles_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdminAccountRoles" DROP CONSTRAINT "_AdminAccountRoles_B_fkey";

-- DropForeignKey
ALTER TABLE "_EstateMembers" DROP CONSTRAINT "_EstateMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_EstateMembers" DROP CONSTRAINT "_EstateMembers_B_fkey";

-- DropForeignKey
ALTER TABLE "_RolePermissions" DROP CONSTRAINT "_RolePermissions_A_fkey";

-- DropForeignKey
ALTER TABLE "_RolePermissions" DROP CONSTRAINT "_RolePermissions_B_fkey";

-- DropIndex
DROP INDEX "Estate_createdById_idx";

-- AlterTable
ALTER TABLE "AdminAccount" ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'SUB_ADMIN';

-- AlterTable
ALTER TABLE "Estate" DROP COLUMN "createdById";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_AdminAccountRoles";

-- DropTable
DROP TABLE "_EstateMembers";

-- DropTable
DROP TABLE "_RolePermissions";

-- CreateTable
CREATE TABLE "EstateMember" (
    "role" "EstateMemberRole" NOT NULL,
    "estateId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "nickname" VARCHAR(50),
    "status" "EstateMemberStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EstateMember_pkey" PRIMARY KEY ("estateId","userId")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EstateMember_userId_estateId_idx" ON "EstateMember"("userId", "estateId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- AddForeignKey
ALTER TABLE "EstateMember" ADD CONSTRAINT "EstateMember_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstateMember" ADD CONSTRAINT "EstateMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

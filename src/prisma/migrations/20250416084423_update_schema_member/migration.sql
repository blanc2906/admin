/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EstateMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EstateMember" DROP CONSTRAINT "EstateMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "_EstateMembers" DROP CONSTRAINT "_EstateMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_EstateMembers" DROP CONSTRAINT "_EstateMembers_B_fkey";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_EstateMembers";

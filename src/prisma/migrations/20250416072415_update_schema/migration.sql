-- CreateEnum
CREATE TYPE "EstateMemberRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "EstateMemberStatus" AS ENUM ('ACTIVE', 'PENDING', 'BLOCKED');

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

-- CreateIndex
CREATE INDEX "EstateMember_userId_estateId_idx" ON "EstateMember"("userId", "estateId");

-- AddForeignKey
ALTER TABLE "EstateMember" ADD CONSTRAINT "EstateMember_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstateMember" ADD CONSTRAINT "EstateMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

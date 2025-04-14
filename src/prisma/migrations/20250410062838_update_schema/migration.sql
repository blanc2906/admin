-- CreateEnum
CREATE TYPE "EstateType" AS ENUM ('DEFAULT', 'APARTMENT', 'HOUSE', 'COMMERCIAL', 'SCHOOL');

-- CreateEnum
CREATE TYPE "EstateMemberRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "EstateMemberStatus" AS ENUM ('ACTIVE', 'PENDING', 'BLOCKED');

-- AlterTable
ALTER TABLE "AdminAccount" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Feature" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "meta" JSONB NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estate" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "imageFileUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageFileIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "type" "EstateType" NOT NULL,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Estate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstateArea" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "imageFileUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageFileIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EstateArea_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "imageFileUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageFileIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EstateMembers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EstateMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AreaDevices" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AreaDevices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feature_name_key" ON "Feature"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_table_key" ON "Feature"("table");

-- CreateIndex
CREATE INDEX "Feature_table_version_idx" ON "Feature"("table", "version");

-- CreateIndex
CREATE INDEX "Estate_type_idx" ON "Estate"("type");

-- CreateIndex
CREATE INDEX "Estate_createdById_idx" ON "Estate"("createdById");

-- CreateIndex
CREATE INDEX "EstateArea_estateId_idx" ON "EstateArea"("estateId");

-- CreateIndex
CREATE INDEX "EstateMember_userId_estateId_idx" ON "EstateMember"("userId", "estateId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_EstateMembers_B_index" ON "_EstateMembers"("B");

-- CreateIndex
CREATE INDEX "_AreaDevices_B_index" ON "_AreaDevices"("B");

-- CreateIndex
CREATE INDEX "AdminAccount_email_idx" ON "AdminAccount"("email");

-- CreateIndex
CREATE INDEX "AdminAccount_active_idx" ON "AdminAccount"("active");

-- AddForeignKey
ALTER TABLE "Estate" ADD CONSTRAINT "Estate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstateArea" ADD CONSTRAINT "EstateArea_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstateMember" ADD CONSTRAINT "EstateMember_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstateMember" ADD CONSTRAINT "EstateMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EstateMembers" ADD CONSTRAINT "_EstateMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EstateMembers" ADD CONSTRAINT "_EstateMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaDevices" ADD CONSTRAINT "_AreaDevices_A_fkey" FOREIGN KEY ("A") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaDevices" ADD CONSTRAINT "_AreaDevices_B_fkey" FOREIGN KEY ("B") REFERENCES "EstateArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
